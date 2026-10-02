import urllib.request
import json
import ssl
import sys

sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

base = 'https://stg-ecom.minhtech.com.vn/api'

accounts = [
    ('admin@noshop.vn', 'Admin@123', 'admin', 'Quản trị viên (Admin)'),
    ('seller@noshop.vn', 'Seller@123', 'seller', 'Người bán hàng (Seller)'),
    ('user@noshop.vn', 'User@123', 'buyer', 'Người mua hàng (User/Buyer)')
]

print("=== VERIFYING NOSHOP SAMPLE ACCOUNTS ===")
for email, password, expected_role, title in accounts:
    payload = json.dumps({'email': email, 'password': password}).encode('utf-8')
    req = urllib.request.Request(
        f'{base}/auth/login',
        data=payload,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as r:
            res = json.loads(r.read().decode('utf-8'))
            user = res['user']
            print(f"[OK] {title}:")
            print(f"     Email:    {user['email']}")
            print(f"     Password: {password}")
            print(f"     Role:     {user['role']}")
            print(f"     Name:     {user['name']}")
            print(f"     Token:    {res['token'][:25]}...")
    except Exception as e:
        print(f"[FAIL] {email}: {e}")

print("\n=== VERIFYING DEMO 1-CLICK ENDPOINTS ===")
for role in ['admin', 'seller', 'buyer']:
    payload = json.dumps({'role': role}).encode('utf-8')
    req = urllib.request.Request(
        f'{base}/auth/demo-login',
        data=payload,
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req, context=ctx) as r:
        res = json.loads(r.read().decode('utf-8'))
        print(f"[OK] Demo 1-click [{role}]: {res['user']['email']} ({res['user']['name']})")
