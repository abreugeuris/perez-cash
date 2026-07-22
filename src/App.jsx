import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout';
import TooltipProvider from './components/TooltipProvider';
import { Toaster } from 'sonner';
import Login from './pages/auth/Login';
import Recovery from './pages/auth/Recovery';
import Register from './pages/auth/Regiter';
import Recipient from './pages/Recipient';
import Dashboard from './pages/Dashboard';
import Senders from './pages/Senders';
import Rates from './pages/Rates.jsx';
import ShipmentsHistory from './pages/shipments/ShipmentsHistory.jsx';
import NewShipment from './pages/shipments/NewShipments.jsx';


// import Dashboard from '@/pages/dashboard/Dashboard';
// import Remitentes from '@/pages/dashboard/Remitentes';
// import Beneficiarios from '@/pages/dashboard/Beneficiarios';
// import Tasas from '@/pages/dashboard/Tasas';
// import NuevoEnvio from '@/pages/envios/NuevoEnvio';
// import HistorialEnvios from '@/pages/envios/HistorialEnvios';
// import Recibo from '@/pages/envios/Recibo';
// import { useAuth } from '@/hooks/useAuth';

function ProtectedRoute({ children }) {
  // const { isAuthenticated } = useAuth();
  // if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return children;
}

export default function App() {
  return (
    <TooltipProvider>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* <Route path="/" element={<Navigate to="/auth/login" replace />} />
        //  />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/recuperar" element={<Recuperar />} /> */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/recovery" element={<Recovery />} />
         <Route path="/auth/register" element={<Register />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/remitentes" element={<Senders/>} />
          <Route path="/beneficiarios" element={<Recipient />} />
          <Route path="/tasas" element={<Rates />} />
          <Route path="/envios/historial" element={<ShipmentsHistory />} />
          <Route path="/envios/nuevo" element={<NewShipment />} />
          <Route path="/envios/:envioId/recibo" element={<p>Recibo</p>} /> 
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}