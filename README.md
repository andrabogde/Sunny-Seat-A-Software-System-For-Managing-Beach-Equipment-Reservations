#🌞 Sunny-Seat-A-Software-System-For-Managing-Beach-Equipment-Reservations

[![License](https://img.shields.io/badge/license-None-lightgrey.svg)](#)  
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)  
[![Made with React](https://img.shields.io/badge/frontend-React-blue)](#)  
[![Made with Spring Boot](https://img.shields.io/badge/backend-Spring%20Boot-darkgreen)](#)  
[![Database](https://img.shields.io/badge/database-MySQL-orange)](#)  

---

## 📖 **Project Overview**

**Sunny Seat** is an innovative web application designed to **facilitate sunbed reservations on Romanian seaside beaches**.  
The platform serves both **tourists**, who can check real-time availability and book sunbeds, and **beach administrators**, who can manage resources efficiently.  

🎯 **Project Goal:**  
✔️ Reduce the time spent searching for available sunbeds  
✔️ Provide a modern, user-friendly vacation planning experience  
✔️ Digitalize resource management for beach administrators  

---

## 🛠️ **Technologies Used**

### **Frontend**
- ⚛️ [React.js](https://react.dev/) – component-based UI
- ⚡ [Vite](https://vitejs.dev/) – fast build & HMR
- 🎨 [Bootstrap](https://getbootstrap.com/) – responsive design

### **Backend**
- ☕ [Spring Boot](https://spring.io/projects/spring-boot) – microservices & REST API
- 🗄️ [MySQL](https://www.mysql.com/) – relational database
- 🌐 RESTful API – client-server communication
- 🐘 phpMyAdmin – database management

### **API Integrations**
- 🗺️ Google Maps API – interactive maps
- 🌤️ OpenWeather API – real-time weather & water temperature
- 🤖 Fuse.js – fuzzy search for the virtual assistant
- 💳 Stripe API – secure online payments

---

## 🚀 **Key Features**

✔️ **User & Admin Authentication**  
✔️ **Real-time sunbed availability** on an interactive map  
✔️ **Online reservations & payments** (full or partial)  
✔️ **Google reviews & ratings** integration  
✔️ **Virtual Assistant** powered by React + Fuse.js  
✔️ **Beach Management** (pricing updates, resource monitoring)  

---

## 📂 Project Structure

```
SunnySeat/
├── frontend/                 # React.js + Vite + Bootstrap (UI Layer)
│   ├── src/                  # Application source code
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Screens (Home, Reservation, Admin Panel)
│   │   ├── services/         # API integration (Axios calls)
│   │   └── assets/           # Images, styles, icons
│   └── public/               # Public assets (index.html, favicon, etc.)
│
├── backend/                  # Spring Boot REST API (Business Logic + Security)
│   ├── src/main/java/        # Java source code
│   │   ├── controller/       # API endpoints
│   │   ├── service/          # Business logic layer
│   │   ├── repository/       # JPA repositories (DB interactions)
│   │   └── model/            # Entities & DTOs
│   └── src/main/resources/   # Configurations (application.properties)
│
├── database/                 # Database schema and diagrams
│   ├── sunnyseat.sql         # Initial schema and seed data
│   └── diagrams/             # ERD diagrams
│
└── README.md                 # Project documentation
```


### 📌 Folder Descriptions

- **frontend/** – Contains the React.js+Vite client application (user interface).  
- **backend/** – Includes the Spring Boot REST API for business logic, authentication, and database communication.  
- **database/** – Holds MySQL scripts and ER diagrams.  
- **README.md** – Project documentation.

## ⚙️ Installation & Setup

### ✅ 1. Prerequisites
Make sure you have installed:  
- Java 17+ (for the Spring Boot backend)  
- Node.js 18+ & npm (for the React + Vite frontend)  
- MySQL 8+ and phpMyAdmin (for the database)  
- Maven (to build and run the backend)  
- Git (to clone the repository)  

---

### ✅ 2. Clone the repository
```bash
git clone https://github.com/username/SunnySeat.git
cd SunnySeat
```

### ✅ 3. Backend Configuration
Create a .env file (or edit application.properties) and add:
```bash
# =====================================
# DATABASE CONFIGURATION
# =====================================
spring.datasource.url=jdbc:mysql://localhost:3306/sunnyseat
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# =====================================
# STRIPE API KEYS
# =====================================
stripe.secret.key=sk_test_yourKeyHere
stripe.public.key=pk_test_yourKeyHere

# =====================================
# EMAIL CONFIGURATION
# =====================================
mail.server.host=smtp.mail.yahoo.com
mail.server.port=587
mail.server.username=your_email@yahoo.com
mail.server.password=your_app_password
```
Run the backend server:
```bash
mvn spring-boot:run
```
### ✅ 4. Frontend Configuration
Install dependencies:
```bash
npm install
```
Create a .env file in the frontend folder and add:
```bash
VITE_API_URL=http://localhost:8080/api
VITE_STRIPE_PUBLIC_KEY=pk_test_yourKeyHere
```
Run the frontend development server:
```bash
npx vite --port=4000
```

### 5.🗄️ Database Configuration
Create the MySQL database:
```bash
CREATE DATABASE sunnyseat;
```
Import the initial schema and seed data:
```bash
mysql -u root -p sunnyseat < database/sunnyseat.sql
```
