import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Review } from '../models/Review';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

export const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing collections.');

    // Create Passwords
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123', salt);
    const sellerPassword = await bcrypt.hash('Seller@123', salt);
    const userPassword = await bcrypt.hash('User@123', salt);

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Quản Trị Viên (Admin)',
      email: 'admin@noshop.vn',
      password: adminPassword,
      role: 'admin',
      phone: '0901234567',
      address: 'Tòa nhà noshop, Hà Nội',
      isActive: true
    });

    const techSeller = await User.create({
      name: 'noshop Official Store',
      email: 'seller@noshop.vn',
      password: sellerPassword,
      role: 'seller',
      phone: '0988776655',
      address: '150 Cầu Giấy, Hà Nội',
      shop: {
        name: 'noshop Official Store',
        description: 'Gian hàng chính hãng phân phối thiết bị công nghệ và đời sống.',
        phone: '0988776655',
        address: '150 Cầu Giấy, Hà Nội',
        logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80'
      },
      isActive: true
    });

    const fashionSeller = await User.create({
      name: 'noshop Fashion',
      email: 'fashion@noshop.vn',
      password: sellerPassword,
      role: 'seller',
      phone: '0977112233',
      address: '88 Nguyễn Huệ, Quận 1, TP.HCM',
      shop: {
        name: 'noshop Fashion',
        description: 'Thời trang nam nữ cao cấp, phong cách thanh lịch.',
        phone: '0977112233',
        address: '88 Nguyễn Huệ, Quận 1, TP.HCM',
        logo: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=200&auto=format&fit=crop&q=80'
      },
      isActive: true
    });

    const buyerUser = await User.create({
      name: 'Nguyễn Văn Mua (User)',
      email: 'user@noshop.vn',
      password: userPassword,
      role: 'buyer',
      phone: '0912348899',
      address: 'Số 25 Phố Huế, Hoàn Kiếm, Hà Nội',
      isActive: true
    });

    // Also create buyer@noshop.vn for convenience
    await User.create({
      name: 'Khách Hàng (Buyer)',
      email: 'buyer@noshop.vn',
      password: userPassword,
      role: 'buyer',
      phone: '0912348888',
      address: 'Số 10 Tràng Thi, Hoàn Kiếm, Hà Nội',
      isActive: true
    });

    console.log('Created noshop users: Admin, Seller, User/Buyer.');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Điện Thoại & Tablet',
        slug: 'dien-thoai-tablet',
        description: 'Smartphone, máy tính bảng chính hãng mới nhất',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Laptop & Máy Tính',
        slug: 'laptop-may-tinh',
        description: 'Laptop gaming, ultrabook và phụ kiện máy tính',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Thiết Bị Âm Thanh',
        slug: 'thiet-bi-am-thanh',
        description: 'Tai nghe bluetooth, loa không dây chất âm đỉnh cao',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Đồng Hồ & Vòng Đeo',
        slug: 'dong-ho-vong-deo',
        description: 'Smartwatch và đồng hồ thời trang thanh lịch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Thời Trang & Phụ Kiện',
        slug: 'thoi-trang-phu-kien',
        description: 'Quần áo, túi xách, giày dép hiện đại',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&auto=format&fit=crop&q=80'
      },
      {
        name: 'Gia Dụng Thông Minh',
        slug: 'gia-dung-thong-minh',
        description: 'Robot hút bụi, máy lọc không khí và đồ gia dụng',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=80'
      }
    ];

    const categories = await Category.insertMany(categoriesData);
    console.log(`Created ${categories.length} categories.`);

    const catMap = new Map(categories.map(c => [c.slug, c._id]));

    // 3. Create Products
    const productsData = [
      {
        name: 'iPhone 16 Pro Max 256GB Titan Tự Nhiên',
        slug: 'iphone-16-pro-max-256gb',
        description: 'iPhone 16 Pro Max với vi xử lý A18 Pro mạnh mẽ, camera điều khiển chuyên nghiệp, thời lượng pin tốt nhất từng có trên iPhone.',
        price: 34990000,
        originalPrice: 37990000,
        stock: 50,
        sold: 25,
        category: catMap.get('dien-thoai-tablet'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 18
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G 512GB',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Quyền năng Galaxy AI với khung viền Titan siêu bền, bút S Pen tích hợp, camera 200MP zoom quang học 100x.',
        price: 29990000,
        originalPrice: 33990000,
        stock: 40,
        sold: 19,
        category: catMap.get('dien-thoai-tablet'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.8,
        numReviews: 12
      },
      {
        name: 'MacBook Pro 16 inch M3 Pro (18GB RAM / 512GB SSD)',
        slug: 'macbook-pro-16-m3-pro',
        description: 'Màn hình Liquid Retina XDR tuyệt đẹp, hiệu năng xử lý đồ họa và lập trình vô song, thời lượng pin lên đến 22 tiếng.',
        price: 54990000,
        originalPrice: 59990000,
        stock: 20,
        sold: 8,
        category: catMap.get('laptop-may-tinh'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 5.0,
        numReviews: 7
      },
      {
        name: 'Dell XPS 13 Plus 9320 Core i7 / 16GB / 1TB',
        slug: 'dell-xps-13-plus-9320',
        description: 'Thiết kế bàn phím tràn viền hiện đại, touchpad vô hình tinh tế, màn hình OLED 3.5K sắc nét.',
        price: 36500000,
        originalPrice: 41000000,
        stock: 15,
        sold: 5,
        category: catMap.get('laptop-may-tinh'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.7,
        numReviews: 4
      },
      {
        name: 'Tai Nghe Chống Ồn Sony WH-1000XM5',
        slug: 'tai-nghe-sony-wh-1000xm5',
        description: 'Khả năng chống ồn chủ động đỉnh cao, âm thanh Hi-Res chân thực, thiết kế đệm tai êm ái thoáng khí suốt cả ngày.',
        price: 6990000,
        originalPrice: 8490000,
        stock: 80,
        sold: 42,
        category: catMap.get('thiet-bi-am-thanh'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 31
      },
      {
        name: 'Tai Nghe Apple AirPods Pro 2 USB-C',
        slug: 'apple-airpods-pro-2-usb-c',
        description: 'Chip H2 mang lại khả năng chống ồn gấp đôi, âm thanh thích ứng tự động, kháng nước và bụi chuẩn IP54.',
        price: 5290000,
        originalPrice: 6190000,
        stock: 100,
        sold: 65,
        category: catMap.get('thiet-bi-am-thanh'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 50
      },
      {
        name: 'Đồng Hồ Apple Watch Series 9 45mm Nhôm GPS',
        slug: 'apple-watch-series-9-45mm',
        description: 'Cử chỉ chạm hai lần thông minh, màn hình siêu sáng 2000 nits, theo dõi nồng độ oxy trong máu và điện tâm đồ.',
        price: 9890000,
        originalPrice: 11290000,
        stock: 35,
        sold: 14,
        category: catMap.get('dong-ho-vong-deo'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.8,
        numReviews: 9
      },
      {
        name: 'Đồng Hồ Garmin Forerunner 265 Music',
        slug: 'dong-ho-garmin-forerunner-265',
        description: 'Màn hình cảm ứng AMOLED rực rỡ, tính năng đánh giá khả năng sẵn sàng luyện tập chuyên sâu, pin 13 ngày.',
        price: 11690000,
        originalPrice: 12500000,
        stock: 25,
        sold: 11,
        category: catMap.get('dong-ho-vong-deo'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 6
      },
      {
        name: 'Áo Khoác Blazer Nam Form Slim-Fit Hàn Quốc',
        slug: 'ao-khoac-blazer-nam-slimfit',
        description: 'Chất liệu vải tuyết mưa cao cấp, đứng form tôn dáng, phù hợp cả đi làm văn phòng và dự tiệc lịch lãm.',
        price: 850000,
        originalPrice: 1200000,
        stock: 120,
        sold: 78,
        category: catMap.get('thoi-trang-phu-kien'),
        seller: fashionSeller._id,
        images: [
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.7,
        numReviews: 24
      },
      {
        name: 'Túi Xách Nữ Da Thật Phong Cách Minimalist',
        slug: 'tui-xach-nu-da-that-minimalist',
        description: 'Da bò thật 100% gia công tỉ mỉ, khóa mạ vàng chống trầy, quai đeo điều chỉnh linh hoạt.',
        price: 1450000,
        originalPrice: 1850000,
        stock: 60,
        sold: 33,
        category: catMap.get('thoi-trang-phu-kien'),
        seller: fashionSeller._id,
        images: [
          'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.8,
        numReviews: 15
      },
      {
        name: 'Robot Hút Bụi Lau Nhà Dreame L20 Ultra',
        slug: 'robot-hut-bui-dreame-l20-ultra',
        description: 'Lực hút 7000Pa mạnh mẽ, công nghệ vươn giẻ lau sát tường MopExtend, tự động giặt sấy giẻ bằng khí nóng.',
        price: 18990000,
        originalPrice: 22990000,
        stock: 18,
        sold: 10,
        category: catMap.get('gia-dung-thong-minh'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.9,
        numReviews: 8
      },
      {
        name: 'Máy Lọc Không Khí Xiaomi Smart Air Purifier 4 Pro',
        slug: 'may-loc-khong-khi-xiaomi-4-pro',
        description: 'Lọc 99.97% bụi mịn PM2.5, khử mùi formaldehyde hiệu quả cho diện tích phòng lên tới 60m2.',
        price: 4290000,
        originalPrice: 5190000,
        stock: 45,
        sold: 27,
        category: catMap.get('gia-dung-thong-minh'),
        seller: techSeller._id,
        images: [
          'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80'
        ],
        rating: 4.8,
        numReviews: 19
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`Created ${products.length} products.`);

    // 4. Create an initial sample order for Buyer
    const sampleProduct1 = products[0];
    const sampleProduct2 = products[4];

    await Order.create({
      orderCode: 'ORD-20260913-DEMO01',
      buyer: buyerUser._id,
      items: [
        {
          product: sampleProduct1._id,
          name: sampleProduct1.name,
          price: sampleProduct1.price,
          quantity: 1,
          image: sampleProduct1.images[0],
          seller: sampleProduct1.seller
        },
        {
          product: sampleProduct2._id,
          name: sampleProduct2.name,
          price: sampleProduct2.price,
          quantity: 1,
          image: sampleProduct2.images[0],
          seller: sampleProduct2.seller
        }
      ],
      shippingAddress: {
        fullName: 'Trần Văn Khách',
        phone: '0912348899',
        address: 'Số 25 Phố Huế, Hoàn Kiếm, Hà Nội',
        city: 'Hà Nội',
        note: 'Giao hàng trong giờ hành chính'
      },
      paymentMethod: 'COD',
      paymentStatus: 'UNPAID',
      orderStatus: 'PROCESSING',
      totalAmount: sampleProduct1.price + sampleProduct2.price
    });

    console.log('Created sample demo order.');
    console.log('Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}
