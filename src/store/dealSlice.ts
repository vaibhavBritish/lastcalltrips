import { createSlice } from "@reduxjs/toolkit";

interface Deal {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
  tags?: string[];
  savings?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DealState {
  deals: Deal[];
}

const initialState: DealState = {
  deals: [],
};

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    setDeals: (state, action) => {
      state.deals = action.payload;
    },
    addDeal: (state, action) => {
      state.deals.push(action.payload);
    },
    updateDeal: (state, action) => {
      const index = state.deals.findIndex(deal => deal.id === action.payload.id);
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    deleteDeal: (state, action) => {
      state.deals = state.deals.filter(deal => deal.id !== action.payload);
    },
  },
});

export const { setDeals, addDeal, updateDeal, deleteDeal } = dealsSlice.actions;
export default dealsSlice.reducer;
