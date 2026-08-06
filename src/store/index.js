import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import beneficiariesReducer from "./slices/beneficiariesSlice";
import sendersReducer from "./slices/sendersSlice";
import ratesReducer from "./slices/ratesSlice";
import { authInterceptor } from "../middleware/authInterceptor";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    senders: sendersReducer,
    rates: ratesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authInterceptor),
});
