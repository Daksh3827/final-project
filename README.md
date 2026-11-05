# Node.js Blog

A server-rendered, multi-user blogging application built with **Node.js, Express, MongoDB, EJS, and JWT authentication**.

The application allows users to create accounts, publish articles, manage their content, and interact through comments. It also includes role-based authorization, ensuring that users can manage their own content while administrators have access to all articles and comments.

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication using `httpOnly` cookies
- Secure password hashing with bcrypt
- Role-based access control (`user` and `admin`)
- Protected routes and authorization middleware

### Article Management
- Create, read, update, and delete articles
- Multi-user article ownership
- Author-based article filtering
- Personal article dashboard
- Ownership-based editing and deletion permissions
- Public article browsing

### Comment Management
- Add comments to articles
- Edit and delete comments
- Comment ownership validation
- Administrator access to all comments

### User Interface
- Server-rendered pages using EJS
- Responsive editorial-style design
- Shared EJS layouts and partials
- Accessible navigation
- Responsive mobile navigation menu

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend web framework |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| EJS | Server-side templating |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | Cookie handling |
| body-parser | Request body parsing |
| dotenv | Environment configuration |

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js 18 or newer
- npm
- MongoDB (local installation or MongoDB Atlas account)
- Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
```

Navigate into the project directory:

```bash
cd blog
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/blog_app
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
```

Update the environment variables according to your configuration.

**Important:** Use a strong, randomly generated JWT secret. Never commit your `.env` file or expose your production credentials.

### 4. Start the Application

For production-style execution:

```bash
npm start
```

For development with automatic server restarts:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Project Structure

```text
blog/
│
├── config/
│   └── Database and authentication configuration
│
├── controllers/
│   └── Authentication, article, and comment controllers
│
├── middleware/
│   └── Authentication, JWT, and authorization middleware
│
├── models/
│   └── User, Article, and Comment schemas
│
├── public/
│   ├── css/
│   ├── js/
│   └── favicon
│
├── routes/
│   └── Authentication, article, and comment routes
│
├── utils/
│   └── JWT and permission utilities
│
├── views/
│   ├── partials/
│   └── EJS templates
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Application Routes

### General Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Home page |
| GET | `/register` | Public | Registration page |
| POST | `/register` | Public | Register a new user |
| GET | `/login` | Public | Login page |
| POST | `/login` | Public | Authenticate user |
| POST | `/logout` | Public | Clear authentication cookie |

### Article Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/articles` | Public | View all articles |
| GET | `/articles/author/:id` | Public | View articles by author |
| GET | `/articles/:id` | Public | View article and comments |
| GET | `/articles/my` | Authenticated | View personal articles |
| GET | `/articles/new` | Authenticated | Display article creation form |
| POST | `/articles` | Authenticated | Create an article |
| GET | `/articles/:id/edit` | Owner / Admin | Display article editing form |
| POST | `/articles/:id/edit` | Owner / Admin | Update an article |
| POST | `/articles/:id/delete` | Owner / Admin | Delete an article |

### Comment Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/articles/:id/comments` | Authenticated | Add a comment |
| GET | `/comments/:id/edit` | Owner / Admin | Display comment editing form |
| POST | `/comments/:id/edit` | Owner / Admin | Update a comment |
| POST | `/comments/:id/delete` | Owner / Admin | Delete a comment |

## User Roles & Permissions

The application implements role-based access control with two roles.

| Permission | User | Admin |
|---|---|---|
| Browse articles | Yes | Yes |
| Create articles | Yes | Yes |
| Edit own articles | Yes | Yes |
| Delete own articles | Yes | Yes |
| Manage other users' articles | No | Yes |
| Add comments | Yes | Yes |
| Edit own comments | Yes | Yes |
| Delete own comments | Yes | Yes |
| Manage other users' comments | No | Yes |

### Creating an Admin Account

New registrations are assigned the `user` role by default.

To promote an existing user to administrator, execute the following MongoDB command:

```javascript
db.users.updateOne(
  { username: "admin" },
  { $set: { role: "admin" } }
);
```

Replace `admin` with the target username.

## Authentication Flow

The application uses JSON Web Tokens (JWT) for session authentication.

1. A user registers with a username and password.
2. The password is hashed using bcrypt before storage.
3. During login, the submitted credentials are validated.
4. A JWT is generated after successful authentication.
5. The token is stored in an `httpOnly` cookie.
6. Authentication middleware verifies the token on protected requests.
7. Authorization middleware checks resource ownership and user roles.

## Navigation

The shared navigation component is located at:

```text
views/partials/navbar.ejs
```

It provides:

- Home page navigation
- All articles
- Personal article dashboard
- New article creation
- Login and registration links for guests
- Logout functionality for authenticated users
- Responsive mobile navigation

The mobile navigation interactions are handled by:

```text
public/js/navbar.js
```

---

**Built with Node.js, Express, MongoDB, and EJS.**
