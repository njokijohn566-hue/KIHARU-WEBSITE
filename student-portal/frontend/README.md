# Frontend Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

```bash
cd frontend
npm install
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the Application

### Development

```bash
npm run dev
```

Application runs on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Home page
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── dashboard/                # Dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── grades/page.tsx       # Grades view
│   │   ├── units/page.tsx        # Unit registration
│   │   ├── fees/page.tsx         # Fees management
│   │   ├── assignments/page.tsx  # Assignments view
│   │   └── profile/page.tsx      # Student profile
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── Header.tsx                # Page header
│   └── DashboardLayout.tsx        # Dashboard wrapper
├── utils/                        # Utilities
│   ├── api.ts                    # API client
│   └── authStore.ts              # Auth state (Zustand)
└── public/                       # Static assets
```

## Key Features

### Pages

- **Home Page** (`/`) - Landing page with login/register links
- **Login Page** (`/login`) - Student authentication
- **Register Page** (`/register`) - New student registration
- **Dashboard** (`/dashboard`) - Main student portal
  - **Grades** - View academic performance
  - **Units** - Register/drop courses
  - **Fees** - Track payments and balance
  - **Assignments** - Submit assignments
  - **Profile** - Edit student information

### Components

- **Sidebar** - Main navigation menu
- **Header** - Page header with branding
- **DashboardLayout** - Protected layout with authentication check

### Utilities

- **API Client** - Axios-based HTTP client with interceptors
- **Auth Store** - Zustand store for authentication state
- **Token Management** - Automatic JWT token handling

## Styling

The application uses **Tailwind CSS** for styling. 

### Color Scheme

- **Primary**: Blue (`#3b82f6`)
- **Secondary**: Green (`#10b981`)
- **Accent**: Amber (`#f59e0b`)

### Responsive Design

All pages are mobile-first responsive:
- Small devices: Single column
- Medium devices: 2 columns
- Large devices: 3-4 columns

## Authentication Flow

1. User visits home page
2. Clicks login/register
3. Submits credentials
4. Receives JWT token
5. Token stored in Zustand store and localStorage
6. Automatically added to API requests
7. Redirected to dashboard on success
8. Logout clears token and redirects to login

## API Integration

### Using the API Client

```typescript
import { gradesAPI, coursesAPI, enrollmentAPI } from '@/utils/api';

// Get all grades
const response = await gradesAPI.getAll();
const { grades, gpa } = response.data.data;

// Register course
await enrollmentAPI.register(courseId);

// Drop course
await enrollmentAPI.drop(courseId);
```

### Error Handling

```typescript
try {
  const response = await gradesAPI.getAll();
} catch (error: any) {
  // Handle error
  const message = error.response?.data?.message;
  toast.error(message || 'Failed to load');
}
```

### Authentication

- Token automatically added to requests via interceptor
- 401 responses redirect to login
- Token can be refreshed if expired

## State Management

Using **Zustand** for lightweight state management:

```typescript
import { useAuthStore } from '@/utils/authStore';

export default function Component() {
  const { token, user, setToken, logout } = useAuthStore();
  
  // Use state and methods
}
```

## Notifications

Using **React Hot Toast** for notifications:

```typescript
import toast from 'react-hot-toast';

toast.success('Success message');
toast.error('Error message');
toast.loading('Loading...');
```

## Performance Optimizations

- Image optimization (Next.js Image component)
- Code splitting (Next.js automatic)
- CSS-in-JS (Tailwind)
- React SWR for data fetching
- Lazy loading components

## Development Tips

- Use React DevTools for debugging
- Next.js Fast Refresh for instant updates
- Tailwind IntelliSense VS Code extension
- Chrome DevTools Network tab for API debugging

## Troubleshooting

**CORS errors:**
- Ensure backend is running on port 5000
- Check NEXT_PUBLIC_API_URL is correct

**Authentication fails:**
- Clear localStorage and try again
- Check JWT token expiry in backend

**Styles not loading:**
- Run `npm run build`
- Clear `.next` directory
- Restart dev server

**API returns 404:**
- Verify backend routes are implemented
- Check endpoint names match

## Building for Production

```bash
# Build
npm run build

# Test production build locally
npm run start

# Deploy
# Push to your hosting platform (Vercel, Netlify, etc.)
```

### Environment for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- **Next.js 14** - React framework
- **React 18** - UI library
- **Axios** - HTTP client
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## Next Steps

1. Customize styling/branding
2. Add file upload functionality
3. Integrate payment gateway
4. Add email notifications
5. Implement analytics
6. Add dark mode

## Support

For issues or questions, refer to:
- Next.js Documentation: https://nextjs.org/docs
- React Documentation: https://react.dev
- Tailwind CSS Documentation: https://tailwindcss.com/docs
