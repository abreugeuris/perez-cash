import { createSlice } from "@reduxjs/toolkit";
import { beneficiariesController } from "@/backend/controllers/Beneficiaries.controller";
import { createServiceThunk } from "@/utils/createServiceThunk";



export const fetchBeneficiaries = createServiceThunk(
  "beneficiaries/fetchAll",
  () => beneficiariesController.getAll(),
);

export const createBeneficiary = createServiceThunk(
  "beneficiaries/create",
  (payload) => beneficiariesController.create(payload),
);

export const updateBeneficiary = createServiceThunk(
  "beneficiaries/update",
  ({ id, payload }) => beneficiariesController.update(id, payload),
);

export const deleteBeneficiary = createServiceThunk(
  "beneficiaries/delete",
  (id) => beneficiariesController.delete(id),
);


const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  // control de operaciones puntuales (create/update/delete)
  saving: false,
  deleting: false,
};

const beneficiariesSlice = createSlice({
  name: "beneficiaries",
  initialState,
  reducers: {
    clearBeneficiariesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchBeneficiaries.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Error loading beneficiaries";
      })

      // create
      .addCase(createBeneficiary.pending, (state) => {
        state.saving = true;
      })
      .addCase(createBeneficiary.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) state.items.push(action.payload);
        // reordenar por nombre
        state.items.sort((a, b) => a.name.localeCompare(b.name));
      })
      .addCase(createBeneficiary.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error creating beneficiary";
      })

      // update
      .addCase(updateBeneficiary.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateBeneficiary.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const idx = state.items.findIndex((b) => b.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
          state.items.sort((a, b) => a.name.localeCompare(b.name));
        }
      })
      .addCase(updateBeneficiary.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error updating beneficiary";
      })

      // delete
      .addCase(deleteBeneficiary.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.deleting = false;
        // action.meta.arg es el id que se pasó al thunk
        state.items = state.items.filter((b) => b.id !== action.meta.arg);
      })
      .addCase(deleteBeneficiary.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message ?? "Error deleting beneficiary";
      });
  },
});

export const { clearBeneficiariesError } = beneficiariesSlice.actions;
export default beneficiariesSlice.reducer;
