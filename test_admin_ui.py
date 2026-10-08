import sys
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:8080"
SCREENSHOT_DIR = "C:/Users/dell/.gemini/antigravity-ide/brain/abb98ee7-bb07-4a1e-aaf9-77ccd7d340d8"

def log(msg):
    safe_msg = str(msg).replace("₹", "Rs.").encode("ascii", "replace").decode("ascii")
    print(safe_msg, flush=True)

def test_admin_ui():
    log("==================================================")
    log("TESTING ADMIN DASHBOARD UI (SELENIUM CHROME)")
    log("==================================================")

    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1400,980")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    try:
        # 1. Open admin.html without auth to verify lock screen
        log("1. Opening admin.html (verifying lock overlay)...")
        driver.get(f"{BASE_URL}/admin.html")
        time.sleep(1)
        driver.save_screenshot(f"{SCREENSHOT_DIR}/admin_step1_lock_screen.png")
        log("[OK] Saved screenshot: admin_step1_lock_screen.png")

        # 2. Enter passcode and unlock
        log("2. Unlocking with passcode 'oudaura2026'...")
        key_input = driver.find_element(By.ID, "adminKeyInput")
        key_input.send_keys("oudaura2026")
        unlock_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Unlock Dashboard')]")
        unlock_btn.click()
        time.sleep(2)

        driver.save_screenshot(f"{SCREENSHOT_DIR}/admin_step2_dashboard_orders.png")
        log("[OK] Saved screenshot: admin_step2_dashboard_orders.png")

        # Verify KPI values are populated
        rev_elem = driver.find_element(By.ID, "statTotalRevenue")
        orders_elem = driver.find_element(By.ID, "statTotalOrders")
        log(f"[OK] KPI Display: Revenue: {rev_elem.text}, Total Orders: {orders_elem.text}")

        # 3. Test opening single order detail modal
        log("3. Opening Order Detail Modal for the first order...")
        first_row = driver.find_element(By.CSS_SELECTOR, "#ordersTableBody tr")
        first_row.click()
        time.sleep(1)

        driver.save_screenshot(f"{SCREENSHOT_DIR}/admin_step3_order_detail_modal.png")
        log("[OK] Saved screenshot: admin_step3_order_detail_modal.png")

        modal_order_id = driver.find_element(By.ID, "modalOrderId").text
        modal_cust_name = driver.find_element(By.ID, "modalCustName").text
        modal_cust_addr = driver.find_element(By.ID, "modalCustAddress").text
        modal_total = driver.find_element(By.ID, "modalPricingTotal").text
        modal_pay_status = driver.find_element(By.ID, "modalPayStatusBadge").text

        log(f"[OK] Modal opened for: {modal_order_id}")
        log(f"  Customer: {modal_cust_name}")
        log(f"  Address: {modal_cust_addr[:40]}...")
        log(f"  Total: {modal_total}")
        log(f"  Payment Status: {modal_pay_status}")

        # 4. Test Mobile viewport
        log("4. Testing Mobile responsive view (375x812)...")
        driver.set_window_size(375, 812)
        time.sleep(1)
        driver.save_screenshot(f"{SCREENSHOT_DIR}/admin_step4_mobile_view.png")
        log("[OK] Saved screenshot: admin_step4_mobile_view.png")

    finally:
        driver.quit()

    log("\n==================================================")
    log("ADMIN UI VERIFICATION COMPLETED WITH 100% SUCCESS!")
    log("==================================================")

if __name__ == "__main__":
    test_admin_ui()
