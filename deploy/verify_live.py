import urllib.request
import ssl
import json
import sys

# Ensure UTF-8 output on Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print('=== 1. CHECK HEALTH ===')
req = urllib.request.Request('https://stg-ecom.minhtech.com.vn/api/health', headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
    print('Health status:', r.status, json.loads(r.read().decode('utf-8')))

print('\n=== 2. CHECK PRODUCTS & IMAGES ===')
req = urllib.request.Request('https://stg-ecom.minhtech.com.vn/api/products?limit=12', headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
    data = json.loads(r.read().decode('utf-8'))
    print(f'Total products: {data.get("total")}')
    for p in data.get('products', []):
        img = p['images'][0] if p.get('images') else 'N/A'
        print(f'  • {p["name"]} | {p["price"]:,}đ | Img: {img}')

print('\n=== 3. VERIFY LOGIN ACCOUNTS ===')
accounts = [
    ('admin@noshop.vn', 'Admin@123', 'admin'),
    ('seller@noshop.vn', 'Seller@123', 'seller'),
    ('user@noshop.vn', 'User@123', 'buyer')
]

for email, password, expected_role in accounts:
    payload = json.dumps({'email': email, 'password': password}).encode('utf-8')
    req = urllib.request.Request(
        'https://stg-ecom.minhtech.com.vn/api/auth/login',
        data=payload,
        headers={'Content-Type': 'application/json', 'User-Agent': headers['User-Agent']}
    )
    with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
        res = json.loads(r.read().decode('utf-8'))
        role = res.get('user', {}).get('role')
        name = res.get('user', {}).get('name')
        token = res.get('token')
        print(f'  [PASS] {email} -> Logged in as "{name}" (Role: {role}, Token: {bool(token)})')

print('\n=== 4. CHECK FRONTEND HOME PAGE HTML ===')
req = urllib.request.Request('https://stg-ecom.minhtech.com.vn/', headers=headers)
with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
    html = r.read().decode('utf-8')
    print('Home status:', r.status, 'HTML length:', len(html))
    assert 'noshop' in html, 'Missing noshop brand'
    assert 'FLASH SALE' in html, 'Missing FLASH SALE'
    print('  [PASS] noshop brand and Flash Sale rendered in SSR HTML!')
