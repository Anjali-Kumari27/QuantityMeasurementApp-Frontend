# QuantityMeasurementApp-Frontend (HTML/CSS/JS + JSON Server)

A frontend implementation of the Quantity Measurement App built using pure HTML, CSS, and JavaScript, with JSON Server acting as a mock backend for handling data and APIs.

---

## 🚀 Tech Stack

* HTML5 (page structure)
* CSS3 (styling and layout)
* Vanilla JavaScript (application logic)
* JSON Server (mock backend)
* Fetch API (API communication)

---

## 📂 Project Structure

```
QM-HTML-CSS-JS-JSONServer/
│
├── login.html                 # Login page (entry point)
├── signup.html                # User registration page
├── dashboard.html             # Main application page
├── db.json                    # Mock database (JSON Server)
├── package-lock.json          # Dependency lock file
├── .gitignore                 # Git ignore rules
│
├── css/
│   └── style.css              # All UI styling
│
├── js/
│   ├── script.js              # Authentication logic (login/signup)
│   └── dashboard.js           # Dashboard operations logic
│
├── images/
│   └── measurement.png        # UI image asset
```

---

## 🔐 Navigation & Access Control

| Page             | Purpose  | Access Type |
| ---------------- | -------- | ----------- |
| `login.html`     | Login    | Public      |
| `signup.html`    | Register | Public      |
| `dashboard.html` | Main App | Protected   |

👉 Access control is managed using `localStorage`:

* If user is not logged in → redirected to login page
* If logged in → dashboard is accessible

---

## ⚙️ Features

* User Signup and Login (stored in JSON Server)
* Client-side authentication using localStorage
* Quantity operations:

  * Compare
  * Convert
  * Add
  * Subtract
  * Divide
* Supports multiple measurement types:

  * Length
  * Weight
  * Volume
  * Temperature
* Dynamic UI updates using JavaScript
* Operation history tracking

---

## 🔗 JSON Server Integration

This project uses JSON Server as a mock backend.

### Example API Endpoints:

* `POST /users` → Register user
* `GET /users` → Validate login
* `POST /history` → Save operations
* `GET /history` → Fetch history

---

## ▶️ Getting Started

### 1. Install JSON Server

```
npm install -g json-server
```

### 2. Start JSON Server

```
json-server --watch db.json --port 3000
```

### 3. Run the application

Open `login.html` in your browser

---

## ⚠️ Important Notes

* JSON Server runs on:

```
http://localhost:3000
```

* Authentication is handled using browser `localStorage` (no real security)

* This is a frontend-focused implementation for learning and prototyping

---

## 🔄 Project Evolution

This project serves as the base version and is later upgraded to:

👉 React + TypeScript frontend integrated with Spring Boot backend (UC18)

---

## 💡 Project Goal

This project demonstrates:

* Building a complete application using pure JavaScript
* Managing authentication without frameworks
* Handling API communication using Fetch API
* Structuring frontend before migrating to modern frameworks like React

---
