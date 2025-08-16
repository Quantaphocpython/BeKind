# BeKind - Nền Tảng Từ Thiện Blockchain

> Một nền tảng từ thiện hiện đại được xây dựng trên công nghệ blockchain, đảm bảo tính minh bạch, bảo mật và khả năng truy xuất cho mọi khoản quyên góp.

## Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cài Đặt](#cài-đặt)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Sử Dụng](#sử-dụng)
- [Đóng Góp](#đóng-góp)
- [Giấy Phép](#giấy-phép)

## Giới Thiệu

BeKind là một ứng dụng web hiện đại được thiết kế để kết nối người quyên góp trực tiếp với những người cần giúp đỡ. Sử dụng công nghệ blockchain, chúng tôi đảm bảo:

- **Minh Bạch Hoàn Toàn**: Mọi giao dịch đều được ghi lại trên blockchain
- **Bảo Mật Tối Đa**: Bảo vệ thông tin người dùng với mã hóa cấp độ quân sự
- **Truy Xuất Thời Gian Thực**: Theo dõi tác động của từng khoản quyên góp
- **Không Có Phí Ẩn**: Chi phí rõ ràng, minh bạch

## Tính Năng Chính

### Trang Chủ

- **Hero Section**: Giới thiệu tổng quan về nền tảng
- **Thống Kê**: Hiển thị số liệu về tác động của cộng đồng
- **Dự Án Nổi Bật**: Các chiến dịch từ thiện đang diễn ra
- **Tính Năng**: Mô tả các tính năng chính của nền tảng
- **Đánh Giá**: Phản hồi từ người dùng và đối tác

### Quản Lý Chiến Dịch

- **Tạo Chiến Dịch**: Hệ thống tạo chiến dịch từ thiện dễ dàng
- **Rich Text Editor**: Trình soạn thảo văn bản đa năng với hỗ trợ hình ảnh
- **Quản Lý Nội Dung**: Chỉnh sửa và cập nhật thông tin chiến dịch
- **Theo Dõi Tiến Độ**: Hiển thị tiến độ quyên góp theo thời gian thực

### Hệ Thống Người Dùng

- **Đăng Ký/Đăng Nhập**: Hỗ trợ ví điện tử và tài khoản truyền thống
- **Hồ Sơ Người Dùng**: Quản lý thông tin cá nhân và lịch sử quyên góp
- **Ví Điện Tử**: Tích hợp với các ví blockchain phổ biến

### Quyên Góp & Thanh Toán

- **Đa Dạng Phương Thức**: Hỗ trợ nhiều loại tiền điện tử và tiền pháp định
- **Thanh Toán An Toàn**: Bảo mật thông tin thanh toán
- **Xác Minh Giao Dịch**: Mọi giao dịch đều được xác minh trên blockchain

### Minh Bạch & Báo Cáo

- **Báo Cáo Thời Gian Thực**: Cập nhật tình trạng chiến dịch
- **Bằng Chứng Sử Dụng**: Hình ảnh và tài liệu về việc sử dụng quỹ
- **Lịch Sử Giao Dịch**: Truy xuất đầy đủ lịch sử quyên góp

## Công Nghệ Sử Dụng

### Frontend

- **Next.js 14**: Framework React hiện đại với App Router
- **TypeScript**: Ngôn ngữ lập trình type-safe
- **Tailwind CSS**: Framework CSS utility-first
- **Shadcn/ui**: Component library đẹp và tùy chỉnh được
- **GSAP**: Animation library cho hiệu ứng mượt mà
- **Framer Motion**: Animation cho React components

### Backend & Database

- **Prisma ORM**: Database toolkit hiện đại
- **MongoDB**: NoSQL database linh hoạt
- **Next.js API Routes**: Serverless API endpoints

### Blockchain & Web3

- **Wagmi**: React hooks cho Ethereum
- **Viem**: TypeScript interface cho Ethereum
- **RainbowKit**: Wallet connection UI

### Email & Communication

- **Brevo (Sendinblue)**: Email service với template HTML
- **File-based Templates**: Template email lưu trữ local

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **pnpm**: Package manager nhanh và hiệu quả

## Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js 18+
- pnpm 8+
- MongoDB database

### Bước 1: Clone Repository

```bash
git clone https://github.com/your-username/bekind.git
cd bekind
```

### Bước 2: Cài Đặt Dependencies

```bash
pnpm install
```

### Bước 3: Cấu Hình Environment Variables

Tạo file `.env.local` và thêm các biến môi trường:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/bekind"

# Email Service (Brevo)
BREVO_API_KEY="your-brevo-api-key"
BREVO_SENDER_EMAIL="noreply@yourdomain.com"

# Web3 Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-walletconnect-project-id"

# Firebase (nếu sử dụng)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

### Bước 4: Setup Database

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma db push
```

### Bước 5: Chạy Development Server

```bash
pnpm dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Cấu Trúc Dự Án

```
bekind/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalization
│   │   │   ├── (home)/        # Home page routes
│   │   │   └── [...rest]/     # Catch-all routes
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── common/           # Shared components
│   │   ├── layout/           # Layout components
│   │   ├── ui/               # UI components (shadcn/ui)
│   │   └── providers/        # Context providers
│   ├── features/             # Feature-based modules
│   │   ├── About/           # About page feature
│   │   ├── Contact/         # Contact page feature
│   │   └── Landing/         # Landing page feature
│   ├── configs/             # Configuration files
│   │   ├── i18n/           # Internationalization config
│   │   ├── wagmi/          # Web3 configuration
│   │   └── socket/         # WebSocket configuration
│   ├── resources/          # Static resources
│   │   └── locales/        # Translation files
│   └── shared/             # Shared utilities
│       ├── constants/      # Application constants
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API services
│       ├── types/          # TypeScript types
│       └── utils/          # Utility functions
├── prisma/                 # Database schema
├── public/                 # Static assets
│   ├── templates/         # Email templates
│   └── images/           # Image assets
└── package.json          # Dependencies and scripts
```

## Sử Dụng

### Cho Người Quyên Góp

1. **Đăng Ký Tài Khoản**: Kết nối ví điện tử hoặc tạo tài khoản
2. **Duyệt Chiến Dịch**: Xem các chiến dịch từ thiện đang diễn ra
3. **Quyên Góp**: Chọn số tiền và phương thức thanh toán
4. **Theo Dõi**: Xem tác động của khoản quyên góp

### Cho Tổ Chức Từ Thiện

1. **Tạo Chiến Dịch**: Sử dụng rich text editor để tạo nội dung
2. **Quản Lý**: Cập nhật thông tin và tiến độ chiến dịch
3. **Báo Cáo**: Cung cấp bằng chứng sử dụng quỹ
4. **Tương Tác**: Trả lời câu hỏi từ người quyên góp

### Cho Nhà Phát Triển

1. **Fork Repository**: Tạo bản sao của dự án
2. **Tạo Branch**: Tạo nhánh cho tính năng mới
3. **Phát Triển**: Viết code và test
4. **Pull Request**: Gửi yêu cầu merge

## Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng:

1. **Fork** dự án
2. Tạo **Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit** thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. **Push** lên branch (`git push origin feature/AmazingFeature`)
5. Mở **Pull Request**

### Quy Tắc Đóng Góp

- Tuân thủ coding standards
- Viết test cho tính năng mới
- Cập nhật documentation
- Đảm bảo không có breaking changes

## Giấy Phép

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

## 🙏 Cảm Ơn

Cảm ơn tất cả những người đã đóng góp cho dự án này. Mỗi dòng code, mỗi ý tưởng đều giúp chúng ta xây dựng một thế giới tốt đẹp hơn.

---

**Made with ❤️ for a better world**
