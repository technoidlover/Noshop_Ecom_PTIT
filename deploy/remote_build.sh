set -e
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
