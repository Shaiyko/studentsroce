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

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true }) => {
  const user = localStorage.getItem("user_sheet");
  
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
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