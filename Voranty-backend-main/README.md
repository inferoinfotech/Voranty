# Voranty Backend

## Overview
The **Voranty Backend** serves as the server-side application for the Voranty platform. It provides RESTful APIs and backend functionality for managing expenses, warranties, reports, and user authentication.

---

## Features
- **Authentication**: Secure user login and token-based authentication.
- **Expense Management**: CRUD operations for expenses and rules.
- **Warranty Management**: Track and manage warranty records.
- **Reports**: Generate and export reports.
- **Reminders**: Automated SMS and email reminders for due dates.

---

## Getting Started

### Prerequisites
Ensure you have the following tools installed:
- [Node.js](https://nodejs.org/): v16+
- [mongodb](https://cloud.mongodb.com/)
- [Git](https://git-scm.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/swiftrut/Voranty-backend.git
   cd Voranty-backend
   git checkout developing
   ```

2. Install dependencies:
   ```bash
   npm --force install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Reference the `.env.example` file for required variables:
     ```env
     DATABASE_URL=your_database_url
     JWT_SECRET=your_jwt_secret
     PORT=your_preferred_port
     CLOUDINARY_URL=your_cloudinary_url
     ```


4. Start the development server:
   ```bash
   npm start
   ```

---

## Project Structure
```
Voranty-backend/
├── server.js           # Main server entry point
├── config/
│   └── db.js       # Database configuration
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   ├── warrentyController.js
│   └── reportController.js
├── middleware/
│   ├── authMiddleware.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Expense.js
│   ├── Warrenty.js
│   └── Report.js
├── routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   └── warrentyRoutes.js
├── utils/
│   ├── emailService.js
│   ├── jwtUtils.js
│   └── cloudinaryUtils.js
├── uploads/           # Uploaded files
├── .env               # Environment variables (example provided)
├── package.json       # Dependencies and scripts
└── README.md          # Project documentation
```

---

## Scripts

| Script           | Description                          |
|------------------|--------------------------------------|
| `npm start `     | Starts the production server.        |

---

## Contributing
We welcome contributions! Follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes and push them:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature-name
   ```
4. Open a pull request.

---

## 📄 Live URL
Please visit our project and give us the feedback if you want to 
Live url : 
```bash
https://voranty-backend.onrender.com
```
---

## Contact
For questions or support, please contact the repository maintainers or open an issue on GitHub.

