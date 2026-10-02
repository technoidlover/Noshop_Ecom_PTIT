import urllib.request
import json
import ssl
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://stg-ecom.minhtech.com.vn/api"

def request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, context=ctx) as res:
        return json.loads(res.read().decode())

print("--- 1. Health Check ---")
health = request("/health")
print("Health:", health)

print("\n--- 2. Demo Logins ---")
buyer_res = request("/auth/demo-login", "POST", {"role": "buyer"})
print("Buyer Logged in:", buyer_res["user"]["name"], "Token:", buyer_res["token"][:15] + "...")

seller_res = request("/auth/demo-login", "POST", {"role": "seller"})
print("Seller Logged in:", seller_res["user"]["name"], "Shop:", seller_res["user"]["shop"]["name"])

admin_res = request("/auth/demo-login", "POST", {"role": "admin"})
print("Admin Logged in:", admin_res["user"]["name"], "Role:", admin_res["user"]["role"])

print("\n--- 3. Buyer Creates Order ---")
prods = request("/products?limit=2")
p1 = prods["products"][0]
order_payload = {
    "items": [{"productId": p1["_id"], "quantity": 1}],
    "shippingAddress": {
        "fullName": "Trần Văn Test",
        "phone": "0987654321",
        "address": "Tầng 5 Keangnam Hanoi Landmark Tower",
        "city": "Hà Nội",
        "note": "Test automated verification"
    },
    "paymentMethod": "COD"
}
new_order = request("/orders", "POST", order_payload, token=buyer_res["token"])
order_id = new_order["order"]["_id"]
print("Created Order:", new_order["order"]["orderCode"], "Total:", new_order["order"]["totalAmount"])

print("\n--- 4. Seller Updates Order Status ---")
update_res = request(f"/orders/{order_id}/status", "PUT", {"orderStatus": "PROCESSING"}, token=seller_res["token"])
print("Order status updated to:", update_res["order"]["orderStatus"])

print("\n--- 5. Admin Gets Statistics ---")
stats = request("/stats/admin", "GET", token=admin_res["token"])
print("Platform Stats:")
print(f"  - Total Revenue: {stats['totalRevenue']:,} VND")
print(f"  - Total Orders: {stats['totalOrders']}")
print(f"  - Total Products: {stats['totalProducts']}")
print(f"  - Total Users: {stats['totalUsers']}")

print("\nALL ROLE WORKFLOWS VERIFIED SUCCESSFULLY!")
