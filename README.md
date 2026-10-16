# 🍽️ Hassan Cafe

### Restaurant App MVP — React Native + Expo + Node.js Backend | Fall 2026

Hassan Cafe is a **full-stack React Native restaurant application** developed as a Mobile Application Development (MAD) Assignment 2 project. The app provides separate Customer and Manager experiences with a real **MongoDB Atlas** database, Express.js REST API backend, JWT authentication, menu browsing, cart management, order placement, order tracking, table reservations, and manager-side restaurant management.

---

## 🎨 App Branding

- **App Name:** Hassan Cafe
- **Theme:** Black + Gold
- **Primary Color:** `#111111`
- **Accent / Gold:** `#D4AF37`
- **Light Background:** `#F8F7F2`
- **Dark Background:** `#090909`
- **Tagline:** *Warm hospitality, beautifully served.*

---

## 🚀 Assignment 2 — What's New (Backend Integration)

Assignment 2 adds a full **Node.js + Express + MongoDB** backend to the existing frontend:

| Feature | Assignment 1 | Assignment 2 |
|---|---|---|
| Authentication | Local demo data | Real JWT auth via MongoDB |
| Menu data | Local/mock | Fetched from MongoDB Atlas |
| Order placement | Local state only | Submitted to backend API |
| Reservations | Local state only | Saved to MongoDB |
| Manager orders | Local mock data | Real orders from all customers |
| Manager reservations | Local mock data | Real reservations from all customers |
| Menu management | Local state only | Persisted to MongoDB |
| Role promotion | N/A | `makeManager.js` script + API endpoint |

---

## 📱 App Preview

| Screen | Description |
|---|---|
| Login | JWT-authenticated login with role detection |
| Customer Menu | 20 menu items from MongoDB |
| Cart & Order | Order submitted to backend |
| Order Tracking | Real-time status tracking |
| Reservation | Saved to MongoDB |
| Manager Dashboard | Real orders + reservations from DB |
| Manager Orders | Status updates persisted to DB |
| Manager Reservations | Accept/Decline saved to DB |
| Manager Menu | Add/Edit/Toggle items in MongoDB |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|---|---|
| React Native | Cross-platform mobile UI |
| Expo SDK 57 | Development runtime and tooling |
| JavaScript ES6+ | Application logic |
| React Navigation | Stack and bottom-tab navigation |
| Context API | Shared application state |
| React Hooks | State, effects, memoization |
| `useReducer` | Cart and order state transitions |
| AsyncStorage | Local session persistence |
| Ionicons | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT (jsonwebtoken) | Authentication tokens |
| bcryptjs | Password hashing |
| dotenv | Environment configuration |
| nodemon | Development auto-restart |

---

## 🔐 Authentication

- Passwords are hashed with **bcrypt** (12 rounds)
- JWT tokens expire after **7 days**
- Role (`customer` / `manager`) is embedded in the JWT payload
- Backend middleware (`protect`, `managerOnly`) guards all sensitive routes

---

## 🌐 API Endpoints

### Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/promote-manager` | Admin secret | Promote user to manager |

### Menu
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/menu` | Public | Get all menu items |
| GET | `/api/menu/:id` | Public | Get one menu item |
| POST | `/api/menu` | Manager | Add menu item |
| PUT | `/api/menu/:id` | Manager | Update menu item |
| DELETE | `/api/menu/:id` | Manager | Delete menu item |

### Orders
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Customer | Place an order |
| GET | `/api/orders/my` | Customer | Get my orders |
| GET | `/api/orders` | Manager | Get all orders |
| PATCH | `/api/orders/:id/status` | Manager | Update order status |

### Reservations
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/reservations` | Customer | Create reservation |
| GET | `/api/reservations/my` | Customer | Get my reservations |
| GET | `/api/reservations` | Manager | Get all reservations |
| PATCH | `/api/reservations/:id/status` | Manager | Update reservation status |

### Health
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/health` | Public | Server health check |

---

## 👤 Demo Accounts (Assignment 2)

| Role | Email | Password |
|---|---|---|
| **Manager** | `awais123@gmail.com` | `Hassan@123` |
| **Customer** | `testcustomer_new_2026@gmail.com` | `Customer@123` |

> To promote any registered account to manager, use the admin API or run the script (see below).

---

## 🚀 Installation and Run

### Requirements
- Node.js 18+
- npm
- MongoDB Atlas account (connection string in `server/.env`)

### 1. Frontend Setup

```powershell
# From project root
npm install
npm run web
```
Frontend available at: **http://localhost:8081**

### 2. Backend Setup

```powershell
# In a separate terminal
cd server
npm install
npm run dev
```
Backend available at: **http://localhost:5000**

### 3. Environment Variables

Create `server/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/restaurant_app
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET=your_admin_secret_here
```

> ⚠️ Make sure your IP is whitelisted in MongoDB Atlas Network Access.

---

## 👔 Promoting a User to Manager

### Option A — Via API (recommended, uses existing backend connection)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/promote-manager" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"user@example.com","adminSecret":"your_admin_secret"}'
```

### Option B — Via script (requires IP whitelisting for direct DB access)
```powershell
node .\server\scripts\makeManager.js "user@example.com"
```

### Option C — Reset a forgotten password
```powershell
node .\server\scripts\resetPassword.js "user@example.com" "NewPassword@123"
```

---

## 📂 Project Structure

```text
restaurant-app-mvp-main/
│
├── A1/                          # Assignment 1 documents
│   ├── SRS Document.docx
│   └── UML diagrams
│
├── server/                      # Backend (Assignment 2)
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, Login, PromoteManager
│   │   ├── menuController.js    # Menu CRUD
│   │   ├── orderController.js   # Order management
│   │   └── reservationController.js
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT protect + managerOnly
│   ├── models/
│   │   ├── User.js
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Reservation.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── reservationRoutes.js
│   ├── scripts/
│   │   ├── makeManager.js       # Promote user to manager
│   │   └── resetPassword.js     # Reset user password
│   ├── server.js
│   └── .env                     # Environment variables (not committed)
│
├── src/                         # Frontend (React Native)
│   ├── components/
│   ├── constants/
│   ├── context/
│   │   ├── AuthContext.js       # JWT auth + session
│   │   ├── CartContext.js
│   │   ├── OrdersContext.js     # Real API for manager orders
│   │   ├── RestaurantContext.js # Real API for menu + reservations
│   │   └── ThemeContext.js
│   ├── hooks/
│   │   ├── useReservation.js    # Wired to real API
│   │   ├── useForm.js
│   │   └── useDebounce.js
│   ├── navigation/
│   │   └── AppNavigator.js      # Role-based routing
│   ├── reducers/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── MenuScreen.js
│   │   ├── CartScreen.js
│   │   ├── OrderSummaryScreen.js  # Submits to backend API
│   │   ├── OrdersScreen.js
│   │   ├── ReservationScreen.js
│   │   ├── ManagerDashboardScreen.js
│   │   └── ProfileScreen.js
│   ├── services/
│   │   └── api.js               # All API endpoints
│   └── theme/
│
├── screenshots/                 # Assignment 1 screenshots
├── App.js
├── app.json
├── index.js
├── package.json
└── README.md
```

---

## 🔄 Application Flow

### Customer Flow
```text
Signup / Login (JWT)
      ↓
   Menu Home (from MongoDB)
      ↓
Search / Filter / Sort
      ↓
     Cart
      ↓
Promo Code (Optional)
      ↓
Order Summary
      ↓
Confirm Order → Saved to MongoDB
      ↓
Order Tracking
      ↓
Reserve Table → Saved to MongoDB
```

### Manager Flow
```text
Manager Login (JWT, role=manager)
      ↓
Manager Dashboard
      ↓
Orders → All customer orders from MongoDB
      ↓
Update Order Status → Saved to MongoDB
      ↓
Reservations → Accept/Decline → Saved to MongoDB
      ↓
Menu Management → Add/Edit/Toggle → Saved to MongoDB
```

---

## ✨ Features

### 👤 Customer Features
- JWT login and signup (real backend)
- Role-based navigation (customer vs manager)
- 20 restaurant menu items from MongoDB
- Category filtering, debounced search, sorting, favourites
- Cart management with quantity, notes, promo codes
- Order placement (submitted to backend)
- Order tracking (Pending → Preparing → Ready → Served)
- Table reservations (saved to MongoDB)
- Reservation cancellation
- Light/Dark theme switching
- Profile screen and logout

### 👨‍💼 Manager Features
- Manager-only navigation (customers cannot access)
- Dashboard with live stats (active orders, pending tables, unavailable items)
- Incoming orders from all customers (real MongoDB data)
- Order status updates (Mark Preparing / Ready / Served) — persisted to DB
- All customer reservations (real MongoDB data)
- Accept / Decline reservations — persisted to DB
- Add menu items → saved to MongoDB
- Edit menu item prices → saved to MongoDB
- Toggle item availability → saved to MongoDB
- Manager profile and logout

---

## 🍴 Menu (20 Items)

### Starters
1. Crispy Dynamite Prawns — Rs. 1,290
2. Chicken Tikka Bites — Rs. 790
3. Loaded Masala Fries — Rs. 590
4. Smoked Tomato Soup — Rs. 490

### Mains
5. Lahori Chicken Karahi — Rs. 1,690
6. Mughlai Beef Biryani — Rs. 1,190
7. Grilled Herb Chicken — Rs. 1,490
8. Creamy Mushroom Pasta — Rs. 1,290
9. Classic Smash Burger — Rs. 1,390
10. Paneer Handi — Rs. 1,190

### Desserts
11. Molten Chocolate Cake — Rs. 690
12. Lotus Cheesecake — Rs. 650
13. Shahi Tukray — Rs. 550

### Drinks
14. Fresh Orange Juice — Rs. 420
15. Mango Juice — Rs. 450
16. Mint Lemonade — Rs. 390
17. Cappuccino — Rs. 460
18. Karak Chai — Rs. 290
19. Classic Soft Drink — Rs. 250
20. Mineral Water — Rs. 180

---

## 🧩 React Hooks Used

| Hook | Usage |
|---|---|
| `useState` | Forms, search, filters, sorting, modal state |
| `useEffect` | API calls, timers, AsyncStorage persistence |
| `useRef` | Input refs, timers, render diagnostics |
| `useContext` | Auth, theme, cart, orders, restaurant state |
| `useReducer` | Cart and order state transitions |
| `useMemo` | Menu filtering, totals, dashboard stats |
| `useCallback` | Stable handlers for reusable components |
| `React.memo` | Avoiding re-renders in list items |
| `useForm` | Form values, validation, submission |
| `useDebounce` | Delayed menu search |
| `useReservation` | Availability, validation, API integration |

---

## 🏷️ Promo Codes

| Promo Code | Discount |
|---|---:|
| `WELCOME10` | 10% |
| `FEAST20` | 20% |

---

## 🎓 Assignment 2 Coverage

| Requirement | Implementation |
|---|---|
| Backend API | Express.js REST API on port 5000 |
| Database | MongoDB Atlas with Mongoose |
| Authentication | JWT with bcrypt password hashing |
| Role-based access | `protect` + `managerOnly` middleware |
| Customer can't access manager routes | ✅ Verified |
| Manager sees all orders | ✅ Real MongoDB data |
| Manager sees all reservations | ✅ Real MongoDB data |
| Orders persist to DB | ✅ POST `/api/orders` |
| Reservations persist to DB | ✅ POST `/api/reservations` |
| Menu changes persist to DB | ✅ POST/PUT `/api/menu` |
| End-to-end flow tested | ✅ Customer → Order → Manager sees it |

---

## 📌 Project Scope

Hassan Cafe is a Mobile Application Development **Assignment 2** full-stack application demonstrating React Native frontend + Node.js/Express backend + MongoDB Atlas database integration with role-based access control.

---

## 👨‍💻 Project

**Hassan Cafe**
**Restaurant App MVP — Assignment 2 — Fall 2026**
**React Native + Expo + Node.js + MongoDB**
