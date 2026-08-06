import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

/**
 * ProtectedRoute con el mismo patrón que ya usabas (recibe `children`),
 * ahora conectado a Redux + soporte opcional de restricción por rol.
 *
 * Uso:
 *   <ProtectedRoute><Layout /></ProtectedRoute>                  // cualquier staff logueado
 *   <ProtectedRoute allowedRoles={['owner']}><Outlet /></ProtectedRoute>  // solo owner
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, sessionChecked } = useSelector((state) => state.auth)
  const location = useLocation()

  // restoreSession todavía no resolvió — no decidir nada todavía,
  // o expulsaríamos de más a alguien con sesión válida en localStorage.
  if (!sessionChecked) {
    return null // o un spinner de pantalla completa si prefieres
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}