import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import beneficiariesReducer from "./slices/BeneficiariesSlice";
import { authInterceptor } from "../middleware/authInterceptor";
import sendersReducer from "./slices/sendersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    senders: sendersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authInterceptor),
});
