"""
Oud & Aura - Local Development & Payment Server
Supports Static Web Assets & Secure Server-Side Razorpay API (Test Mode)
"""

import os
import json
import hmac
import hashlib
import time
import uuid
from http.server import HTTPServer, SimpleHTTPRequestHandler
import requests
from dotenv import load_dotenv

# Dynamic environment configuration
def get_razorpay_credentials():
    load_dotenv(override=True)
    key_id = os.environ.get("RAZORPAY_KEY_ID", "").strip()
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "").strip()
    return key_id, key_secret

PORT = int(os.environ.get("PORT", 8080))

ORDERS_FILE = os.path.join(os.path.dirname(__file__), "orders.json")

def load_orders():
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_orders(orders_dict):
    try:
        with open(ORDERS_FILE, "w", encoding="utf-8") as f:
            json.dump(orders_dict, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"[Error saving orders]: {e}")

class OudAuraRequestHandler(SimpleHTTPRequestHandler):
    def send_json(self, status_code, data):
        payload = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/payment-config":
            key_id, key_secret = get_razorpay_credentials()
            is_configured = bool(key_id and key_secret)
            is_test_mode = key_id.startswith("rzp_test_")
            return self.send_json(200, {
                "configured": is_configured,
                "key_id": key_id if is_configured else "",
                "test_mode": is_test_mode,
                "currency": "INR"
            })
        
        # Default static file handler
        return super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            data = json.loads(body.decode("utf-8"))
        except Exception:
            return self.send_json(400, {"success": False, "message": "Invalid JSON payload"})

        # Route 1: Create Razorpay Order
        if self.path == "/api/create-order":
            key_id, key_secret = get_razorpay_credentials()
            if not key_id or not key_secret:
                return self.send_json(400, {
                    "success": False,
                    "code": "MISSING_CREDENTIALS",
                    "message": "Razorpay test credentials are not configured in your .env file. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
                })

            amount_in_rupees = data.get("amount")
            if not amount_in_rupees or float(amount_in_rupees) <= 0:
                return self.send_json(400, {
                    "success": False,
                    "message": "Invalid order amount"
                })

            amount_paise = int(round(float(amount_in_rupees) * 100))
            notes = data.get("notes", {})
            customer = data.get("customer", {})
            items = data.get("items", [])

            # Generate receipt id
            receipt_id = f"oa_rcpt_{int(time.time())}_{uuid.uuid4().hex[:6]}"

            # Call Razorpay Orders API server-side
            try:
                rzp_response = requests.post(
                    "https://api.razorpay.com/v1/orders",
                    auth=(key_id, key_secret),
                    json={
                        "amount": amount_paise,
                        "currency": "INR",
                        "receipt": receipt_id,
                        "notes": {
                            "customer_name": str(customer.get("name", ""))[:40],
                            "customer_phone": str(customer.get("phone", ""))[:20],
                            "customer_email": str(customer.get("email", ""))[:40],
                            "store": "Oud & Aura"
                        }
                    },
                    timeout=12
                )
                
                rzp_data = rzp_response.json()

                if rzp_response.status_code != 200:
                    err_msg = rzp_data.get("error", {}).get("description", "Failed to create Razorpay Order")
                    return self.send_json(rzp_response.status_code, {
                        "success": False,
                        "message": err_msg,
                        "details": rzp_data
                    })

                # Register initial order state locally
                orders = load_orders()
                order_ref = f"OA-{int(time.time()) % 100000:05d}"
                orders[rzp_data["id"]] = {
                    "internal_order_id": order_ref,
                    "razorpay_order_id": rzp_data["id"],
                    "amount_rupees": float(amount_in_rupees),
                    "amount_paise": amount_paise,
                    "status": "CREATED",
                    "customer": customer,
                    "items": items,
                    "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                save_orders(orders)

                return self.send_json(200, {
                    "success": True,
                    "order_id": rzp_data["id"],
                    "internal_order_id": order_ref,
                    "amount": amount_paise,
                    "currency": "INR",
                    "key_id": key_id
                })

            except requests.exceptions.RequestException as e:
                return self.send_json(502, {
                    "success": False,
                    "message": f"Network error contacting Razorpay: {str(e)}"
                })

        # Route 2: Server-Side Signature Verification & Order Confirmation
        elif self.path == "/api/verify-payment":
            key_id, key_secret = get_razorpay_credentials()
            if not key_secret:
                return self.send_json(500, {
                    "success": False,
                    "message": "Razorpay Secret Key not found on server."
                })

            rzp_order_id = data.get("razorpay_order_id")
            rzp_payment_id = data.get("razorpay_payment_id")
            rzp_signature = data.get("razorpay_signature")
            order_details = data.get("order_details", {})

            if not rzp_order_id or not rzp_payment_id or not rzp_signature:
                return self.send_json(400, {
                    "success": False,
                    "message": "Missing payment verification parameters (order_id, payment_id, signature)"
                })

            # Compute HMAC SHA256 signature
            message = f"{rzp_order_id}|{rzp_payment_id}".encode("utf-8")
            generated_signature = hmac.new(
                key_secret.encode("utf-8"),
                message,
                hashlib.sha256
            ).hexdigest()

            # Constant-time comparison to prevent timing attacks
            is_valid = hmac.compare_digest(generated_signature, rzp_signature)

            if not is_valid:
                print(f"[SECURITY ALERT]: Invalid signature attempt for order {rzp_order_id}")
                return self.send_json(400, {
                    "success": False,
                    "verified": False,
                    "message": "Payment verification failed. Invalid signature."
                })

            # Check orders registry and mark as PAID (idempotent)
            orders = load_orders()
            existing_order = orders.get(rzp_order_id, {})
            
            # Prevent duplicate processing
            if existing_order.get("status") == "PAID":
                return self.send_json(200, {
                    "success": True,
                    "verified": True,
                    "already_processed": True,
                    "order_id": existing_order.get("internal_order_id", rzp_order_id),
                    "payment_id": existing_order.get("payment_id", rzp_payment_id),
                    "message": "Payment was already verified."
                })

            internal_order_id = existing_order.get("internal_order_id") or order_details.get("orderId") or f"OA-{int(time.time()) % 100000:05d}"
            
            orders[rzp_order_id] = {
                **existing_order,
                "internal_order_id": internal_order_id,
                "razorpay_order_id": rzp_order_id,
                "payment_id": rzp_payment_id,
                "signature": rzp_signature,
                "status": "PAID",
                "payment_method": "Razorpay Online",
                "paid_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "customer": order_details.get("customer") or existing_order.get("customer"),
                "items": order_details.get("items") or existing_order.get("items"),
                "total": order_details.get("total") or existing_order.get("amount_rupees")
            }
            save_orders(orders)

            print(f"[PAYMENT VERIFIED SUCCESS]: Order {internal_order_id} (Razorpay: {rzp_order_id}, Payment: {rzp_payment_id})")

            return self.send_json(200, {
                "success": True,
                "verified": True,
                "order_id": internal_order_id,
                "payment_id": rzp_payment_id,
                "status": "PAID",
                "message": "Payment signature verified successfully."
            })

        # Route 3: Log Payment Failure / Abandonment
        elif self.path == "/api/payment-failed":
            rzp_order_id = data.get("razorpay_order_id")
            reason = data.get("reason", "Cancelled / Closed by user")
            orders = load_orders()
            if rzp_order_id and rzp_order_id in orders:
                if orders[rzp_order_id].get("status") != "PAID":
                    orders[rzp_order_id]["status"] = "FAILED"
                    orders[rzp_order_id]["failure_reason"] = reason
                    save_orders(orders)
            return self.send_json(200, {"success": True, "logged": True})

        return self.send_json(404, {"success": False, "message": "Endpoint not found"})

def run():
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, OudAuraRequestHandler)
    key_id, key_secret = get_razorpay_credentials()
    print("=" * 65)
    print(f" Oud & Aura Development Server Running on http://localhost:{PORT}")
    print(f" Razorpay Configured: {'YES (Test Mode)' if (key_id and key_secret) else 'NO (Set credentials in .env)'}")
    if key_id:
        print(f" Key ID: {key_id}")
    print("=" * 65)
    httpd.serve_forever()

if __name__ == "__main__":
    run()
