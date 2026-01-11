<h1 align="center">👓 <em>AI Virtual Try-On Platform</em> 💍</h1>
<p align="center">
  🌐 <a href="https://ai-tryon-chi.vercel.app/" target="_blank">Live Demo</a>
</p>

<div align="center">

![Virtual Try-On Banner](/images/banner.png)

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&duration=3000&pause=1000&color=EC4899&center=true&vCenter=true&width=600&lines=AI-Powered+Virtual+Try-On;Earrings+%26+Glasses;Real-Time+Face+Detection;Browser-Based+Solution" alt="Typing SVG" />
</p>

### 🎯 *Try Before You Buy, Virtually* 🎯

*An AI-based virtual try-on platform that allows users to try earrings and glasses virtually using live camera or photo upload. Experience real-time try-on using face landmark detection.*

<p align="center">
  <img src="https://img.shields.io/badge/🤖%20AI-MediaPipe-blue?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/⚛️%20Frontend-React-cyan?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/🚀%20Backend-Node.js-green?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/🗄️%20Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb&logoColor=white" />
</p>

---

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

</div>

## 📌 **Project Overview**

This project is an **AI-based virtual try-on platform** that allows users to:

- 👓 **Try earrings and glasses virtually**
- 📸 **Use live camera or photo upload**
- ⚡ **Experience real-time try-on** using face landmark detection

The project focuses on **realistic, fast, browser-based try-on** without requiring server-side processing for the try-on functionality.

---

## 🚀 **Features**

### 🔐 **Authentication & Roles**

<div align="center">

![Authentication System](/images/image.png)

</div>

- **Custom authentication** using MongoDB + JWT
- **Role-based access** with three distinct roles:
  - 👤 **USER** — Browse and try products
  - 🏪 **SELLER** — Upload and manage products
  - 👨‍💼 **ADMIN** — Approve sellers and products

---

### 🏪 **Seller Features**

<div align="center">

![Seller Dashboard](/images/image1.png)

</div>

<table>
<tr>
<td width="50%">

#### 📝 **Account Management**
- Seller signup and login
- Seller verification system
- Admin approval required before selling

</td>
<td width="50%">

#### 📦 **Product Management**
- Seller dashboard
- Upload products (earrings & glasses only)
- View all uploaded products
- Product status tracking (Pending / Approved)

</td>
</tr>
</table>

---

### 👨‍💼 **Admin Features**

<div align="center">

![Admin Dashboard](/images/image2.png)

</div>

<table>
<tr>
<td width="50%">

#### 👥 **Seller Management**
- Admin dashboard
- View seller verification requests
- Approve or reject sellers

</td>
<td width="50%">

#### ✅ **Product Moderation**
- Review uploaded products
- Approve or reject products
- Products go live only after approval

</td>
</tr>
</table>

---

### 👤 **User Features**

<div align="center">

![User Dashboard](/images/image3.png)

</div>

- 📊 **User dashboard**
- 🛍️ **Browse approved products**
- 🔥 **View trending products** (based on try-on count)
- 👓 **Try-on feature** available for both users and sellers

---

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 👓 **Virtual Try-On Functionality**

<div align="center">

![Virtual Try-On Demo](/images/image4.png)

</div>

### 🧠 **How It Works**

The try-on functionality is implemented using **MediaPipe FaceMesh** for accurate face landmark detection:

<table>
<tr>
<td width="50%">

#### 🎯 **Key Features**
- ✅ Try-on for **earrings and glasses**
- ✅ Uses **MediaPipe FaceMesh** for face detection
- ✅ Runs **fully client-side** (no server processing)
- ✅ **Dynamic scaling** based on face size
- ✅ **Correct landmark-based placement**

</td>
<td width="50%">

#### 📍 **Placement Logic**
- **Earrings**: Placed on ear landmarks
- **Glasses**: Aligned to eyes and nose bridge
- **Real-time adjustment** as face moves
- **Accurate positioning** across different face sizes

</td>
</tr>
</table>

### ⚠️ **Technical Notes**

- **No background removal** — PNG images with transparency only
- **Browser-based processing** for instant results
- **Canvas rendering** for overlay visualization

---

### 📸 **Try-On Modes**
<table>
<tr>
<td width="50%">

#### 📸 **Upload Photo (Primary)**

<div align="center">

![Photo Upload Mode](/images/image4.png)

</div>

- Upload your photo
- Select product to try
- Instant try-on preview
- Save or share result

</td>
<td width="50%">

#### 🎥 **Live Camera (Real-Time)**

<div align="center">

![Live Camera Mode](/images/image5.png)

</div>

- Use webcam for live try-on
- Move your face naturally
- Real-time product placement
- Capture screenshot

</td>
</tr>
</table>

---

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🧠 **Technology Stack**

<div align="center">

<table>
<tr>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="60" height="60"/>
<br><strong>React</strong>
<br><em>Frontend Framework</em>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="60" height="60"/>
<br><strong>Node.js</strong>
<br><em>Backend Runtime</em>
</td>
<td align="center" width="25%">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="60" height="60"/>
<br><strong>MongoDB</strong>
<br><em>Database</em>
</td>
<td align="center" width="25%">
<img src="https://www.svgrepo.com/show/374111/tensorflow.svg" width="60" height="60"/>
<br><strong>MediaPipe</strong>
<br><em>Face Detection</em>
</td>
</tr>
</table>

</div>

### 📋 **Complete Stack**

<table>
<tr>
<td width="50%">

#### 🌐 **Frontend**
- **React** → UI framework
- **Tailwind CSS** → Styling
- **MediaPipe FaceMesh** → Face landmark detection
- **HTML Canvas** → Try-on rendering
- **JavaScript** → Client-side logic

</td>
<td width="50%">

#### 🚀 **Backend**
- **Node.js** → Server runtime
- **Express.js** → Web framework
- **MongoDB Atlas** → Cloud database
- **JWT Authentication** → Secure auth tokens
- **Multer** → Image upload handling

</td>
</tr>
</table>

---

## 📁 **Project Structure**

```
virtual-tryon-platform/
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 Auth/
│   │   │   ├── 📁 Dashboard/
│   │   │   ├── 📁 TryOn/
│   │   │   └── 📁 Products/
│   │   ├── 📁 pages/
│   │   │   ├── 📄 UserDashboard.jsx
│   │   │   ├── 📄 SellerDashboard.jsx
│   │   │   ├── 📄 AdminDashboard.jsx
│   │   │   └── 📄 TryOnPage.jsx
│   │   ├── 📁 utils/
│   │   │   ├── 📄 faceMesh.js
│   │   │   └── 📄 tryOnEngine.js
│   │   ├── 📁 context/
│   │   └── 📄 App.jsx
│   └── 📄 package.json
│
├── 📁 backend/
│   ├── 📁 controllers/
│   │   ├── 📄 authController.js
│   │   ├── 📄 productController.js
│   │   └── 📄 adminController.js
│   ├── 📁 models/
│   │   ├── 📄 User.js
│   │   ├── 📄 Product.js
│   │   └── 📄 Seller.js
│   ├── 📁 routes/
│   │   ├── 📄 authRoutes.js
│   │   ├── 📄 productRoutes.js
│   │   └── 📄 adminRoutes.js
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js
│   │   └── 📄 roleCheck.js
│   ├── 📄 server.js
│   └── 📄 package.json
│
└── 📄 README.md
```

---

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🔒 **Security & Permissions**

<div align="center">

![Security System](./images/security-system.png)

</div>

### 🛡️ **Authentication & Authorization**

<table>
<tr>
<td width="33%">

#### 🔐 **JWT-Based Auth**
- Secure token generation
- Token expiration handling
- Refresh token mechanism

</td>
<td width="33%">

#### 🚦 **Role-Based Routes**
- Protected routes per role
- Middleware verification
- Unauthorized access prevention

</td>
<td width="33%">

#### ✅ **Approval Flow**
- Admin-only actions
- Seller verification required
- Product approval system

</td>
</tr>
</table>

### 📋 **Permission Matrix**

| Action | User | Seller | Admin |
|--------|------|--------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| Try-On Feature | ✅ | ✅ | ✅ |
| Upload Products | ❌ | ✅ | ✅ |
| Approve Sellers | ❌ | ❌ | ✅ |
| Approve Products | ❌ | ❌ | ✅ |

---

## 📊 **Analytics & Trending Logic**

<div align="center">

![Analytics Dashboard](./images/analytics-dashboard.png)

</div>

### 📈 **Try-On Tracking**

- **Try-on count tracking** for each product
- Incremented on every virtual try-on
- Used to calculate trending products

### 🔥 **Trending Products**

<table>
<tr>
<td width="50%">

**Calculation Logic:**
- Products sorted by try-on count
- Real-time trending updates
- Displayed on user dashboard

</td>
<td width="50%">

**Benefits:**
- Discover popular products
- Seller performance insights
- User engagement metrics

</td>
</tr>
</table>

---

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 🛠️ **Setup & Installation**

<div align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=18&duration=2000&pause=500&color=4ECDC4&center=true&vCenter=true&width=400&lines=Ready+to+Get+Started%3F;Follow+These+Simple+Steps!" alt="Getting Started" />
</div>

### 📋 **Prerequisites**

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

---

### **1️⃣ Clone the repository**

```bash
git clone <your-repo-url>
cd virtual-tryon-platform
```

---

### **2️⃣ Backend Setup**

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_atlas_uri

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Admin Credentials (Optional)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
```

**Start the backend:**

```bash
npm run dev
```

<div align="center">

🎉 **Backend running on:** `http://localhost:5000`

</div>

---

### **3️⃣ Frontend Setup**

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```ini
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MEDIAPIPE_MODEL_URL=https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh
```

**Start the frontend:**

```bash
npm start
```

<div align="center">

🎉 **Frontend running on:** `http://localhost:3000`

</div>

---

## 📸 **Screenshots / Demo**

<div align="center">

### 🏠 **Dashboard Views**

| 👤 **User Dashboard** | 🏪 **Seller Dashboard** |
|:---------------------:|:-----------------------:|
| ![User Dashboard](./images/user-dashboard-screen.png) | ![Seller Dashboard](./images/seller-dashboard-screen.png) |
| *Browse and try products* | *Manage product uploads* |

| 👨‍💼 **Admin Dashboard** | ✅ **Approval System** |
|:----------------------:|:---------------------:|
| ![Admin Dashboard](./images/admin-dashboard-screen.png) | ![Approval](./images/approval-system.png) |
| *Manage sellers and products* | *Review and approve* |

</div>

<div align="center">

### 👓 **Virtual Try-On Experience**

| 📸 **Photo Upload Try-On** | 🎥 **Live Camera Try-On** |
|:--------------------------:|:-------------------------:|
| ![Photo Try-On](./images/photo-tryon-demo.png) | ![Live Try-On](./images/live-tryon-demo.png) |
| *Upload and try instantly* | *Real-time face tracking* |

| 💍 **Earrings Try-On** | 👓 **Glasses Try-On** |
|:----------------------:|:---------------------:|
| ![Earrings](./images/earrings-tryon.png) | ![Glasses](./images/glasses-tryon.png) |
| *Accurate ear placement* | *Perfect eye alignment* |

</div>

<div align="center">

### 📦 **Product Management**

| ➕ **Upload Product** | 📊 **Product Status** |
|:---------------------:|:---------------------:|
| ![Upload](./images/product-upload.png) | ![Status](./images/product-status.png) |
| *Seller product upload* | *Track approval status* |

</div>

---

<div align="center">
<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">
</div>

## 📌 **Future Improvements**

<div align="center">

![Future Roadmap](./images/future-roadmap.png)

</div>

<table>
<tr>
<td width="33%">

### 🎯 **Phase 1**
- 👗 Clothing try-on
- 📱 Mobile app development
- 🌐 Multi-language support

</td>
<td width="33%">

### 🚀 **Phase 2**
- 🎨 3D product models
- 📏 AI-based size recommendations
- 💬 Live chat support

</td>
<td width="33%">

### 🌟 **Phase 3**
- 🛒 E-commerce integration
- 💳 Payment gateway
- 📧 Email notifications

</td>
</tr>
</table>

**Possible Enhancements:**
- ✅ **Clothing try-on** → Expand to shirts, dresses, etc.
- ✅ **3D models** → More realistic product visualization
- ✅ **Mobile app** → iOS and Android support
- ✅ **AI size recommendations** → Suggest best-fit products
- ✅ **Social sharing** → Share try-on results
- ✅ **Wishlist feature** → Save favorite products

---

## 🤝 **Contributing**

<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=20&duration=3000&pause=1000&color=4ECDC4&center=true&vCenter=true&width=500&lines=Contributions+Welcome!;Help+Improve+the+Platform;Join+the+Project!" alt="Contributing" />

</div>

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch
3. **💻 Commit** your changes
4. **📤 Push** to the branch
5. **🔄 Open** a Pull Request

---

## 📄 **License**

<div align="center">

**MIT License**

<img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />

</div>

---

<div align="center">

<img src="https://user-images.githubusercontent.com/73097560/115834477-dbab4500-a447-11eb-908a-139a6edaec5c.gif" width="100%">

### ⭐ **If you found this project helpful, please consider giving it a star!** ⭐

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=16&duration=2000&pause=1000&color=F75C7E&center=true&vCenter=true&width=600&lines=Try.+See.+Buy.;AI-Powered+Virtual+Try-On+%E2%9D%A4%EF%B8%8F;Shop+with+Confidence" alt="Footer" />

</div>