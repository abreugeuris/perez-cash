import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import beneficiariesReducer from "./slices/beneficiariesSlice.js";
import sendersReducer from "./slices/sendersSlice.js";
import ratesReducer from "./slices/ratesSlice.js";
import transfersReducer from "./slices/transfersSlice.js";
import { authInterceptor } from "../middleware/authInterceptor.js";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    beneficiaries: beneficiariesReducer,
    senders: sendersReducer,
    rates: ratesReducer,
    transfers: transfersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authInterceptor),
});
