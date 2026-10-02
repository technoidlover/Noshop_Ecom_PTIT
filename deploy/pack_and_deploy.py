import os
import tarfile
import subprocess
import sys

BASE_DIR = r"e:\Ecommerce"
SERVER = "root@150.95.104.244"
REMOTE_PATH = "/opt/ecommerce"

def make_tar(source_dir, output_filename, exclude_dirs):
    print(f"Creating archive {output_filename} from {source_dir}...")
    with tarfile.open(output_filename, "w:gz") as tar:
        for root, dirs, files in os.walk(source_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, os.path.dirname(source_dir))
                tar.add(full_path, arcname=rel_path)
    size_mb = os.path.getsize(output_filename) / (1024 * 1024)
    print(f"Created {output_filename} ({size_mb:.2f} MB)")

def main():
    print(f"Ensuring remote directories exist on {SERVER}...")
    subprocess.run(["ssh", SERVER, "mkdir -p /opt/ecommerce/data/mongo /opt/ecommerce/data/uploads"], check=True)

    backend_tar = os.path.join(BASE_DIR, "deploy", "backend.tar.gz")
    frontend_tar = os.path.join(BASE_DIR, "deploy", "frontend.tar.gz")
    compose_file = os.path.join(BASE_DIR, "deploy", "docker-compose.yml")

    make_tar(os.path.join(BASE_DIR, "backend"), backend_tar, ["node_modules", "dist", ".git"])
    make_tar(os.path.join(BASE_DIR, "frontend"), frontend_tar, ["node_modules", ".next", ".git"])

    print("Uploading archives and docker-compose.yml to server...")
    subprocess.run(["scp", backend_tar, frontend_tar, compose_file, f"{SERVER}:{REMOTE_PATH}/"], check=True)

    remote_sh = """set -e
cd /opt/ecommerce
echo "Extracting backend..."
tar -xzf backend.tar.gz
echo "Extracting frontend..."
tar -xzf frontend.tar.gz

echo "Building backend Docker image..."
docker build -t harbor.nodesign.vn/ecommerce/backend:latest ./backend

echo "Building frontend Docker image..."
docker build -t harbor.nodesign.vn/ecommerce/frontend:latest ./frontend

echo "Attempting Harbor push (skipping if Harbor is offline/502)..."
if docker login harbor.nodesign.vn -u nodesign -p 'HnG06062024@' 2>/dev/null; then
    docker push harbor.nodesign.vn/ecommerce/backend:latest || echo "Backend push failed, skipping..."
    docker push harbor.nodesign.vn/ecommerce/frontend:latest || echo "Frontend push failed, skipping..."
    echo "Harbor sync attempted."
else
    echo "Harbor login unavailable, skipping registry upload as requested."
fi

echo "Starting containers with Docker Compose..."
docker compose up -d --force-recreate

echo "Waiting 8 seconds for backend & mongo to initialize..."
sleep 8

echo "Seeding database with noshop data..."
docker exec ecommerce_backend node dist/seed/seedData.js

echo "DEPLOYMENT COMPLETE!"
docker compose ps
"""
    remote_script_path = os.path.join(BASE_DIR, "deploy", "remote_build.sh")
    with open(remote_script_path, "w", newline="\n") as f:
        f.write(remote_sh)

    print("Uploading remote script...")
    subprocess.run(["scp", remote_script_path, f"{SERVER}:{REMOTE_PATH}/remote_build.sh"], check=True)

    print("Executing remote build & deploy...")
    res = subprocess.run(["ssh", SERVER, "bash /opt/ecommerce/remote_build.sh"])
    if res.returncode != 0:
        print("Remote script failed!")
        sys.exit(1)
    print("Remote build & deploy finished successfully on 150.95.104.244!")

if __name__ == '__main__':
    main()
