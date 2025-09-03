
# <img src="./public/images/logo.png" alt="BeKind" width="32" style="vertical-align:middle;" /> BeKind - Nền Tảng Từ Thiện Blockchain

> Một nền tảng từ thiện hiện đại được xây dựng trên công nghệ blockchain, đảm bảo tính minh bạch, bảo mật và khả năng truy xuất cho mọi khoản quyên góp.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.13.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Sepolia_Testnet-3C3C3D?style=for-the-badge&logo=ethereum)](https://ethereum.org/)

## Mục Lục

- [Giới Thiệu](#giới-thiệu)
- [Demo](#demo)
- [API Docs](#api-docs)
- [Tính Năng Chính](#tính-năng-chính)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cài Đặt](#cài-đặt)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Sử Dụng](#sử-dụng)
- [Tài liệu khác](#tài-liệu-khác)

## Giới Thiệu

BeKind là một ứng dụng web hiện đại được thiết kế để kết nối người quyên góp trực tiếp với những người cần giúp đỡ. Sử dụng công nghệ blockchain, chúng tôi đảm bảo:

- **Minh Bạch Hoàn Toàn**: Mọi giao dịch đều được ghi lại trên blockchain
- **Bảo Mật Tối Đa**: Bảo vệ thông tin người dùng với mã hóa cấp độ quân sự
- **Truy Xuất Thời Gian Thực**: Theo dõi tác động của từng khoản quyên góp
- **Không Có Phí Ẩn**: Chi phí rõ ràng, minh bạch
- **Testnet An Toàn**: Sử dụng Sepolia testnet để phát triển và kiểm thử

## Demo

- Link triển khai (demo online): [gobekind.vercel.app](https://gobekind.vercel.app/)
- Hướng dẫn nhanh:
  1. Mở liên kết trên trình duyệt của bạn.
  2. Nhấn "Kết nối ví" để đăng nhập trải nghiệm Web3 (có thể dùng ví thử nghiệm).
  3. Khám phá trang chủ, danh sách chiến dịch, và chi tiết từng chiến dịch.
  4. Có thể tạo chiến dịch mới, theo dõi tiến độ quyên góp và bằng chứng cập nhật.

Lưu ý: Đây là bản demo phục vụ mục đích trải nghiệm. Một số dữ liệu có thể là dữ liệu thử nghiệm.

## API Docs

- UI: `http://localhost:3000/api-docs`
- JSON: `http://localhost:3000/api/openapi.json`

Ghi chú:

- Tài liệu được tạo động từ các khối JSDoc `@openapi` trong `src/pages/api/**`.

## Tính Năng Chính

| Nhóm Tính Năng             | Tính Năng              | Mô Tả                                               |
| -------------------------- | ---------------------- | --------------------------------------------------- |
| **Trang Chủ**              | Hero Section           | Giới thiệu tổng quan về nền tảng                    |
|                            | Thống Kê               | Hiển thị số liệu về tác động của cộng đồng          |
|                            | Dự Án Nổi Bật          | Các chiến dịch từ thiện đang diễn ra                |
|                            | Tính Năng              | Mô tả các tính năng chính của nền tảng              |
|                            | Đánh Giá               | Phản hồi từ người dùng và đối tác                   |
| **Quản Lý Chiến Dịch**     | Tạo Chiến Dịch         | Hệ thống tạo chiến dịch từ thiện dễ dàng            |
|                            | Rich Text Editor       | Trình soạn thảo văn bản đa năng với hỗ trợ hình ảnh |
|                            | Quản Lý Nội Dung       | Chỉnh sửa và cập nhật thông tin chiến dịch          |
|                            | Theo Dõi Tiến Độ       | Hiển thị tiến độ quyên góp theo thời gian thực      |
| **Hệ Thống Người Dùng**    | Đăng Ký/Đăng Nhập      | Hỗ trợ ví điện tử và tài khoản truyền thống         |
|                            | Hồ Sơ Người Dùng       | Quản lý thông tin cá nhân và lịch sử quyên góp      |
|                            | Ví Điện Tử             | Tích hợp với các ví blockchain phổ biến             |
| **Quyên Góp & Thanh Toán** | Đa Dạng Phương Thức    | Hỗ trợ nhiều loại tiền điện tử và tiền pháp định    |
|                            | Thanh Toán An Toàn     | Bảo mật thông tin thanh toán                        |
|                            | Xác Minh Giao Dịch     | Mọi giao dịch đều được xác minh trên blockchain     |
| **Minh Bạch & Báo Cáo**    | Báo Cáo Thời Gian Thực | Cập nhật tình trạng chiến dịch                      |
|                            | Bằng Chứng Sử Dụng     | Hình ảnh và tài liệu về việc sử dụng quỹ            |
|                            | Lịch Sử Giao Dịch      | Truy xuất đầy đủ lịch sử quyên góp                  |

## Công Nghệ Sử Dụng

### Frontend

- **Next.js 15.3.5**: Framework React hiện đại với App Router
- **TypeScript 5.0**: Ngôn ngữ lập trình type-safe
- **Tailwind CSS 4.0**: Framework CSS utility-first
- **Shadcn/ui**: Component library đẹp và tùy chỉnh được
- **GSAP**: Animation library cho hiệu ứng mượt mà
- **Framer Motion**: Animation cho React components

### Backend & Database

- **Prisma ORM 6.13.0**: Database toolkit hiện đại
- **MongoDB 6.13.0**: NoSQL database linh hoạt
- **Next.js API Routes**: Serverless API endpoints

### Blockchain & Web3

- **Wagmi 2.15.6**: React hooks cho Ethereum
- **Viem 2.x**: TypeScript interface cho Ethereum
- **RainbowKit 2.2.8**: Wallet connection UI
- **Sepolia Testnet**: Môi trường test blockchain chính thức

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
BREVO_SENDER_EMAIL="your-sender-email"

# Web3 & Blockchain Configuration
NEXT_PUBLIC_PROJECT_ID="your-walletconnect-project-id"
NEXT_PUBLIC_CONTRACT_ADDRESS="your-smart-contract-address"
NEXT_PUBLIC_RPC_URL="rpc-url"


# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"

# API Configuration
NEXT_PUBLIC_API_BASE_URL="your-server-api"
```

### Bước 4: Setup Database

```bash
# Generate Prisma client
pnpm dlx prisma generate

# Run database migrations
pnpm dlx prisma db push
```

### Bước 5: Chạy Development Server

```bash
pnpm dev
```

Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## Cấu Trúc Dự Án

```
bekind/
├── src/                    # Source code chính
│   ├── app/               # Frontend - Next.js App Router
│   │   ├── [locale]/      # Internationalization
│   │   │   ├── (home)/    # Home page routes
│   │   │   ├── campaigns/ # Campaign pages
│   │   │   ├── profile/   # User profile pages
│   │   │   └── [...rest]/ # Catch-all routes
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Root page
│   │   ├── error.tsx      # Error handling
│   │   └── not-found.tsx  # 404 page
│   │
│   ├── components/        # Frontend - React Components
│   │   ├── common/        # Shared components
│   │   │   ├── atoms/     # Atomic components
│   │   │   ├── molecules/ # Molecular components
│   │   │   ├── organisms/ # Organism components
│   │   │   └── pages/     # Page-specific components
│   │   ├── layout/        # Layout components
│   │   │   ├── MainLayout/    # Main layout wrapper
│   │   │   └── MainContent/   # Content wrapper
│   │   ├── ui/            # UI components (shadcn/ui)
│   │   ├── icons/         # Icon components
│   │   ├── magicui/       # Custom UI components
│   │   └── providers/     # Context providers
│   │       ├── I18nProvider.tsx      # Internationalization
│   │       ├── ThemeProvider.tsx     # Theme management
│   │       ├── WagmiProvider.tsx     # Web3 wallet
│   │       ├── RainbowKitProvider.tsx # Wallet UI
│   │       ├── QueryClientProvider.tsx # React Query
│   │       ├── ToasterProvider.tsx   # Notifications
│   │       └── AutoScrollTopProvider.tsx # Scroll behavior
│   │
│   ├── features/          # Frontend - Feature Modules
│   │   ├── About/         # About page feature
│   │   ├── Campaign/      # Campaign management feature
│   │   ├── Contact/       # Contact page feature
│   │   ├── Landing/       # Landing page feature
│   │   └── User/          # User management feature
│   │
│   ├── configs/           # Frontend - Configuration
│   │   ├── abis/          # Smart contract ABIs
│   │   ├── firebase/      # Firebase configuration
│   │   ├── httpClient/    # HTTP client setup
│   │   ├── i18n/          # Internationalization config
│   │   ├── pinata/        # IPFS/Pinata config
│   │   ├── socket/        # WebSocket configuration
│   │   └── wagmi/         # Web3 configuration
│   │
│   ├── resources/         # Frontend - Static Resources
│   │   └── locales/       # Translation files (en.json, vi.json)
│   │
│   ├── shared/            # Frontend - Shared Utilities
│   │   ├── constants/     # Application constants
│   │   │   ├── ApiEndpointEnum.ts    # API endpoints
│   │   │   ├── RouteEnum.ts          # Route definitions
│   │   │   ├── SocketEventEnum.ts    # Socket events
│   │   │   └── EmailTemplateEnum.ts  # Email templates
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   │
│   ├── styles/            # Frontend - Global Styles
│   │   ├── _variables.scss    # SCSS variables
│   │   └── _keyframe-animations.scss # Animations
│   │
│   └── utils/             # Frontend - Utility functions
│
├── pages/                  # Backend - API Routes
│   └── api/               # Next.js API endpoints
│       ├── campaigns/      # Campaign API endpoints
│       ├── users/          # User API endpoints
│       └── socket.io.ts    # WebSocket server
│
├── server/                 # Backend - Server Logic
│   ├── container/          # Dependency injection container
│   ├── dto/                # Data Transfer Objects
│   │   ├── campaign.dto.ts # Campaign DTOs
│   │   ├── request/        # Request DTOs
│   │   └── response/       # Response DTOs
│   ├── mapper/             # Data mappers
│   │   ├── CampaignMapper.ts # Campaign data mapping
│   │   └── UserMapper.ts   # User data mapping
│   ├── repository/         # Data access layer
│   │   ├── implement/      # Repository implementations
│   │   └── interface/      # Repository interfaces
│   ├── service/            # Business logic layer
│   │   ├── implement/      # Service implementations
│   │   └── interface/      # Service interfaces
│   └── utils/              # Server utilities
│       ├── socketEmitter.ts # Socket event emitter
│       └── stringHelper.ts  # String utilities
│
├── prisma/                 # Backend - Database
│   └── schema.prisma       # Database schema definition
│
├── public/                 # Static Assets
│   ├── images/             # Image assets
│   │   ├── logo.png        # Application logo
│   │   ├── hero-section.jpg # Hero section images
│   │   └── hero-section.avif
│   └── templates/          # Email templates
│       └── campaigns/      # Campaign email templates
│
├── middleware.ts           # Next.js middleware
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies and scripts
└── pnpm-workspace.yaml    # pnpm workspace configuration
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

## Tài Liệu Khác

- **[RULE_OF_CODE.md](./RULE_OF_CODE.md)** - Quy tắc code và tiêu chuẩn phát triển chi tiết
- **[GUIDE.md](./GUIDE.md)** - Hướng dẫn phát triển và kiến trúc code
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Tiêu chuẩn đặt tên và quy ước code
