import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';

import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MandiPrices from './pages/MandiPrices';
import CropCalculator from './pages/CropCalculator';
import ExpenseTracker from './pages/ExpenseTracker';
import Weather from './pages/Weather';
import CropRecommendation from './pages/CropRecommendation';
import GovernmentSchemes from './pages/GovernmentSchemes';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontFamily: 'inherit', fontSize: '14px' },
              success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
              error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
            }}
          />
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/mandi"
              element={<ProtectedRoute><MandiPrices /></ProtectedRoute>}
            />
            <Route
              path="/calculator"
              element={<ProtectedRoute><CropCalculator /></ProtectedRoute>}
            />
            <Route
              path="/expenses"
              element={<ProtectedRoute><ExpenseTracker /></ProtectedRoute>}
            />
            <Route
              path="/weather"
              element={<ProtectedRoute><Weather /></ProtectedRoute>}
            />
            <Route
              path="/recommend"
              element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>}
            />
            <Route
              path="/schemes"
              element={<ProtectedRoute><GovernmentSchemes /></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
