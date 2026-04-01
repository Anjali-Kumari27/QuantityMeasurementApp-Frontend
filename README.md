# QuantityMeasurementApp-Frontend

This repository contains the frontend implementations of the **Quantity Measurement App** developed in two phases:

* **Phase 1:** HTML, CSS, JavaScript with JSON Server
* **Phase 2:** React + TypeScript integrated with Spring Boot backend

The project demonstrates the transition from a static frontend implementation to a structured, component-based frontend connected to a secured backend.

---

## 🚀 Tech Stack

### HTML/CSS/JS Version

* HTML5
* CSS3
* Vanilla JavaScript
* JSON Server
* Fetch API

### React Version

* React 18
* TypeScript
* React Router
* Fetch API
* CSS

---

## 📂 Repository Structure

```
QuantityMeasurementApp-Frontend/
│
├── main
│   └── Contains project overview and documentation
│
├── feature/QM-HTML-CSS-JS-JSONServer
│   └── Frontend built using HTML, CSS, JavaScript, and JSON Server
│
└── feature/QM-React-Typescript
    └── Frontend built using React + TypeScript with backend integration
```

---

## 🌿 Branch Overview

| Branch                              | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| `main`                              | Repository overview and common documentation                      |
| `feature/QM-HTML-CSS-JS-JSONServer` | Initial frontend implementation using HTML/CSS/JS and JSON Server |
| `feature/QM-React-Typescript`       | React + TypeScript version integrated with Spring Boot backend    |

---

## ⚙️ Project Evolution

### 1. HTML/CSS/JS + JSON Server Version

This version was created as the initial frontend implementation.

#### Features:

* Login and Signup pages
* Dashboard for quantity operations
* localStorage-based authentication
* JSON Server as mock backend
* Operation history support
* Pure JavaScript DOM handling

---

### 2. React + TypeScript Version

This version is the upgraded frontend implementation built with React.

#### Features:

* Component-based architecture
* Login and Signup with routing
* Protected routes using JWT
* Dashboard with quantity operations
* History integration
* Spring Boot backend connectivity
* Better code organization using pages, components, services, and types

---

## 🔐 Supported Functionalities

Across both versions, the application supports:

* User Signup
* User Login
* Quantity operations:

  * Compare
  * Convert
  * Add
  * Subtract
  * Divide
* Multiple measurement categories:

  * Length
  * Weight
  * Volume
  * Temperature
* Operation history tracking

---

## 🔗 Backend / API Usage

### HTML/CSS/JS Branch

Uses **JSON Server** as a mock backend.

Example endpoints:

* `POST /users`
* `GET /users`
* `POST /history`
* `GET /history`

---

### React Branch

Uses **Spring Boot backend** with JWT authentication.

Required endpoints:

* `POST /auth/register`
* `POST /auth/login`
* `POST /api/quantity/perform`
* `GET /api/quantity/history`

---

## ▶️ How to Use

### For HTML/CSS/JS Version

1. Switch to `feature/QM-HTML-CSS-JS-JSONServer`
2. Start JSON Server
3. Open `login.html` in browser

Example:

```
json-server --watch db.json --port 3000
```

---

### For React + TypeScript Version

1. Switch to `feature/QM-React-Typescript`
2. Install dependencies
3. Run the React application
4. Ensure Spring Boot backend is running

Example:

```
npm install
npm run dev
```

---

## 💡 Purpose of This Repository

This repository is created to demonstrate:

* Step-by-step frontend evolution
* Core frontend development using vanilla JavaScript
* Migration from static UI to React architecture
* Integration with secured backend APIs
* Clean and scalable project structure

---

## 📌 Notes

* The HTML/CSS/JS version helps in understanding core logic and flow
* The React + TypeScript version follows modern development practices
* Both implementations are maintained in separate branches for clarity

---
