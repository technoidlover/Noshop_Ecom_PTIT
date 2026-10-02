import urllib.request
import json
import ssl
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

BASE_URL = "https://stg-ecom.minhtech.com.vn"
HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0"
}

def req(path, method="GET", data=None, token=None):
    h = dict(HEADERS)
    if token:
        h["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data else None
    r = urllib.request.Request(f"{BASE_URL}{path}", data=body, headers=h, method=method)
    with urllib.request.urlopen(r, context=ctx) as res:
        return json.loads(res.read().decode())

print("1. Fetching products...")
prods_res = req("/api/products")
products = prods_res["products"]
p1 = products[0]
print(f"   Found product: {p1['name']} (_id: {p1['_id']})")

print(f"2. Testing product detail page: /products/{p1['_id']}")
req_page = urllib.request.Request(f"{BASE_URL}/products/{p1['_id']}", headers=HEADERS)
with urllib.request.urlopen(req_page, context=ctx) as res:
    print(f"   Status: {res.status} OK")

print("3. Testing buyer registration with duplicate email handling...")
buyer_login = req("/api/auth/demo-login", "POST", {"role": "buyer"})
token = buyer_login["token"]

# Attempt to register with existing email
try:
    req("/api/auth/register", "POST", {
        "name": "Duplicate User",
        "email": "buyer@noshop.vn",
        "password": "Password@123"
    })
    print("   WARNING: Duplicate email was not rejected!")
except urllib.error.HTTPError as e:
    err_body = json.loads(e.read().decode())
    print(f"   Correctly rejected duplicate email: {err_body.get('message')}")

print("4. Testing review submission...")
review_res = req("/api/reviews", "POST", {
    "productId": p1["_id"],
    "rating": 5,
    "comment": "Sản phẩm dùng rất mượt và pin siêu trâu, đóng gói cẩn thận!"
}, token=token)
print(f"   Review created! ID: {review_res['review']['_id']}")

print("5. Testing seller product creation...")
seller_login = req("/api/auth/demo-login", "POST", {"role": "seller"})
seller_token = seller_login["token"]

new_prod = req("/api/products", "POST", {
    "name": "Bàn Phím Cơ Không Dây noshop Pro X",
    "description": "Bàn phím cơ Custom cao cấp 3 mode kết nối Bluetooth/2.4G/Type-C",
    "price": 1850000,
    "originalPrice": 2200000,
    "stock": 50,
    "category": p1["category"] if isinstance(p1["category"], str) else p1["category"]["_id"],
    "images": ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800"]
}, token=seller_token)
created_prod_id = new_prod["product"]["_id"]
print(f"   Created product: {new_prod['product']['name']} (ID: {created_prod_id})")

print("7. Testing seller updating that product...")
updated_prod = req(f"/api/products/{created_prod_id}", "PUT", {
    "price": 1750000,
    "stock": 28
}, token=seller_token)
print(f"   Updated price to {updated_prod['product']['price']} VND")

print("8. Testing seller deleting that product...")
del_res = req(f"/api/products/{created_prod_id}", "DELETE", token=seller_token)
print(f"   Delete response: {del_res['message']}")

print("\nALL DYNAMIC OPERATIONS PASSED SUCCESSFULLY!")
