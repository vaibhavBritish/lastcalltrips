import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.map((u) =>
        u.id === action.payload.id ? action.payload : u
      );
    },
  },
});

export const { setUsers, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
