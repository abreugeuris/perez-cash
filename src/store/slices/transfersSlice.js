import { createSlice } from "@reduxjs/toolkit";
import { transfersController } from "../../backend/controllers/Transfers.controller.js";
import { createServiceThunk } from "@/utils/createServiceThunk";

export const fetchTransfers = createServiceThunk(
  "transfers/fetchAll",
  (filters) => transfersController.getAll(filters),
);

export const createTransfer = createServiceThunk(
  "transfers/create",
  (payload) => transfersController.create(payload),
);

export const fetchTransferReceipt = createServiceThunk(
  "transfers/fetchReceipt",
  (id) => transfersController.getReceipt(id),
);

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  saving: false,
  lastCreated: null,
  // recibo actualmente visible en la página standalone Receipt.jsx
  receipt: null,
  receiptStatus: "idle",
  receiptError: null,
};

const transfersSlice = createSlice({
  name: "transfers",
  initialState,
  reducers: {
    clearTransfersError(state) {
      state.error = null;
    },
    clearReceipt(state) {
      state.receipt = null;
      state.receiptStatus = "idle";
      state.receiptError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll (Historial)
      .addCase(fetchTransfers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransfers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTransfers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Error loading transfers";
      })

      // create (Nuevo Envío)
      .addCase(createTransfer.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.saving = false;
        state.lastCreated = action.payload;
        // No lo insertamos en items aquí: items usa el shape "join"
        // de get_transfers (con sender_name/beneficiary_name), y
        // create_transfer devuelve el shape crudo de la tabla. Si el
        // usuario visita Historial después, fetchTransfers ya trae
        // el envío nuevo con el shape correcto.
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error creating transfer";
      })

      // receipt (página standalone /envios/:id/recibo)
      .addCase(fetchTransferReceipt.pending, (state) => {
        state.receiptStatus = "loading";
        state.receiptError = null;
      })
      .addCase(fetchTransferReceipt.fulfilled, (state, action) => {
        state.receiptStatus = "succeeded";
        state.receipt = action.payload;
      })
      .addCase(fetchTransferReceipt.rejected, (state, action) => {
        state.receiptStatus = "failed";
        state.receiptError = action.payload?.message ?? "Error loading receipt";
      });
  },
});

export const { clearTransfersError, clearReceipt } = transfersSlice.actions;
export default transfersSlice.reducer;
