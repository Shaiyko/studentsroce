import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './Dashboard';
import StudentSearchExport from './Showsroce';
import SheetManagerC from './SheetManagerC';
import RegisterForm from './LoginPage/Register';
import NotFoundPage from './components/NotFoundPage';

<<<<<<< HEAD
import demoTheme from "./components/Theme";
import Footer from "./components/Footer";
import { NAVIGATION } from "./components/Navbar";

import SV from "./assets/SV.webp";

import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
} from "@toolpad/core/Account";

import { AppProvider, DashboardLayout, PageContainer } from "@toolpad/core";
import StudentSearchExporttest from "./Showsrocetest";
import CrudCreate from "./test/regis";
import NotFoundPage from "./components/Notfoundpage";
import Cacklogin from "./components/cacklogin";
import StudentProfile from "./loginpage/profire";

// Lazy loaded pages
const RegisterForm = React.lazy(() => import("./loginpage/Register"));
const LoginRegister = React.lazy(() => import("./loginpage/Loginsheet"));
const SheetManagerC = React.lazy(() => import("./SheetManagerC"));
const StudentSearchExport = React.lazy(() => import("./Showsroce"));

const Dashboard = React.lazy(() => import("./Dashboard"));
function AccountSidebarPreview(props) {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0}>
      <Divider />
      <AccountPreview
        variant={mini ? "condensed" : "expanded"}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
}

AccountSidebarPreview.propTypes = {
  handleClick: PropTypes.func,
  mini: PropTypes.bool.isRequired,
  open: PropTypes.bool,
};

const accounts = [];

function SidebarFooterAccountPopover() {
  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Accounts
      </Typography>
      <MenuList>
        {accounts.map((account) => (
          <MenuItem
            key={account.id}
            component="button"
            sx={{ justifyContent: "flex-start", width: "100%", columnGap: 2 }}
          >
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.95rem",
                  bgcolor: account.color,
                }}
                src={account.image ?? ""}
                alt={account.name ?? ""}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </MenuItem>
        ))}
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
}

const createPreviewComponent = (mini) => {
  function PreviewComponent(props) {
    return <AccountSidebarPreview {...props} mini={mini} />;
=======
// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const user = localStorage.getItem("user_sheet");
  
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
>>>>>>> de2091fa5492ea72c1cbb63f8ba08a6e9c567383
  }
  
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontFamily: 'NotoSansLaoLooped, sans-serif',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
<<<<<<< HEAD
          <Route path="/" element={<Dashboard />} />
          <Route path="/score" element={<StudentSearchExport />} />
          <Route path="/scores" element={<StudentSearchExporttest />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/credit-recovery" element={<SheetManagerC />} />
          <Route path="/register" element={<RegisterForm />} />

          // For single route protection (your current usage)
<Route
  path="/profire"
  element={<Cacklogin element={<StudentProfile />} />}
/>

// For nested routes (your admin routes)
<Route path="/admin/*" element={<Cacklogin />}>
  <Route path="people" element={<CrudCreate />} />
  <Route path="cc" element={<div>CC Page</div>} />
  <Route path="*" element={<NotFoundPage message="404: admin sub-page not found" />} />
</Route>

          {/* ✅ จับทุก route ที่ไม่มี match ด้านบน */}
          <Route
            path="*"
            element={<NotFoundPage message="404: page not found" />}
=======
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute requireAuth={false}>
                <RegisterForm />
              </ProtectedRoute>
            } 
>>>>>>> de2091fa5492ea72c1cbb63f8ba08a6e9c567383
          />
          
          {/* Protected routes with layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/score" element={
            <ProtectedRoute>
              <Layout>
                <StudentSearchExport />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/credit-recovery" element={
            <ProtectedRoute>
              <Layout>
                <SheetManagerC />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;