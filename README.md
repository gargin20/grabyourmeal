# 🍔 GrabYourMeal

> A high-performance, real-time food ordering platform featuring live delivery tracking, secure payments, and dynamic cart management.


## 📖 Overview
Building a modern e-commerce and food delivery platform requires complex state management, real-time data streaming, and robust third-party API integrations. **GrabYourMeal** is a comprehensive full-stack solution that allows users to browse restaurants, securely pay for their meals, and track their active delivery live on a map. 

## ✨ Key Features
* **📍 Real-Time Live Tracking:** Integrated WebSockets (`Socket.io`) and GeoAPI to establish a persistent, real-time connection, allowing users to track their delivery driver's exact location on a map.
* **💳 Secure Online Payments:** Fully integrated the **Razorpay** payment gateway for seamless, encrypted checkout processing and webhook transaction handling.
* **☁️ Cloud Media Management:** Utilized **Cloudinary** for fast, optimized restaurant and menu item image uploads, ensuring high-performance image delivery without bloating the database.
* **🛒 Dynamic Cart Management:** Complex global state handling for adding, removing, and updating item quantities in real-time without page reloads.
* **🔐 Secure User Authentication:** Encrypted user registration and login (JWT & bcrypt) to manage order history and save delivery preferences safely.

## 🛠️ Tech Stack
* **Frontend:** React.js, Context API / Redux
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose (Relational schemas for Users, Orders, and Restaurants)
* **Real-Time Engine:** Socket.io (WebSockets)
* **APIs & Integrations:** Razorpay API (Payments), Cloudinary (Media), GeoAPI (Geolocation & Mapping)

## 🚀 Local Setup & Installation

**1. Clone the repository**
\`\`\`bash
git clone https://github.com/gargin20/grabyourmeal.git
cd grabyourmeal
\`\`\`

**2. Install Dependencies**
Install packages for both the backend and the frontend.
\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
\`\`\`

**3. Environment Variables**
Create a \`.env\` file in the `server` directory. You will need to provision API keys from Razorpay, Cloudinary, and GeoAPI to run all features:
\`\`\`text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_API_KEY=your_firebase_api
EMAIL=your_email_id
PASS=yourpassword
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GEOAPI_KEY=your_geoapi_key
\`\`\`

**4. Run the Application**
Open two terminal windows to run both servers concurrently:
\`\`\`bash
# Terminal 1: Start the backend
cd backend
npm run dev

# Terminal 2: Start the frontend
cd frontend
npm run dev
\`\`\`

