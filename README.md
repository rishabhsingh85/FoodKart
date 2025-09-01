# FoodKart 🍔
FoodKart is a simple and clean web-based food ordering platform built using basic HTML, CSS, and JavaScript. The website lets users view popular food items, explore the full menu, and access a separate cart page to manage selected items.

This project is designed as part of my learning in full stack web development and focuses mainly on structuring and organizing a multi-page food ordering interface.

## Features
- Displays 2–3 popular food items on the homepage (e.g., Cheese Burger, Veg Pizza)
- A dedicated Menu page showing the complete list of available dishes
- A separate Cart page where selected items can be viewed
- Simple layout with easy navigation between pages
- Clean UI and beginner-friendly code

## Built With
- HTML
- CSS
- JavaScript (basic usage)

## 💡 How to Use

### Option 1: Frontend Only
1. Download or clone the repository  
2. Open the folder  
3. Launch `index.html` directly in any modern browser  

No backend features will work in this mode (only static pages).

### Option 2: With Backend (Recommended)
1. Install [Node.js](https://nodejs.org/)  
2. Navigate to the project folder in terminal  
3. Run the following commands:  
   ```bash
   npm install
   node server.js



## 📖 Project Progress Summary

### 🔹 Phase 1: Project Initialization
- Set up folder structure
- Created `index.html` (homepage with popular items)

### 🔹 Phase 2: Menu Page Development
- Added `menu.html` with full menu list
- Linked homepage → menu navigation

### 🔹 Phase 3: Cart Page Implementation
- Created `cart.html` for selected items
- Navigation between pages added

### 🔹 Phase 4: Styling & Assets
- CSS for styling
- Images folder added

### 🔹 Phase 5: JavaScript Integration
- Basic interactivity in `script.js`

### 🔹 Phase 6: Payment Page
- Created `payment.html`
- Linked cart → payment page

### 🔹 Phase 7: Backend Setup
- Initialized Node.js with `npm init`
- Installed Express for backend server
- Created `server.js` to serve static files
- Successfully hosted website locally using Node.js


---

✅ **Current Flow:** Homepage → Menu → Cart → Payment  
🚀 **Next Steps:** Connect backend with frontend (cart logic, APIs), add database support (MongoDB), and integrate a payment gateway.


## 📷 Screenshots

### Homepage
<img width="1902" height="886" alt="Image" src="https://github.com/user-attachments/assets/db54f626-9e74-4412-9b7a-7387bb67a04b" />


### Menu Page
<img width="1887" height="821" alt="Image" src="https://github.com/user-attachments/assets/5674a34f-a9a9-4d27-895d-64268bb48078" />

### Cart Page
<img width="1901" height="879" alt="Image" src="https://github.com/user-attachments/assets/a71fe81b-1eab-4930-9d1e-fa3d6fd6cd0e" />

```bash

FoodKart/
├── index.html           # Homepage with popular items
├── menu.html            # Menu page with full item list
├── cart.html            # Cart page
├── payment.html         # Payment page
├── css/
│   └── style.css        # Main styling
├── js/
│   └── script.js        # JavaScript logic (if used)
└── images/              # Image assets for food items


