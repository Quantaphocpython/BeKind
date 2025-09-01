import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Ban,
  Banknote,
  BanknoteArrowDown,
  BellRing,
  Calendar,
  CalendarDays,
  Car,
  ChartBar,
  ChartColumn,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleArrowLeft,
  CircleArrowRight,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronUp,
  CircleDollarSign,
  CircleFadingArrowUp,
  CircuitBoardIcon,
  ClipboardList,
  Clock,
  Coins,
  Command,
  CreditCard,
  Database,
  DollarSign,
  Download,
  Edit,
  Expand,
  ExternalLink,
  Eye,
  Facebook,
  File,
  FileText,
  FunnelPlus,
  Globe,
  Grip,
  GripVertical,
  HandCoins,
  Handshake,
  Hash,
  Heart,
  HelpCircle,
  History,
  Home,
  Image,
  ImageIcon,
  Info,
  Instagram,
  Laptop,
  Layers,
  LayoutDashboardIcon,
  LayoutTemplate,
  Link,
  Linkedin,
  Loader2,
  LoaderCircle,
  Lock,
  LogIn,
  LucideIcon,
  LucideProps,
  LucideShoppingBag,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Minus,
  Moon,
  MoreVertical,
  MoveLeft,
  Package,
  PanelLeftClose,
  PanelRightOpen,
  Pencil,
  Phone,
  PiggyBank,
  Pizza,
  Plus,
  RefreshCcw,
  Save,
  SaveAll,
  Settings,
  Shapes,
  Share2,
  Shield,
  ShoppingCart,
  Shrink,
  SlidersHorizontal,
  Snowflake,
  Sparkles,
  Star,
  SunMedium,
  Table,
  Target,
  ThumbsUp,
  Trash,
  Trello,
  TrendingDown,
  TrendingUp,
  Twitter,
  Upload,
  User,
  UserCircle2Icon,
  UserPen,
  UserPlus,
  Users,
  UserX2Icon,
  UtensilsCrossed,
  Wallet,
  X,
  XCircle,
} from 'lucide-react'

export type Icon = LucideIcon

export const Icons = {
  dashboard: LayoutDashboardIcon,
  logo: Command,
  login: LogIn,
  close: X,
  product: LucideShoppingBag,
  spinner: Loader2,
  kanban: CircuitBoardIcon,
  arrowUpRight: ArrowUpRight,
  plus: Plus,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  history: History,
  layers: Layers,
  trash: Trash,
  employee: UserX2Icon,
  clock: Clock,
  xCircle: XCircle,
  post: FileText,
  page: File,
  userPen: UserPen,
  sparkles: Sparkles,
  user2: UserCircle2Icon,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  users: Users,
  arrowRight: ArrowRight,
  link: Link,
  shapes: Shapes,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  wallet: Wallet,
  activity: Activity,
  twitter: Twitter,
  check: Check,
  trello: Trello,
  banknote: Banknote,
  bellRing: BellRing,
  pencil: Pencil,
  eye: Eye,
  utensils: UtensilsCrossed,
  home: Home,
  car: Car,
  phone: Phone,
  shoppingCart: ShoppingCart,
  piggyBank: PiggyBank,
  trendingUp: TrendingUp,
  trendindDown: TrendingDown,
  dollarSign: DollarSign,
  circleDollarSign: CircleDollarSign,
  circle: Circle,
  save: Save,
  chevronDown: ChevronDown,
  minus: Minus,
  circleChevronDown: CircleChevronDown,
  circleChevronUp: CircleChevronUp,
  moveLeft: MoveLeft,
  alertCircle: AlertCircle,
  circleArrowLeft: CircleArrowLeft,
  layoutBanner: LayoutTemplate,
  banknoteArrowDown: BanknoteArrowDown,
  saveAll: SaveAll,
  circleArrowRight: CircleArrowRight,
  package: Package,
  database: Database,
  clipboardList: ClipboardList,
  handShake: Handshake,
  expand: Expand,
  shrink: Shrink,
  chartBar: ChartBar,
  loader: LoaderCircle,
  handCoins: HandCoins,
  calendar: Calendar,
  target: Target,
  thumbsUp: ThumbsUp,
  circleChevronLeft: CircleChevronLeft,
  none: Ban,
  table: Table,
  chartColumn: ChartColumn,
  funnelPlus: FunnelPlus,

  arrowLeftRight: ArrowLeftRight,
  snowflake: Snowflake,
  panelRightOpen: PanelRightOpen,
  panelLeftClose: PanelLeftClose,

  checkCircle: CheckCircle,
  upload: Upload,
  edit: Edit,
  image: ImageIcon,
  externalLink: ExternalLink,
  share: Share2,
  userPlus: UserPlus,
  circleFadingArrowUp: CircleFadingArrowUp,
  coins: Coins,
  mail: Mail,
  mapPin: MapPin,
  facebook: Facebook,
  instagram: Instagram,
  hash: Hash,
  download: Download,
  calendarDays: CalendarDays,

  refreshCcw: RefreshCcw,
  grip: Grip,
  gripVertical: GripVertical,
  slidersHorizontal: SlidersHorizontal,
  info: Info,
  arrowLeft: ArrowLeft,
  menu: Menu,
  heart: Heart,
  globe: Globe,
  shield: Shield,
  lock: Lock,
  star: Star,
  linkedIn: Linkedin,
  messageSquare: MessageSquare,
  vietnamFlag: ({ ...props }: LucideProps) => (
    <svg width="800px" height="800px" viewBox="0 -4 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_503_2795)">
        <rect width="28" height="20" rx="2" fill="white" />
        <mask
          id="mask0_503_2795"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="28"
          height="20"
        >
          <rect width="28" height="20" rx="2" fill="white" />
        </mask>
        <g mask="url(#mask0_503_2795)">
          <rect width="28" height="20" fill="#EA403F" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 12.34L10.4733 14.8541L11.7745 10.7231L8.29366 8.1459L12.6246 8.1069L14 4L15.3754 8.1069L19.7063 8.1459L16.2255 10.7231L17.5267 14.8541L14 12.34Z"
            fill="#FFFE4E"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_503_2795">
          <rect width="28" height="20" rx="2" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),

  usFlag: ({ ...props }: LucideProps) => (
    <svg width="800px" height="800px" viewBox="0 -4 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_503_3486)">
        <rect width="28" height="20" rx="2" fill="white" />
        <mask
          id="mask0_503_3486"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="28"
          height="20"
        >
          <rect width="28" height="20" rx="2" fill="white" />
        </mask>
        <g mask="url(#mask0_503_3486)">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M28 0H0V1.33333H28V0ZM28 2.66667H0V4H28V2.66667ZM0 5.33333H28V6.66667H0V5.33333ZM28 8H0V9.33333H28V8ZM0 10.6667H28V12H0V10.6667ZM28 13.3333H0V14.6667H28V13.3333ZM0 16H28V17.3333H0V16ZM28 18.6667H0V20H28V18.6667Z"
            fill="#D02F44"
          />
          <rect width="12" height="9.33333" fill="#46467F" />
          <g filter="url(#filter0_d_503_3486)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.66665 1.99999C2.66665 2.36818 2.36817 2.66666 1.99998 2.66666C1.63179 2.66666 1.33331 2.36818 1.33331 1.99999C1.33331 1.63181 1.63179 1.33333 1.99998 1.33333C2.36817 1.33333 2.66665 1.63181 2.66665 1.99999ZM5.33331 1.99999C5.33331 2.36818 5.03484 2.66666 4.66665 2.66666C4.29846 2.66666 3.99998 2.36818 3.99998 1.99999C3.99998 1.63181 4.29846 1.33333 4.66665 1.33333C5.03484 1.33333 5.33331 1.63181 5.33331 1.99999ZM7.33331 2.66666C7.7015 2.66666 7.99998 2.36818 7.99998 1.99999C7.99998 1.63181 7.7015 1.33333 7.33331 1.33333C6.96512 1.33333 6.66665 1.63181 6.66665 1.99999C6.66665 2.36818 6.96512 2.66666 7.33331 2.66666ZM10.6666 1.99999C10.6666 2.36818 10.3682 2.66666 9.99998 2.66666C9.63179 2.66666 9.33331 2.36818 9.33331 1.99999C9.33331 1.63181 9.63179 1.33333 9.99998 1.33333C10.3682 1.33333 10.6666 1.63181 10.6666 1.99999ZM3.33331 3.99999C3.7015 3.99999 3.99998 3.70152 3.99998 3.33333C3.99998 2.96514 3.7015 2.66666 3.33331 2.66666C2.96512 2.66666 2.66665 2.96514 2.66665 3.33333C2.66665 3.70152 2.96512 3.99999 3.33331 3.99999ZM6.66665 3.33333C6.66665 3.70152 6.36817 3.99999 5.99998 3.99999C5.63179 3.99999 5.33331 3.70152 5.33331 3.33333C5.33331 2.96514 5.63179 2.66666 5.99998 2.66666C6.36817 2.66666 6.66665 2.96514 6.66665 3.33333ZM8.66665 3.99999C9.03484 3.99999 9.33331 3.70152 9.33331 3.33333C9.33331 2.96514 9.03484 2.66666 8.66665 2.66666C8.29846 2.66666 7.99998 2.96514 7.99998 3.33333C7.99998 3.70152 8.29846 3.99999 8.66665 3.99999ZM10.6666 4.66666C10.6666 5.03485 10.3682 5.33333 9.99998 5.33333C9.63179 5.33333 9.33331 5.03485 9.33331 4.66666C9.33331 4.29847 9.63179 3.99999 9.99998 3.99999C10.3682 3.99999 10.6666 4.29847 10.6666 4.66666ZM7.33331 5.33333C7.7015 5.33333 7.99998 5.03485 7.99998 4.66666C7.99998 4.29847 7.7015 3.99999 7.33331 3.99999C6.96512 3.99999 6.66665 4.29847 6.66665 4.66666C6.66665 5.03485 6.96512 5.33333 7.33331 5.33333ZM5.33331 4.66666C5.33331 5.03485 5.03484 5.33333 4.66665 5.33333C4.29846 5.33333 3.99998 5.03485 3.99998 4.66666C3.99998 4.29847 4.29846 3.99999 4.66665 3.99999C5.03484 3.99999 5.33331 4.29847 5.33331 4.66666ZM1.99998 5.33333C2.36817 5.33333 2.66665 5.03485 2.66665 4.66666C2.66665 4.29847 2.36817 3.99999 1.99998 3.99999C1.63179 3.99999 1.33331 4.29847 1.33331 4.66666C1.33331 5.03485 1.63179 5.33333 1.99998 5.33333ZM3.99998 5.99999C3.99998 6.36819 3.7015 6.66666 3.33331 6.66666C2.96512 6.66666 2.66665 6.36819 2.66665 5.99999C2.66665 5.6318 2.96512 5.33333 3.33331 5.33333C3.7015 5.33333 3.99998 5.6318 3.99998 5.99999ZM5.99998 6.66666C6.36817 6.66666 6.66665 6.36819 6.66665 5.99999C6.66665 5.6318 6.36817 5.33333 5.99998 5.33333C5.63179 5.33333 5.33331 5.6318 5.33331 5.99999C5.33331 6.36819 5.63179 6.66666 5.99998 6.66666ZM9.33331 5.99999C9.33331 6.36819 9.03484 6.66666 8.66665 6.66666C8.29846 6.66666 7.99998 6.36819 7.99998 5.99999C7.99998 5.6318 8.29846 5.33333 8.66665 5.33333C9.03484 5.33333 9.33331 5.6318 9.33331 5.99999ZM9.99998 8C10.3682 8 10.6666 7.70152 10.6666 7.33333C10.6666 6.96514 10.3682 6.66666 9.99998 6.66666C9.63179 6.66666 9.33331 6.96514 9.33331 7.33333C9.33331 7.70152 9.63179 8 9.99998 8ZM7.99998 7.33333C7.99998 7.70152 7.7015 8 7.33331 8C6.96512 8 6.66665 7.70152 6.66665 7.33333C6.66665 6.96514 6.96512 6.66666 7.33331 6.66666C7.7015 6.66666 7.99998 6.96514 7.99998 7.33333ZM4.66665 8C5.03484 8 5.33331 7.70152 5.33331 7.33333C5.33331 6.96514 5.03484 6.66666 4.66665 6.66666C4.29846 6.66666 3.99998 6.96514 3.99998 7.33333C3.99998 7.70152 4.29846 8 4.66665 8ZM2.66665 7.33333C2.66665 7.70152 2.36817 8 1.99998 8C1.63179 8 1.33331 7.70152 1.33331 7.33333C1.33331 6.96514 1.63179 6.66666 1.99998 6.66666C2.36817 6.66666 2.66665 6.96514 2.66665 7.33333Z"
              fill="url(#paint0_linear_503_3486)"
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_503_3486"
          x="1.33331"
          y="1.33333"
          width="9.33331"
          height="7.66667"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_503_3486" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_503_3486" result="shape" />
        </filter>
        <linearGradient
          id="paint0_linear_503_3486"
          x1="1.33331"
          y1="1.33333"
          x2="1.33331"
          y2="7.99999"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F0F0F0" />
        </linearGradient>
        <clipPath id="clip0_503_3486">
          <rect width="28" height="20" rx="2" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
}
