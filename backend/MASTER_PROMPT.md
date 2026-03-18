# 🚀 ORDER.PK — COMPLETE PLATFORM MASTER PROMPT

Copy this entire prompt and paste it into Claude, Cursor, or any AI coding tool.

---

```
You are a senior full-stack developer. Build a complete, production-ready food 
delivery platform called "Order.pk" — pixel-perfect based on the Figma design 
described below. Do NOT skip any screen. Write real, working code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧱 TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend:     Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS + shadcn/ui
State:        Zustand (cart, auth)
Forms:        React Hook Form + Zod
Real-time:    Socket.io client
Maps:         Google Maps API (@react-google-maps/api)
HTTP:         Axios + React Query (TanStack)

Backend:      Node.js + Express.js + TypeScript
Database:     PostgreSQL + Prisma ORM
Cache:        Redis (sessions + cart + rate limit)
Auth:         JWT (access 15min + refresh 7d, httpOnly cookie)
Payments:     Stripe (card payments + webhooks)
Files:        Cloudinary (image upload + CDN)
Email:        SendGrid (transactional emails)
SMS:          Twilio (order status SMS)
Real-time:    Socket.io server
Validation:   Zod
Deploy:       Vercel (frontend) + Railway (backend + DB)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 DESIGN SYSTEM (FOLLOW EXACTLY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CSS Variables:
  --orange:       #FF6B00   ← primary brand color
  --navy:         #1C1F35   ← dark background / sidebar
  --green:        #2D7A4F   ← success / open status
  --red:          #E53935   ← error / closed
  --yellow:       #FFC107   ← stars / warnings
  --page-bg:      #F4F6FA   ← light gray page background
  --card-bg:      #FFFFFF
  --text-primary: #111111
  --text-muted:   #6B7280
  --border:       #E5E7EB

Font: "Poppins" (Google Fonts) — weights 400, 500, 600, 700
Logo: Text "Order" with 🔥 flame icon → "Order.pk"
      
Border radius:
  Cards:       rounded-xl (12px)
  Buttons:     rounded-full (pill shape)
  Modals:      rounded-2xl (16px)
  Inputs:      rounded-lg (8px)

Shadows:
  Cards:       0 4px 16px rgba(0,0,0,0.08)
  Modals:      0 20px 60px rgba(0,0,0,0.2)
  Buttons:     0 4px 14px rgba(255,107,0,0.35) (orange buttons only)

Transitions: all 0.2s ease on hover states

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗄️ DATABASE SCHEMA (PostgreSQL + Prisma)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String
  fullName       String
  phone          String?
  role           Role     @default(CUSTOMER)
  profilePhoto   String?
  isActive       Boolean  @default(true)
  emailVerified  Boolean  @default(false)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  orders         Order[]
  addresses      DeliveryAddress[]
  reviews        Review[]
  restaurant     Restaurant?
  rider          Rider?
}

enum Role { SUPER_ADMIN RESTAURANT_OWNER RIDER CUSTOMER }

model Restaurant {
  id              String   @id @default(uuid())
  ownerId         String   @unique
  owner           User     @relation(fields: [ownerId], references: [id])
  name            String
  slug            String   @unique
  description     String?
  logoUrl         String?
  bannerUrl       String?
  phone           String
  email           String
  website         String?
  addressLine1    String
  city            String
  postcode        String
  latitude        Float?
  longitude       Float?
  categories      String[]
  minOrderValue   Float    @default(500)
  deliveryFee     Float    @default(150)
  deliveryTimeMins Int     @default(30)
  commissionRate  Float    @default(15)
  isActive        Boolean  @default(false)
  isFeatured      Boolean  @default(false)
  isOpen          Boolean  @default(true)
  ratingAvg       Float    @default(0)
  ratingCount     Int      @default(0)
  createdAt       DateTime @default(now())
  menuCategories  MenuCategory[]
  menuItems       MenuItem[]
  orders          Order[]
  reviews         Review[]
  operatingHours  OperatingHours[]
}

model OperatingHours {
  id           String     @id @default(uuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  dayOfWeek    Int        // 0=Monday, 6=Sunday
  openTime     String     // "08:00"
  closeTime    String     // "23:00"
  isClosed     Boolean    @default(false)
}

model MenuCategory {
  id           String     @id @default(uuid())
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  name         String
  displayOrder Int        @default(0)
  isActive     Boolean    @default(true)
  items        MenuItem[]
}

model MenuItem {
  id             String       @id @default(uuid())
  restaurantId   String
  restaurant     Restaurant   @relation(fields: [restaurantId], references: [id])
  categoryId     String
  category       MenuCategory @relation(fields: [categoryId], references: [id])
  name           String
  description    String?
  imageUrl       String?
  calories       Int?
  allergens      String[]
  isAvailable    Boolean      @default(true)
  displayOrder   Int          @default(0)
  sizes          MenuItemSize[]
  toppingGroups  ToppingGroup[]
  orderItems     OrderItem[]
}

model MenuItemSize {
  id         String   @id @default(uuid())
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  sizeName   String   // "Small", "Medium", "Large"
  price      Float    // In Pakistani Rupees (Rs.)
}

model ToppingGroup {
  id           String    @id @default(uuid())
  menuItemId   String
  menuItem     MenuItem  @relation(fields: [menuItemId], references: [id])
  groupName    String
  groupIcon    String?
  maxFreeCount Int       @default(4)
  toppings     Topping[]
}

model Topping {
  id             String       @id @default(uuid())
  toppingGroupId String
  toppingGroup   ToppingGroup @relation(fields: [toppingGroupId], references: [id])
  name           String
  isFree         Boolean      @default(true)
  extraPrice     Float        @default(0)
}

model Order {
  id                    String      @id @default(uuid())
  orderNumber           String      @unique // "ORD-2024-1234"
  customerId            String
  customer              User        @relation(fields: [customerId], references: [id])
  restaurantId          String
  restaurant            Restaurant  @relation(fields: [restaurantId], references: [id])
  riderId               String?
  rider                 Rider?      @relation(fields: [riderId], references: [id])
  status                OrderStatus @default(PENDING)
  orderType             OrderType   @default(DELIVERY)
  subtotal              Float       // Rs.
  discountAmount        Float       @default(0)
  deliveryFee           Float       @default(0)
  tax                   Float       @default(0)
  total                 Float
  couponCode            String?
  paymentMethod         PaymentMethod
  paymentStatus         PaymentStatus @default(PENDING)
  stripePaymentIntentId String?
  deliveryAddress       Json?
  specialInstructions   String?
  estimatedDeliveryAt   DateTime?
  deliveredAt           DateTime?
  cancelledAt           DateTime?
  cancellationReason    String?
  createdAt             DateTime    @default(now())
  items                 OrderItem[]
}

enum OrderStatus {
  PENDING ACCEPTED PREPARING READY ON_THE_WAY DELIVERED CANCELLED
}
enum OrderType { DELIVERY COLLECTION }
enum PaymentMethod { CARD CASH }
enum PaymentStatus { PENDING PAID FAILED REFUNDED }

model OrderItem {
  id             String   @id @default(uuid())
  orderId        String
  order          Order    @relation(fields: [orderId], references: [id])
  menuItemId     String
  menuItem       MenuItem @relation(fields: [menuItemId], references: [id])
  quantity       Int
  sizeName       String
  unitPrice      Float
  customizations Json
  itemTotal      Float
}

model DeliveryAddress {
  id        String  @id @default(uuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  label     String  @default("Home")
  line1     String
  line2     String?
  city      String
  postcode  String
  isDefault Boolean @default(false)
}

model Rider {
  id              String  @id @default(uuid())
  userId          String  @unique
  user            User    @relation(fields: [userId], references: [id])
  vehicleType     String
  vehicleReg      String?
  licenseNumber   String?
  isOnline        Boolean @default(false)
  isAvailable     Boolean @default(true)
  currentLat      Float?
  currentLng      Float?
  totalDeliveries Int     @default(0)
  totalEarnings   Float   @default(0)
  orders          Order[]
  createdAt       DateTime @default(now())
}

model Coupon {
  id                String     @id @default(uuid())
  code              String     @unique
  type              CouponType
  discountValue     Float
  minOrderValue     Float      @default(0)
  maxDiscount       Float?
  validFrom         DateTime
  validTo           DateTime
  usageLimitPerUser Int        @default(1)
  totalUsageLimit   Int?
  timesUsed         Int        @default(0)
  restaurantId      String?
  firstOrderOnly    Boolean    @default(false)
  isActive          Boolean    @default(true)
}

enum CouponType { PERCENTAGE FIXED_AMOUNT FREE_DELIVERY }

model Review {
  id           String     @id @default(uuid())
  orderId      String
  customerId   String
  customer     User       @relation(fields: [customerId], references: [id])
  restaurantId String
  restaurant   Restaurant @relation(fields: [restaurantId], references: [id])
  rating       Int        // 1-5
  comment      String?
  createdAt    DateTime   @default(now())
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/order-pk
├── /frontend (Next.js - already built)
│   ├── /app
│   ├── /components
│   ├── /context
│   ├── /lib
│   └── ... (existing code)
│
└── /backend (Express.js - BUILD THIS)
    ├── /src
    │   ├── /routes
    │   │   ├── auth.routes.ts
    │   │   ├── restaurant.routes.ts
    │   │   ├── menu.routes.ts
    │   │   ├── order.routes.ts
    │   │   ├── rider.routes.ts
    │   │   ├── payment.routes.ts
    │   │   ├── coupon.routes.ts
    │   │   ├── analytics.routes.ts
    │   │   ├── upload.routes.ts
    │   │   └── notification.routes.ts
    │   ├── /controllers
    │   ├── /middleware
    │   │   ├── auth.middleware.ts
    │   │   ├── role.middleware.ts
    │   │   └── rateLimit.middleware.ts
    │   ├── /services
    │   │   ├── stripe.service.ts
    │   │   ├── sendgrid.service.ts
    │   │   ├── twilio.service.ts
    │   │   ├── cloudinary.service.ts
    │   │   └── socket.service.ts
    │   ├── /prisma
    │   │   └── schema.prisma
    │   └── server.ts
    └── /seed
        └── seed.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔌 BACKEND API ENDPOINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUTH:
POST   /api/auth/register
POST   /api/auth/login          → returns { accessToken, user }
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/me

RESTAURANTS (public):
GET    /api/restaurants
GET    /api/restaurants/:slug
GET    /api/restaurants/:id/menu
GET    /api/restaurants/:id/reviews

RESTAURANTS (owner auth):
PUT    /api/restaurants/:id
PUT    /api/restaurants/:id/hours
POST   /api/restaurants/:id/menu/categories
PUT    /api/restaurants/:id/menu/items/:itemId
DELETE /api/restaurants/:id/menu/items/:itemId
PUT    /api/restaurants/:id/status

RESTAURANTS (admin only):
POST   /api/admin/restaurants
PUT    /api/admin/restaurants/:id/activate
PUT    /api/admin/restaurants/:id/suspend
DELETE /api/admin/restaurants/:id

ORDERS:
POST   /api/orders                     → place order (customer)
GET    /api/orders/:id                 → order detail
GET    /api/orders/my                  → customer's orders
PUT    /api/orders/:id/status          → restaurant/admin updates status
POST   /api/orders/:id/assign-rider
GET    /api/admin/orders               → all orders (admin)

PAYMENTS:
POST   /api/payments/intent            → create Stripe PaymentIntent
POST   /api/payments/webhook           → Stripe webhook handler
POST   /api/payments/refund/:orderId

COUPONS:
GET    /api/coupons/validate/:code
GET    /api/admin/coupons
POST   /api/admin/coupons

RIDERS:
PUT    /api/rider/status
PUT    /api/rider/location
GET    /api/rider/current-order
GET    /api/rider/earnings

ANALYTICS (admin):
GET    /api/analytics/revenue?from=&to=&interval=daily
GET    /api/analytics/orders?from=&to=
GET    /api/analytics/restaurants/top
GET    /api/analytics/riders/leaderboard

UPLOAD:
POST   /api/upload/image               → Cloudinary upload, returns URL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👑 ADMIN PANEL PAGES (/admin)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LAYOUT: Fixed left sidebar (dark navy, 240px) + white main area

SIDEBAR NAVIGATION:
  🏠 Dashboard | 🍽️ Restaurants | 📦 Orders | 🛵 Riders
  👥 Customers | 🎟️ Coupons | 💳 Payments | 📊 Reports | ⚙️ Settings
  Active item: orange left border + orange text + light orange bg

── Dashboard (/admin/dashboard):
  4 stat cards: Orders Today | Revenue (Rs.) | Active Riders | Pending Approvals
  Revenue line chart (last 30 days, orange)
  Top Restaurants bar chart
  Recent Orders table (Order# | Customer | Restaurant | Amount | Status | Time)

── Restaurants (/admin/restaurants):
  Table: Logo | Name | City | Status | Rating | Orders | Revenue | Actions
  Actions: [View] [Edit] [Suspend/Activate] [Delete]
  Add Restaurant form (7 sections): Basic Info, Location, Owner Account,
  Delivery Settings, Operating Hours, Commission, Offers

── Orders (/admin/orders):
  Filters: date range | status | restaurant | payment type
  Table: Order# | Customer | Restaurant | Items | Type | Payment | Amount | Status | Rider
  Order Detail: visual timeline + items list + action buttons

── Riders (/admin/riders):
  Status tabs: All | Online | Offline | Delivering
  Rider cards: photo + name + status + deliveries + rating + earnings

── Reports (/admin/reports):
  Revenue charts | Order volume | Top restaurants | Rider leaderboard
  [Export CSV] [Export PDF] buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍽️ RESTAURANT OWNER PANEL (/restaurant-panel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── Live Orders Dashboard:
  BIG TOGGLE: [🟢 We're OPEN — Click to Close]
  Today stats: Orders | Revenue (Rs.) | Avg prep time | Rating

  KANBAN BOARD (3 columns):
  NEW ORDERS (orange): order card with [Accept] [Reject] buttons
  PREPARING (blue): item checklist + countdown timer + [Ready for Pickup]
  READY (green): [Mark as Delivered/Collected]

── Menu Management:
  Category list (left) + item cards grid (right)
  Add/Edit item: side panel (name, description, photo, sizes, toppings)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛵 RIDER DASHBOARD (/rider)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mobile-first layout:
  STATUS TOGGLE: [🟢 I'm Available] — tap to go offline
  WAITING STATE: pulsing animation
  NEW ORDER CARD: restaurant + estimated Rs. earnings + [Accept] [Decline]
  ACTIVE DELIVERY: 4-step progress (Navigate → Arrived → Collected → Delivered)
  EARNINGS TAB: daily table + payout history

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ REAL-TIME (Socket.io Events)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Server emits:
  "new_order"           → restaurant's room
  "order_status_update" → customer's room
  "rider_assigned"      → customer + restaurant
  "rider_location"      → customer's room (GPS)

Client emits:
  "join_restaurant_room"
  "join_order_room"
  "rider_location_update" → every 30 seconds

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 SEED DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

USERS:
  Super Admin:        admin@order.pk      / Admin@123
  Restaurant Owner:   owner@mcdonalds.pk  / Owner@123
  Rider:              rider@order.pk      / Rider@123
  Customer:           customer@test.com   / Test@123

RESTAURANTS (Pakistani brands):
  McDonald's Pakistan | KFC Pakistan | Pizza Hut Pakistan
  Jollibee Pakistan | Hardee's Pakistan | Bar.B.Q Tonight

PRICES: All in Pakistani Rupees (Rs.)
  Example: Burger Rs.350-750 | Pizza Rs.600-1800 | Drinks Rs.100-250

COUPONS:
  FIRST10   → 10% off, first order only, min Rs.500
  SAVE100   → Rs.100 off, all users, min Rs.1000
  FREEDEL   → Free delivery, min Rs.800

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 SECURITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- JWT with httpOnly cookies (access 15min + refresh 7d)
- Bcrypt password hashing (saltRounds: 12)
- Redis rate limiting (auth: 5 req/min, API: 100 req/min)
- CORS: allow only frontend domain
- Input validation with Zod on all endpoints
- Role-based route guards (SUPER_ADMIN | RESTAURANT_OWNER | RIDER | CUSTOMER)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 EMAIL TEMPLATES (SendGrid)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. order_confirmation.html
2. order_status_update.html
3. order_cancelled.html
4. welcome.html
5. password_reset.html
6. new_restaurant_registered.html (to admin)
7. weekly_earnings.html (to riders)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ QUALITY CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ All 4 dashboards functional (Super Admin, Restaurant, Rider, Customer)
□ JWT auth with silent refresh on token expiry
□ Real-time order updates via Socket.io
□ Stripe payment flow (card input → PaymentIntent → confirm → webhook)
□ Loading skeletons on all data-fetching components
□ Toast notifications (success green, error red, info blue)
□ All forms validated with inline error messages (Zod + React Hook Form)
□ Pagination on all admin tables (20 rows per page)
□ CSV export on orders + transactions tables
□ Dark mode toggle in admin header
□ Sound notification when new order arrives at restaurant panel
□ Mobile-responsive rider dashboard
□ Environment variables in .env files (never hardcode API keys)
□ Rate limiting on auth routes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BUILD ORDER (recommended sequence)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1:  Database schema + Prisma setup + seed data
Step 2:  Auth API (register, login, JWT, refresh)
Step 3:  Restaurant + Menu APIs
Step 4:  Order placement API + Stripe payment
Step 5:  Super Admin dashboard (restaurants, orders, analytics)
Step 6:  Restaurant Owner panel (live orders kanban)
Step 7:  Rider dashboard
Step 8:  Socket.io real-time (order status + GPS tracking)
Step 9:  Email/SMS notifications (SendGrid + Twilio)
Step 10: Connect frontend to real APIs (replace mock data in lib/data.ts)
Step 11: Mobile responsive + final polish + deploy
```

---

## HOW TO USE THIS PROMPT

- **Cursor AI**: Paste in new chat → "Start with Step 1"
- **Claude.ai**: Paste and say "Build this step by step, start with the database"
- **ChatGPT**: Paste and say "Start with the backend API setup"
- **Bolt.new**: Paste directly for instant full-stack generation

## EXISTING FRONTEND

The frontend is already built and located in the `/frontend` folder.
It uses: Next.js 14, Tailwind CSS, Framer Motion, Lucide React, Sonner toasts.
Replace the mock data in `frontend/lib/data.ts` with real API calls.
