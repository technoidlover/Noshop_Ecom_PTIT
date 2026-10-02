import urllib.request
import base64
import json
import ssl

ctx = ssl.create_default_context()

url = "https://harbor.nodesign.vn/api/v2.0/quotas/2"
auth = base64.b64encode(b"nodesign:HnG06062024@").decode()

payload = json.dumps({"hard": {"storage": -1}}).encode()

req = urllib.request.Request(
    url,
    data=payload,
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Basic {auth}"
    },
    method="PUT"
)

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        print("Status:", response.status)
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code, e.reason)
    print(e.read().decode())
except Exception as e:
    print("Error:", e)
