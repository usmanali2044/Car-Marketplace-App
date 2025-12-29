# Car Marketplace

A full-stack web application for buying and selling cars. Users can create accounts, list their cars for sale, browse available cars, and send buy requests to sellers.

## Features

### User Authentication
- User registration and login
- Email verification via Mailtrap
- Password reset functionality
- JWT-based authentication with secure cookies
- Protected routes and API endpoints

### Car Listings
- Create, read, update, and delete car listings
- Search and filter cars by various criteria
- Detailed car information including:
  - Brand, model, year
  - Price and mileage
  - Transmission type (Automatic, Manual, CVT)
  - Fuel type (Petrol, Diesel, Electric, Hybrid, CNG)
  - Condition (New, Used, Certified Pre-Owned)
  - Location
  - Description and images
- Mark cars as sold

### Buy Requests
- Buyers can send purchase requests to sellers
- Sellers can accept or decline buy requests
- Status tracking (pending, accepted, declined)
- Message functionality for communication

### User Dashboard
- View and manage your car listings
- Track buy requests (sent and received)
- Manage account settings

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Mailtrap** - Email service for development
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## Project Structure

```
Car-Marketplace/
├── backend/
│   ├── controllers/        # Request handlers
│   │   ├── auth.controller.js
│   │   ├── buyRequest.controller.js
│   │   └── car.controller.js
│   ├── db/
│   │   └── connectDb.js    # MongoDB connection
│   ├── middleware/
│   │   └── verifyToken.js  # JWT verification
│   ├── models/             # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── car.model.js
│   │   └── buyRequest.model.js
│   ├── routes/              # API routes
│   │   ├── auth.route.js
│   │   ├── buyRequest.route.js
│   │   └── car.route.js
│   ├── utils/
│   │   └── generateTokenandSetCookie.js
│   ├── mailtrap/           # Email configuration
│   │   ├── emails.js
│   │   ├── emailTemplates.js
│   │   └── mailtrap.config.js
│   ├── index.js            # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable components
    │   │   └── Input.jsx
    │   ├── pages/           # Page components
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── SignupPage.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CarListingPage.jsx
    │   │   ├── CarDetailsPage.jsx
    │   │   ├── CreateCarPage.jsx
    │   │   ├── EditCarPage.jsx
    │   │   └── EmailVerificationPage.jsx
    │   ├── store/           # Zustand stores
    │   │   ├── authStore.js
    │   │   ├── carStore.js
    │   │   └── buyRequestStore.js
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Car-Marketplace
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   MAILTRAP_API_TOKEN=your_mailtrap_api_token
   MAILTRAP_INBOX_ID=your_mailtrap_inbox_id
   ```

2. **Frontend Configuration**
   
   The frontend is configured to connect to `http://localhost:3000` for API requests. If your backend runs on a different port, update the API base URL in your store files.

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:3000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password with token

### Cars
- `GET /api/cars` - Get all cars (with optional filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create a new car listing (protected)
- `PUT /api/cars/:id` - Update car listing (protected)
- `DELETE /api/cars/:id` - Delete car listing (protected)

### Buy Requests
- `GET /api/buy-requests` - Get buy requests (protected)
- `GET /api/buy-requests/:id` - Get buy request by ID (protected)
- `POST /api/buy-requests` - Create a buy request (protected)
- `PUT /api/buy-requests/:id/respond` - Accept/decline buy request (protected)

## Development

### Backend Scripts
- `npm run dev` - Start development server with nodemon

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Models

### User
- name, email, password
- isVerified, lastLogin
- verificationToken, resetPasswordToken
- timestamps

### Car
- seller (reference to User)
- brand, model, year, price, mileage
- transmission, fuelType, condition
- location, description, images
- isSold, soldAt
- timestamps

### BuyRequest
- car (reference to Car)
- buyer, seller (references to User)
- status (pending, accepted, declined)
- message, respondedAt
- timestamps

## Security Features

- Password hashing with bcryptjs
- JWT tokens stored in HTTP-only cookies
- CORS configuration for secure cross-origin requests
- Email verification for account activation
- Password reset with secure tokens
- Protected API routes with middleware

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

Created as part of a full-stack development project.

