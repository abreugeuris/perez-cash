import toast from "react-hot-toast";
import { forceLogout } from "../store/slices/authSlice";

// Patrones típicos de error de sesión que devuelve Supabase.
const SESSION_ERROR_PATTERNS = [
  "jwt expired",
  "invalid jwt",
  "invalid refresh token",
  "refresh token not found",
  "not authenticated",
];

function isSessionError(payload) {
  if (!payload) return false;
  const message = (payload.message || "").toLowerCase();
  return (
    payload.status === 401 ||
    SESSION_ERROR_PATTERNS.some((p) => message.includes(p))
  );
}

export const authInterceptor = (store) => (next) => (action) => {
  const isRejected =
    typeof action.type === "string" && action.type.endsWith("/rejected");

  // El propio intento de login fallido no debe disparar un forceLogout
  // (no hay sesión que cerrar, y el propio form ya muestra el error).
  if (
    isRejected &&
    action.type !== "auth/login/rejected" &&
    isSessionError(action.payload)
  ) {
    store.dispatch(forceLogout());
    toast.error("Tu sesión expiró. Inicia sesión de nuevo.");
  }

  return next(action);
};
