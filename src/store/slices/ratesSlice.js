import { createSlice } from "@reduxjs/toolkit";
import { ratesController } from "../../backend/controllers/Rates.controller";
import { createServiceThunk } from "@/utils/createServiceThunk";



export const fetchRates = createServiceThunk("rates/fetchAll", () =>
  ratesController.getAll(),
);

export const createRate = createServiceThunk("rates/create", (payload) =>
  ratesController.create(payload),
);

export const updateRate = createServiceThunk(
  "rates/update",
  ({ id, payload }) => ratesController.update(id, payload),
);

export const toggleRateActive = createServiceThunk("rates/toggleActive", (id) =>
  ratesController.toggleActive(id),
);

export const deleteRate = createServiceThunk("rates/delete", (id) =>
  ratesController.delete(id),
);



function sortRates(items) {
  return [...items].sort((a, b) =>
    `${a.from_currency}${a.to_currency}`.localeCompare(
      `${b.from_currency}${b.to_currency}`,
    ),
  );
}

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  saving: false,
  deleting: false,
};

const ratesSlice = createSlice({
  name: "rates",
  initialState,
  reducers: {
    clearRatesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchRates.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message ?? "Error loading rates";
      })

      // create
      .addCase(createRate.pending, (state) => {
        state.saving = true;
      })
      .addCase(createRate.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload)
          state.items = sortRates([...state.items, action.payload]);
      })
      .addCase(createRate.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error creating rate";
      })

      // update
      .addCase(updateRate.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateRate.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const idx = state.items.findIndex((r) => r.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
          state.items = sortRates(state.items);
        }
      })
      .addCase(updateRate.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message ?? "Error updating rate";
      })

      // toggleActive (actualización optimista simple: reemplaza con la respuesta real)
      .addCase(toggleRateActive.fulfilled, (state, action) => {
        if (action.payload) {
          const idx = state.items.findIndex((r) => r.id === action.payload.id);
          if (idx !== -1) state.items[idx] = action.payload;
        }
      })
      .addCase(toggleRateActive.rejected, (state, action) => {
        state.error = action.payload?.message ?? "Error toggling rate";
      })

      // delete
      .addCase(deleteRate.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteRate.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((r) => r.id !== action.meta.arg);
      })
      .addCase(deleteRate.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message ?? "Error deleting rate";
      });
  },
});

export const { clearRatesError } = ratesSlice.actions;
export default ratesSlice.reducer;
