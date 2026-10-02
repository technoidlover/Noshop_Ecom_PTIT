import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    '/',
    '/products',
    '/products?keyword=iPhone',
    '/cart',
    '/checkout',
    '/orders',
    '/login',
    '/register',
    '/seller/dashboard',
    '/seller/products',
    '/seller/orders',
    '/admin/dashboard',
    '/admin/users',
    '/admin/categories',
    '/admin/orders'
]

headers = {'User-Agent': 'Mozilla/5.0'}
errors = 0

print("Testing live web pages:")
for u in urls:
    full_url = 'https://stg-ecom.minhtech.com.vn' + u
    req = urllib.request.Request(full_url, headers=headers)
    try:
        with urllib.request.urlopen(req, context=ctx) as res:
            print(f"{u:25} -> {res.status} OK")
    except Exception as e:
        print(f"{u:25} -> ERROR: {e}")
        errors += 1

print(f"\nTotal tested: {len(urls)}, Errors: {errors}")
if errors > 0:
    exit(1)
