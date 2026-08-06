import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import TooltipProvider from './components/TooltipProvider.jsx';
import { Toaster } from 'sonner';
import Login from './pages/auth/Login.jsx';
import Recovery from './pages/auth/Recovery.jsx';
import Register from './pages/auth/Regiter.jsx';
import Beneficiaries  from './pages/Beneficiaries.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Senders from './pages/Senders.jsx';
import Rates from './pages/Rates.jsx';
import ShipmentsHistory from './pages/shipments/ShipmentsHistory.jsx';
import NewShipment from './pages/shipments/NewShipments.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { restoreSession, watchSession } from './store/slices/authSlice.js';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Rehidratar Redux desde la sesión guardada en localStorage.
    dispatch(restoreSession())

    // 2. Suscribirse a cambios de sesión en tiempo real:
    //    - TOKEN_REFRESHED → actualiza el token en el store
    //    - SIGNED_OUT      → forceLogout → ProtectedRoute redirige al login
    const unsubscribe = dispatch(watchSession())

    // Cancelar la suscripción al desmontar la app
    return () => unsubscribe()
  }, [dispatch]);

  return (
    <TooltipProvider>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/recovery" element={<Recovery />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Rutas protegidas — cualquier staff logueado */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/remitentes" element={<Senders />} />
          <Route path="/beneficiarios" element={<Beneficiaries />} />
          <Route path="/envios/historial" element={<ShipmentsHistory />} />
          <Route path="/envios/nuevo" element={<NewShipment />} />
          <Route path="/envios/:envioId/recibo" element={<p>Recibo</p>} />

          {/* Rutas exclusivas del owner */}
          <Route element={<ProtectedRoute allowedRoles={['owner']}><Outlet /></ProtectedRoute>}>
            <Route path="/tasas" element={<Rates />} />
            {/* <Route path="/cajeros" element={<CashierManagement />} /> */}
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}