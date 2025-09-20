# Kanban Board Application

A full-stack Kanban board application built with React, Node.js, Express, and PostgreSQL. Features include board management, task creation, custom columns, drag-and-drop functionality, and responsive design with dark/light themes.

## 🚀 Features

### Frontend
- **Board Management**: Create, read, update, and delete boards
- **Task Management**: Create, read, update, and delete tasks with drag-and-drop
- **Custom Columns**: Add custom columns beyond the default TODO/DOING/DONE
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes
- **Mobile Navigation**: Hamburger menu for mobile sidebar access
- **Form Validation**: Client-side validation for all forms
- **Real-time Updates**: Optimistic UI updates for better UX

### Backend
- **RESTful API**: Complete CRUD operations for boards, tasks, and columns
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Server-side validation with express-validator
- **Security**: Rate limiting, CORS, Helmet security headers
- **Error Handling**: Comprehensive error handling and logging
- **Performance**: Response compression and optimized queries

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** (build tool)
- **Custom CSS** (no external UI libraries)
- **React Hooks** for state management
- **Custom validation utilities**

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database
- **Prisma** ORM
- **Express Validator** for validation
- **Morgan** for logging
- **Helmet** for security
- **CORS** for cross-origin requests
- **Compression** for response optimization

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd aragorn
```

### 2. Install Dependencies

Install dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE kanban_db;

# Exit psql
\q
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Run Database Migrations

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start the Application

#### Start Backend Server

```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
aragorn/
├── backend/
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── boards.js    # Board CRUD operations
│   │   │   ├── tasks.js     # Task CRUD operations
│   │   │   └── columns.js   # Column CRUD operations
│   │   └── server.js        # Main server file
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── BoardDetail.tsx
│   │   │   ├── BoardList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskColumn.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── modals/      # Modal components
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── index.ts     # Board and task hooks
│   │   │   └── useColumns.ts
│   │   ├── services/        # API service layer
│   │   │   └── api.ts
│   │   ├── types/           # TypeScript types
│   │   │   └── types.ts
│   │   ├── utils/           # Utility functions
│   │   │   └── validation.ts
│   │   └── styles/          # CSS styles
│   │       └── App.css
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔧 Available Scripts

### Backend Scripts

```bash
cd backend

npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run db:generate # Generate Prisma client
npm run db:push    # Push schema changes to database
npm run db:migrate # Run database migrations
npm run db:studio  # Open Prisma Studio
```

### Frontend Scripts

```bash
cd frontend

npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm test           # Run tests
```

## 📊 API Endpoints

### Boards
- `GET /api/boards` - Get all boards
- `GET /api/boards/:id` - Get a specific board
- `POST /api/boards` - Create a new board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

### Tasks
- `GET /api/tasks` - Get all tasks (with optional filtering)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Columns
- `GET /api/columns` - Get all columns (with optional filtering)
- `GET /api/columns/boards/:boardId` - Get columns for a specific board
- `GET /api/columns/:id` - Get a specific column
- `POST /api/columns` - Create a new column
- `PUT /api/columns/:id` - Update a column
- `DELETE /api/columns/:id` - Delete a column

## 🎨 Key Features Explained

### Custom Columns
- Create custom columns beyond the default TODO/DOING/DONE
- Each custom column gets a unique status (e.g., "In Review" → "IN_REVIEW")
- Drag and drop tasks between any columns
- Delete custom columns (static columns cannot be deleted)

### Drag and Drop
- Drag tasks between columns to update their status
- Visual feedback during drag operations
- Works with both static and custom columns
- Optimistic UI updates for better performance

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Sidebar collapses on mobile devices
- Touch-friendly interface

### Theme Support
- Dark and light mode toggle
- Consistent theming across all components
- Smooth transitions between themes

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check database connection
psql -U postgres -d kanban_db -c "SELECT 1;"
```

#### Prisma Issues
```bash
# Reset Prisma client
cd backend
npx prisma generate

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset
```

#### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 5173
- Make sure these ports are available

### Environment Variables
Make sure your `.env` file in the backend directory contains:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/kanban_db"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🚀 Deployment

### Backend Deployment
1. Set up a PostgreSQL database (e.g., Heroku Postgres, AWS RDS)
2. Update `DATABASE_URL` in production environment
3. Deploy to your preferred platform (Heroku, Railway, Vercel, etc.)

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred platform (Vercel, Netlify, etc.)
3. Update API endpoints if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

**Happy coding! 🎉**
