"""
Oud & Aura - Local Development, Razorpay Gateway & Order Management Server
Supports Static Web Assets, Razorpay API (Test Mode), and Owner Admin Order Management
"""

import os
import json
import csv
import io
import hmac
import hashlib
import time
import uuid
from datetime import datetime, timezone
from urllib.parse import urlparse, parse_qs
from http.server import HTTPServer, SimpleHTTPRequestHandler
import requests
from dotenv import load_dotenv

# Dynamic environment configuration
def get_razorpay_credentials():
    load_dotenv(override=True)
    key_id = os.environ.get("RAZORPAY_KEY_ID", "").strip()
    key_secret = os.environ.get("RAZORPAY_KEY_SECRET", "").strip()
    return key_id, key_secret

def get_admin_key():
    load_dotenv(override=True)
    return os.environ.get("ADMIN_KEY", "oudaura2026").strip()

PORT = int(os.environ.get("PORT", 8080))
ORDERS_FILE = os.path.join(os.path.dirname(__file__), "orders.json")

def load_orders():
    if os.path.exists(ORDERS_FILE):
        try:
            with open(ORDERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[Error loading orders]: {e}")
            return {}
    return {}

def save_orders(orders_dict):
    try:
        temp_file = ORDERS_FILE + ".tmp"
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(orders_dict, f, indent=2, ensure_ascii=False)
        os.replace(temp_file, ORDERS_FILE)
    except Exception as e:
        print(f"[Error saving orders]: {e}")

def find_order_key(orders, identifier):
    if not identifier:
        return None
    if identifier in orders:
        return identifier
    for k, v in orders.items():
        if (v.get("internal_order_id") == identifier or 
            v.get("order_id") == identifier or 
            v.get("razorpay_order_id") == identifier or 
            v.get("payment", {}).get("razorpay_order_id") == identifier):
            return k
    return None

def normalize_order_structure(order_data, key):
    """Normalize legacy order records to the complete new structure if needed."""
    customer = order_data.get("customer", {})
    if isinstance(customer, str):
        customer = {"full_address": customer, "name": "Valued Customer"}
    
    items = order_data.get("items", [])
    pricing = order_data.get("pricing", {})
    if not pricing:
        subtotal = sum(i.get("price", 0) * i.get("quantity", 1) for i in items) if items else order_data.get("amount_rupees", 0)
        pricing = {
            "subtotal": subtotal,
            "discount": 0,
            "shipping": 60 if (subtotal < 999 and subtotal > 0) else 0,
            "final_amount": order_data.get("total") or order_data.get("amount_rupees") or subtotal
        }

    payment = order_data.get("payment", {})
    if not payment:
        payment = {
            "method": order_data.get("payment_method", "Razorpay Online"),
            "status": order_data.get("status", "PENDING"),
            "razorpay_order_id": order_data.get("razorpay_order_id", key if key.startswith("order_") else ""),
            "razorpay_payment_id": order_data.get("payment_id", ""),
            "signature_verified": bool(order_data.get("signature")),
            "paid_at": order_data.get("paid_at", "")
        }

    fulfillment = order_data.get("fulfillment", {
        "carrier": order_data.get("carrier", ""),
        "tracking_number": order_data.get("tracking_number", ""),
        "shipped_at": order_data.get("shipped_at", None),
        "delivered_at": order_data.get("delivered_at", None),
        "notes": order_data.get("notes", "")
    })

    timeline = order_data.get("timeline", [])
    if not timeline:
        timeline = [{
            "status": payment.get("status", "CREATED"),
            "timestamp": order_data.get("created_at", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
            "note": "Initial order record"
        }]

    order_status = order_data.get("order_status") or order_data.get("status") or "PENDING"
    internal_id = order_data.get("internal_order_id") or order_data.get("order_id") or key

    return {
        "order_id": internal_id,
        "internal_order_id": internal_id,
        "key": key,
        "created_at": order_data.get("created_at", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
        "customer": {
            "name": customer.get("name", "Valued Customer"),
            "phone": customer.get("phone", ""),
            "email": customer.get("email", ""),
            "address_line1": customer.get("address_line1") or customer.get("address", ""),
            "address_line2": customer.get("address_line2", ""),
            "city": customer.get("city", "Mumbai"),
            "state": customer.get("state", "Maharashtra"),
            "pincode": customer.get("pincode", "400001"),
            "full_address": customer.get("full_address") or customer.get("address", "")
        },
        "items": items,
        "pricing": pricing,
        "total": pricing.get("final_amount", order_data.get("total", 0)),
        "payment": payment,
        "order_status": order_status,
        "fulfillment": fulfillment,
        "timeline": timeline,
        "failure_reason": order_data.get("failure_reason", "")
    }

class OudAuraRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_json(self, status_code, data):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Key")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(payload)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Key")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()

    def check_admin_auth(self):
        """Verify Admin Key from query parameter, Authorization header, or X-Admin-Key."""
        expected_key = get_admin_key()
        
        # Check query param ?key=...
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        if params.get("key") and params["key"][0] == expected_key:
            return True

        # Check X-Admin-Key header
        header_key = self.headers.get("X-Admin-Key")
        if header_key and header_key.strip() == expected_key:
            return True

        # Check Authorization: Bearer <key>
        auth_header = self.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
            if token == expected_key:
                return True

        return False

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        params = parse_qs(parsed.query)

        # Route 1: Payment Gateway Config
        if path == "/api/payment-config":
            key_id, key_secret = get_razorpay_credentials()
            is_configured = bool(key_id and key_secret)
            is_test_mode = key_id.startswith("rzp_test_")
            return self.send_json(200, {
                "configured": is_configured,
                "key_id": key_id if is_configured else "",
                "test_mode": is_test_mode,
                "currency": "INR"
            })

        # Route 2: Admin - Get All Orders
        elif path == "/api/admin/orders":
            if not self.check_admin_auth():
                return self.send_json(401, {"success": False, "message": "Unauthorized. Please provide valid Admin Key."})

            raw_orders = load_orders()
            orders_list = []
            for k, v in raw_orders.items():
                orders_list.append(normalize_order_structure(v, k))

            # Sort by created_at descending (newest first)
            orders_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)

            # Compute KPI Stats
            total_orders = len(orders_list)
            total_revenue = sum(
                o.get("pricing", {}).get("final_amount", 0) 
                for o in orders_list 
                if o.get("payment", {}).get("status") == "PAID"
            )
            paid_count = sum(1 for o in orders_list if o.get("order_status") == "PAID")
            processing_count = sum(1 for o in orders_list if o.get("order_status") == "PROCESSING")
            shipped_count = sum(1 for o in orders_list if o.get("order_status") == "SHIPPED")
            delivered_count = sum(1 for o in orders_list if o.get("order_status") == "DELIVERED")
            cod_count = sum(1 for o in orders_list if "COD" in o.get("payment", {}).get("method", "").upper() or o.get("payment", {}).get("status") == "COD_PENDING")
            cancelled_count = sum(1 for o in orders_list if o.get("order_status") == "CANCELLED" or o.get("payment", {}).get("status") == "FAILED")

            return self.send_json(200, {
                "success": True,
                "stats": {
                    "total_orders": total_orders,
                    "total_revenue": total_revenue,
                    "paid_orders": paid_count,
                    "processing_orders": processing_count,
                    "shipped_orders": shipped_count,
                    "delivered_orders": delivered_count,
                    "cod_orders": cod_count,
                    "cancelled_orders": cancelled_count
                },
                "orders": orders_list
            })

        # Route 3: Admin - Get Single Order Detail
        elif path == "/api/admin/order":
            if not self.check_admin_auth():
                return self.send_json(401, {"success": False, "message": "Unauthorized."})

            order_id = params.get("id", [None])[0]
            if not order_id:
                return self.send_json(400, {"success": False, "message": "Missing order id parameter"})

            raw_orders = load_orders()
            key = find_order_key(raw_orders, order_id)
            if not key:
                return self.send_json(404, {"success": False, "message": f"Order {order_id} not found"})

            return self.send_json(200, {
                "success": True,
                "order": normalize_order_structure(raw_orders[key], key)
            })

        # Route 4: Admin - Export Orders CSV
        elif path == "/api/admin/export":
            if not self.check_admin_auth():
                return self.send_json(401, {"success": False, "message": "Unauthorized."})

            raw_orders = load_orders()
            orders_list = [normalize_order_structure(v, k) for k, v in raw_orders.items()]
            orders_list.sort(key=lambda x: x.get("created_at", ""), reverse=True)

            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow([
                "Order ID", "Date & Time", "Customer Name", "Phone", "Email",
                "Address", "City", "State", "PIN Code",
                "Items Count", "Items Summary", "Subtotal (INR)", "Shipping (INR)", "Total (INR)",
                "Payment Method", "Payment Status", "Razorpay Order ID", "Razorpay Payment ID",
                "Order Status", "Carrier", "Tracking Number", "Admin Notes"
            ])

            for o in orders_list:
                cust = o.get("customer", {})
                pricing = o.get("pricing", {})
                pay = o.get("payment", {})
                fulf = o.get("fulfillment", {})
                items_str = " | ".join(f"{i.get('name')} ({i.get('size')}) x{i.get('quantity')}" for i in o.get("items", []))
                
                writer.writerow([
                    o.get("order_id", ""),
                    o.get("created_at", ""),
                    cust.get("name", ""),
                    cust.get("phone", ""),
                    cust.get("email", ""),
                    cust.get("full_address", ""),
                    cust.get("city", ""),
                    cust.get("state", ""),
                    cust.get("pincode", ""),
                    len(o.get("items", [])),
                    items_str,
                    pricing.get("subtotal", 0),
                    pricing.get("shipping", 0),
                    pricing.get("final_amount", 0),
                    pay.get("method", ""),
                    pay.get("status", ""),
                    pay.get("razorpay_order_id", ""),
                    pay.get("razorpay_payment_id", ""),
                    o.get("order_status", ""),
                    fulf.get("carrier", ""),
                    fulf.get("tracking_number", ""),
                    fulf.get("notes", "")
                ])

            csv_data = output.getvalue().encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/csv; charset=utf-8")
            self.send_header("Content-Disposition", f'attachment; filename="oud_aura_orders_{int(time.time())}.csv"')
            self.send_header("Content-Length", str(len(csv_data)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(csv_data)
            return

        # Default static file serving
        return super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b""

        try:
            data = json.loads(body.decode("utf-8")) if body else {}
        except Exception:
            return self.send_json(400, {"success": False, "message": "Invalid JSON payload"})

        # Route 1: Create Razorpay Order (Server-Side)
        if self.path == "/api/create-order":
            key_id, key_secret = get_razorpay_credentials()
            if not key_id or not key_secret:
                return self.send_json(400, {
                    "success": False,
                    "code": "MISSING_CREDENTIALS",
                    "message": "Razorpay test credentials are not configured in your .env file."
                })

            amount_in_rupees = data.get("amount")
            if not amount_in_rupees or float(amount_in_rupees) <= 0:
                return self.send_json(400, {"success": False, "message": "Invalid order amount"})

            amount_paise = int(round(float(amount_in_rupees) * 100))
            customer = data.get("customer", {})
            items = data.get("items", [])
            pricing = data.get("pricing", {
                "subtotal": float(amount_in_rupees),
                "discount": 0,
                "shipping": 0,
                "final_amount": float(amount_in_rupees)
            })

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

                # Register complete pending order state
                orders = load_orders()
                order_ref = f"OA-{int(time.time()) % 100000:05d}"
                created_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

                orders[rzp_data["id"]] = {
                    "order_id": order_ref,
                    "internal_order_id": order_ref,
                    "razorpay_order_id": rzp_data["id"],
                    "created_at": created_now,
                    "customer": {
                        "name": customer.get("name", "Valued Customer"),
                        "phone": customer.get("phone", ""),
                        "email": customer.get("email", ""),
                        "address_line1": customer.get("address_line1", ""),
                        "address_line2": customer.get("address_line2", ""),
                        "city": customer.get("city", ""),
                        "state": customer.get("state", ""),
                        "pincode": customer.get("pincode", ""),
                        "full_address": customer.get("full_address") or customer.get("address", "")
                    },
                    "items": items,
                    "pricing": pricing,
                    "total": float(amount_in_rupees),
                    "payment": {
                        "method": "Razorpay Online",
                        "status": "PENDING_PAYMENT",
                        "razorpay_order_id": rzp_data["id"],
                        "razorpay_payment_id": "",
                        "signature_verified": False,
                        "paid_at": None
                    },
                    "order_status": "PENDING",
                    "fulfillment": {
                        "carrier": "",
                        "tracking_number": "",
                        "shipped_at": None,
                        "delivered_at": None,
                        "notes": ""
                    },
                    "timeline": [
                        {
                            "status": "ORDER_CREATED",
                            "timestamp": created_now,
                            "note": f"Order initiated on website via Razorpay (Order ID: {rzp_data['id']})"
                        }
                    ]
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

        # Route 2: Create Cash on Delivery (COD) Order
        elif self.path == "/api/create-cod-order":
            amount_in_rupees = data.get("amount")
            if not amount_in_rupees or float(amount_in_rupees) <= 0:
                return self.send_json(400, {"success": False, "message": "Invalid order amount"})

            customer = data.get("customer", {})
            items = data.get("items", [])
            pricing = data.get("pricing", {
                "subtotal": float(amount_in_rupees),
                "discount": 0,
                "shipping": 0,
                "final_amount": float(amount_in_rupees)
            })

            order_ref = f"OA-{int(time.time()) % 100000:05d}"
            created_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            orders = load_orders()
            orders[order_ref] = {
                "order_id": order_ref,
                "internal_order_id": order_ref,
                "razorpay_order_id": "",
                "created_at": created_now,
                "customer": {
                    "name": customer.get("name", "Valued Customer"),
                    "phone": customer.get("phone", ""),
                    "email": customer.get("email", ""),
                    "address_line1": customer.get("address_line1", ""),
                    "address_line2": customer.get("address_line2", ""),
                    "city": customer.get("city", ""),
                    "state": customer.get("state", ""),
                    "pincode": customer.get("pincode", ""),
                    "full_address": customer.get("full_address") or customer.get("address", "")
                },
                "items": items,
                "pricing": pricing,
                "total": float(amount_in_rupees),
                "payment": {
                    "method": "Cash on Delivery",
                    "status": "COD_PENDING",
                    "razorpay_order_id": "",
                    "razorpay_payment_id": "",
                    "signature_verified": False,
                    "paid_at": None
                },
                "order_status": "PROCESSING",
                "fulfillment": {
                    "carrier": "",
                    "tracking_number": "",
                    "shipped_at": None,
                    "delivered_at": None,
                    "notes": "Doorstep payment upon delivery"
                },
                "timeline": [
                    {
                        "status": "COD_PLACED",
                        "timestamp": created_now,
                        "note": "Customer booked Cash on Delivery order"
                    }
                ]
            }
            save_orders(orders)
            print(f"[COD ORDER CREATED]: {order_ref} for {customer.get('name')}")

            return self.send_json(200, {
                "success": True,
                "order_id": order_ref,
                "message": "COD order recorded successfully."
            })

        # Route 3: Server-Side Signature Verification & Order Mark PAID
        elif self.path == "/api/verify-payment":
            key_id, key_secret = get_razorpay_credentials()
            if not key_secret:
                return self.send_json(500, {
                    "success": False,
                    "message": "Razorpay Secret Key not configured on server."
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

            # Constant-time comparison
            is_valid = hmac.compare_digest(generated_signature, rzp_signature)

            if not is_valid:
                print(f"[SECURITY ALERT]: Invalid signature attempt for order {rzp_order_id}")
                return self.send_json(400, {
                    "success": False,
                    "verified": False,
                    "message": "Payment verification failed. Cryptographic signature does not match."
                })

            # Update order state: ONLY after HMAC verification mark as PAID
            orders = load_orders()
            order_key = find_order_key(orders, rzp_order_id) or rzp_order_id
            existing = orders.get(order_key, {})

            # Prevent duplicate processing (Idempotency)
            if existing.get("payment", {}).get("status") == "PAID" or existing.get("status") == "PAID":
                return self.send_json(200, {
                    "success": True,
                    "verified": True,
                    "already_processed": True,
                    "order_id": existing.get("internal_order_id", order_key),
                    "payment_id": existing.get("payment", {}).get("razorpay_payment_id", rzp_payment_id),
                    "message": "Payment was already verified."
                })

            internal_order_id = existing.get("internal_order_id") or order_details.get("orderId") or f"OA-{int(time.time()) % 100000:05d}"
            paid_now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Merge customer details
            customer = order_details.get("customer") or existing.get("customer", {})
            items = order_details.get("items") or existing.get("items", [])
            pricing = order_details.get("pricing") or existing.get("pricing", {
                "subtotal": order_details.get("total", 0),
                "discount": 0,
                "shipping": 0,
                "final_amount": order_details.get("total", 0)
            })

            timeline = existing.get("timeline", [])
            timeline.append({
                "status": "PAID",
                "timestamp": paid_now,
                "note": f"Payment verified via Razorpay HMAC SHA256 (Payment ID: {rzp_payment_id})"
            })

            updated_order = {
                **existing,
                "order_id": internal_order_id,
                "internal_order_id": internal_order_id,
                "razorpay_order_id": rzp_order_id,
                "created_at": existing.get("created_at", paid_now),
                "customer": customer,
                "items": items,
                "pricing": pricing,
                "total": pricing.get("final_amount", order_details.get("total", 0)),
                "payment": {
                    "method": "Razorpay Online",
                    "status": "PAID",
                    "razorpay_order_id": rzp_order_id,
                    "razorpay_payment_id": rzp_payment_id,
                    "signature": rzp_signature,
                    "signature_verified": True,
                    "paid_at": paid_now
                },
                "order_status": "PAID",
                "fulfillment": existing.get("fulfillment", {
                    "carrier": "",
                    "tracking_number": "",
                    "shipped_at": None,
                    "delivered_at": None,
                    "notes": ""
                }),
                "timeline": timeline
            }

            orders[order_key] = updated_order
            save_orders(orders)

            print(f"[PAYMENT VERIFIED SUCCESS]: Order {internal_order_id} (Razorpay: {rzp_order_id}, Payment: {rzp_payment_id})")

            return self.send_json(200, {
                "success": True,
                "verified": True,
                "order_id": internal_order_id,
                "payment_id": rzp_payment_id,
                "status": "PAID",
                "message": "Payment signature verified successfully. Order confirmed."
            })

        # Route 4: Log Payment Failure or Abandonment
        elif self.path == "/api/payment-failed":
            rzp_order_id = data.get("razorpay_order_id")
            reason = data.get("reason", "Cancelled / Closed by user")
            orders = load_orders()
            order_key = find_order_key(orders, rzp_order_id)
            if order_key:
                if orders[order_key].get("payment", {}).get("status") != "PAID" and orders[order_key].get("status") != "PAID":
                    if "payment" not in orders[order_key]:
                        orders[order_key]["payment"] = {}
                    orders[order_key]["payment"]["status"] = "FAILED"
                    orders[order_key]["order_status"] = "PAYMENT_FAILED"
                    orders[order_key]["failure_reason"] = reason
                    if "timeline" not in orders[order_key]:
                        orders[order_key]["timeline"] = []
                    orders[order_key]["timeline"].append({
                        "status": "PAYMENT_FAILED",
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "note": f"Payment failed: {reason}"
                    })
                    save_orders(orders)
            return self.send_json(200, {"success": True, "logged": True})

        # Route 5: Admin - Update Order Status & Fulfillment Tracking
        elif self.path == "/api/admin/update-status":
            if not self.check_admin_auth():
                return self.send_json(401, {"success": False, "message": "Unauthorized."})

            order_id = data.get("order_id")
            new_status = data.get("new_status")
            carrier = data.get("carrier")
            tracking_number = data.get("tracking_number")
            note = data.get("note", "")

            valid_statuses = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
            if not order_id or not new_status or new_status not in valid_statuses:
                return self.send_json(400, {
                    "success": False, 
                    "message": f"Invalid order_id or status. Allowed statuses: {', '.join(valid_statuses)}"
                })

            orders = load_orders()
            order_key = find_order_key(orders, order_id)
            if not order_key:
                return self.send_json(404, {"success": False, "message": f"Order {order_id} not found"})

            order = normalize_order_structure(orders[order_key], order_key)
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            order["order_status"] = new_status
            if carrier is not None:
                order["fulfillment"]["carrier"] = carrier
            if tracking_number is not None:
                order["fulfillment"]["tracking_number"] = tracking_number
            if note:
                order["fulfillment"]["notes"] = note

            if new_status == "SHIPPED" and not order["fulfillment"].get("shipped_at"):
                order["fulfillment"]["shipped_at"] = now_str
            elif new_status == "DELIVERED" and not order["fulfillment"].get("delivered_at"):
                order["fulfillment"]["delivered_at"] = now_str

            timeline_note = f"Status updated to {new_status}"
            if tracking_number:
                timeline_note += f" (Carrier: {carrier or 'Courier'}, Tracking: {tracking_number})"
            if note:
                timeline_note += f" - {note}"

            order["timeline"].append({
                "status": new_status,
                "timestamp": now_str,
                "note": timeline_note
            })

            orders[order_key] = order
            save_orders(orders)
            print(f"[ADMIN STATUS UPDATE]: Order {order['order_id']} -> {new_status}")

            return self.send_json(200, {
                "success": True,
                "message": f"Order status successfully updated to {new_status}.",
                "order": order
            })

        return self.send_json(404, {"success": False, "message": "Endpoint not found"})

def run():
    server_address = ("0.0.0.0", PORT)
    httpd = HTTPServer(server_address, OudAuraRequestHandler)
    key_id, key_secret = get_razorpay_credentials()
    admin_key = get_admin_key()
    print("=" * 70)
    print(f" Oud & Aura Development Server Running on http://localhost:{PORT}")
    print(f" Razorpay Configured: {'YES (Test Mode)' if (key_id and key_secret) else 'NO (Set credentials in .env)'}")
    if key_id:
        print(f" Razorpay Key ID: {key_id}")
    print(f" Admin Dashboard: http://localhost:{PORT}/admin.html")
    print(f" Admin Passcode: {admin_key}")
    print("=" * 70)
    httpd.serve_forever()

if __name__ == "__main__":
    run()
