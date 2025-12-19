# NEON Club Frontend

React.js web application for the NEON Club platform providing interfaces for nurses, mentors, and administrators.

## Features

### For Nurses
- Browse and book courses, workshops, and events
- Manage bookings and view status
- Process payments
- Track NCC certification progress
- View mentorship sessions

### For Mentors
- Manage mentorship bookings
- Conduct nurse assessments
- Provide session feedback
- Track mentee progress

### For Administrators
- User management (create, update, delete users)
- Catalog management (courses, workshops, events)
- Booking oversight and status updates
- Payment management and approval
- System statistics and reporting

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Backend server running on http://localhost:5000

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

The application will open at http://localhost:3000

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar
│   └── PrivateRoute.js # Route protection
├── contexts/           # React contexts
│   └── AuthContext.js  # Authentication state management
├── pages/              # Page components
│   ├── Home.js         # Landing page
│   ├── Login.js        # Login page
│   ├── Register.js     # Registration page
│   ├── Dashboard.js    # Nurse dashboard
│   ├── AdminDashboard.js    # Admin dashboard
│   ├── MentorDashboard.js   # Mentor dashboard
│   └── Unauthorized.js # Access denied page
├── services/           # API communication
│   └── api.js          # Backend API calls
└── utils/              # Utility functions
```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000/api` with the following endpoints:

- **Auth**: `/auth/register`, `/auth/login`, `/auth/me`
- **Admin**: `/admin/users`, `/admin/stats`
- **Catalog**: `/catalog` (CRUD operations)
- **Bookings**: `/booking` (CRUD operations)
- **Payments**: `/payment` (CRUD operations)
- **Assessments**: `/assessment` (CRUD operations)
- **Feedback**: `/feedback` (CRUD operations)
- **NCC**: `/ncc` (status tracking)

## Authentication

- JWT tokens stored in localStorage
- Automatic token attachment to API requests
- Role-based route protection
- Automatic redirect based on user role

## Role-Based Access

- **Nurses**: Access to catalog, bookings, payments, NCC status
- **Mentors**: Access to mentorship bookings, assessments, feedback
- **Admins**: Full access to all management features

## Usage

1. **Registration**: Choose your role (nurse/mentor/admin) and create an account
2. **Login**: Use your credentials to access the platform
3. **Dashboard**: Automatically redirected to role-appropriate dashboard
4. **Features**: Use the tabbed interface to access different features

## Development

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Environment Variables
The frontend automatically connects to `http://localhost:5000` for the backend API.

## Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your web server
3. Ensure the backend API is accessible from your deployment environment