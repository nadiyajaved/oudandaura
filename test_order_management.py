import sys
import json
import time
import requests

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8080"
ADMIN_KEY = "oudaura2026"

def log(msg):
    clean = str(msg).replace("₹", "Rs.").encode("ascii", "replace").decode("ascii")
    print(clean, flush=True)

def run_tests():
    log("==================================================")
    log("TESTING ORDER MANAGEMENT SYSTEM & ADMIN BACKEND")
    log("==================================================")

    # 1. Test Unauthorized Access
    log("\n1. Testing Unauthorized Admin Access:")
    r = requests.get(f"{BASE_URL}/api/admin/orders")
    assert r.status_code == 401, f"Security issue: Expected 401, got {r.status_code}"
    log("[OK] Unauthorized access blocked with HTTP 401")

    # 2. Test Authorized Admin Access
    log("\n2. Testing Authorized Admin Access:")
    r = requests.get(f"{BASE_URL}/api/admin/orders?key={ADMIN_KEY}")
    assert r.status_code == 200, f"Failed with code {r.status_code}"
    data = r.json()
    assert data["success"] is True
    stats = data["stats"]
    orders = data["orders"]
    log(f"[OK] Admin Orders Retrieved: {len(orders)} total orders")
    log(f"[OK] KPI Stats: Total Rev: Rs.{stats['total_revenue']}, Paid: {stats['paid_orders']}, Processing: {stats['processing_orders']}, Shipped: {stats['shipped_orders']}")

    # 3. Test Cash on Delivery (COD) Order Creation
    log("\n3. Testing Cash on Delivery (COD) Order Creation:")
    cod_payload = {
        "amount": 1298,
        "pricing": {
            "subtotal": 1298,
            "discount": 0,
            "shipping": 0,
            "final_amount": 1298
        },
        "customer": {
            "name": "Kabir Mehta",
            "phone": "+91 9811122233",
            "email": "kabir.mehta@example.com",
            "address_line1": "Flat 702, Skyline Towers",
            "address_line2": "Bandra West",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400050",
            "full_address": "Flat 702, Skyline Towers, Bandra West, Mumbai, Maharashtra - 400050"
        },
        "items": [
            {
                "id": "arabian_touch",
                "name": "Arabian Touch",
                "size": "50 ml",
                "price": 649,
                "quantity": 2,
                "subtotal": 1298,
                "image": "arabiantouch1.jpg"
            }
        ]
    }
    r = requests.post(f"{BASE_URL}/api/create-cod-order", json=cod_payload)
    assert r.status_code == 200, f"COD failed: {r.status_code}"
    cod_data = r.json()
    cod_order_id = cod_data["order_id"]
    log(f"[OK] Created COD Order: {cod_order_id}")

    # 4. Verify COD Order in Admin List
    r = requests.get(f"{BASE_URL}/api/admin/order?id={cod_order_id}&key={ADMIN_KEY}")
    assert r.status_code == 200
    cod_order = r.json()["order"]
    assert cod_order["customer"]["name"] == "Kabir Mehta"
    assert cod_order["payment"]["method"] == "Cash on Delivery"
    assert cod_order["payment"]["status"] == "COD_PENDING"
    assert cod_order["order_status"] == "PROCESSING"
    log(f"[OK] Verified COD Order Details in Admin API: {cod_order['order_id']}, Status: {cod_order['order_status']}")

    # 5. Test Status Transitions: PROCESSING -> SHIPPED -> DELIVERED
    log("\n4. Testing Order Status Updates:")
    
    # Update to SHIPPED
    ship_payload = {
        "order_id": cod_order_id,
        "new_status": "SHIPPED",
        "carrier": "BlueDart Express",
        "tracking_number": "BD9988776655",
        "note": "Dispatched in velvet pouch and presentation box"
    }
    r = requests.post(f"{BASE_URL}/api/admin/update-status", json=ship_payload, headers={"X-Admin-Key": ADMIN_KEY})
    assert r.status_code == 200
    updated = r.json()["order"]
    assert updated["order_status"] == "SHIPPED"
    assert updated["fulfillment"]["carrier"] == "BlueDart Express"
    assert updated["fulfillment"]["tracking_number"] == "BD9988776655"
    log(f"[OK] Order #{cod_order_id} marked as SHIPPED with Tracking BD9988776655")

    # Update to DELIVERED
    deliver_payload = {
        "order_id": cod_order_id,
        "new_status": "DELIVERED",
        "carrier": "BlueDart Express",
        "tracking_number": "BD9988776655",
        "note": "Delivered and cash collected at doorstep"
    }
    r = requests.post(f"{BASE_URL}/api/admin/update-status", json=deliver_payload, headers={"X-Admin-Key": ADMIN_KEY})
    assert r.status_code == 200
    updated2 = r.json()["order"]
    assert updated2["order_status"] == "DELIVERED"
    log(f"[OK] Order #{cod_order_id} marked as DELIVERED")

    # 6. Test CSV Export
    log("\n5. Testing CSV Export:")
    r = requests.get(f"{BASE_URL}/api/admin/export?key={ADMIN_KEY}")
    assert r.status_code == 200
    assert "text/csv" in r.headers.get("Content-Type", "")
    csv_text = r.text
    assert "Order ID,Date & Time,Customer Name" in csv_text
    assert "Kabir Mehta" in csv_text
    log(f"[OK] Exported CSV containing {len(csv_text.splitlines())} lines (including headers)")

    log("\n==================================================")
    log("ALL BACKEND & ADMIN TESTS PASSED PERFECTLY!")
    log("==================================================")

if __name__ == "__main__":
    run_tests()
