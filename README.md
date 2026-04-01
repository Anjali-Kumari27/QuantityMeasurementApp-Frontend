# QuantityMeasurementApp-Frontend (React)

A React + TypeScript implementation of the Quantity Measurement App, built by converting the original HTML/CSS/JavaScript version into a structured, component-based frontend.

---

## 🚀 Tech Stack

* React 18 (Functional Components + Hooks)
* TypeScript (for type safety)
* React Router (for navigation and protected routes)
* Fetch API (for backend integration)
* CSS (reused and adapted from original UI)

---

## 📂 Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx     # Handles route protection using JWT
│
├── pages/
│   ├── Login.tsx              # User login page
│   ├── Signup.tsx             # User registration page
│   └── Dashboard.tsx          # Main functionality (operations + history)
│
├── services/
│   └── api.ts                 # All backend API calls
│
├── types/
│   └── index.ts            # Type definitions for DTOs and forms
│
├── styles/                    # Custom styling files
│   └── app.css            # Type definitions for DTOs and forms
│
├── App.tsx                    # Route configuration
├── main.tsx                   # Application entry point
└── index.css                  # Global styles
```

---

## 🔐 Routing & Access Control

| Route        | Page      | Access Type |
| ------------ | --------- | ----------- |
| `/login`     | Login     | Public      |
| `/signup`    | Signup    | Public      |
| `/dashboard` | Dashboard | Protected   |

👉 Protected routes are secured using a JWT token stored in `localStorage`.

---

## ⚙️ Features

* User Signup and Login (JWT-based authentication)
* Protected Dashboard access
* Quantity operations:

  * Compare
  * Convert
  * Add
  * Subtract
  * Divide
* Support for multiple measurement types:

  * Length
  * Weight
  * Volume
  * Temperature
* Operation history display
* Backend integration with Spring Boot (UC18)

---

## 🔗 Backend Integration

This frontend connects with the Spring Boot backend APIs.

### Required Backend Endpoints:

* `POST /auth/register`
* `POST /auth/login`
* `POST /api/quantity/perform`
* `GET  /api/quantity/history`

👉 All protected requests include:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## ▶️ Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Run the application

```
npm run dev
```

### 3. Open in browser

```
http://localhost:5173
```

---

## ⚠️ Important Notes

* Ensure backend is running at:

```
http://localhost:8080
```

* CORS must be enabled in backend for frontend to communicate properly.

* Token is stored in browser `localStorage` after login.

---

## 💡 Project Goal

This project demonstrates:

* Conversion of a static frontend into a React-based architecture
* Integration with a secured backend (Spring Security + JWT)
* Clean separation of concerns using components, services, and types
* Real-world application structure suitable for scaling

---
