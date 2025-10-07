import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User interface
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isSubscribed?: boolean;
}

// State interface
interface UserState {
  user: User | null; // Logged-in user
  users: User[];     // List of all users (admin management)
}

// Initial state
const initialState: UserState = {
  user: null,
  users: [],
};

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }

      if (state.user) {
        state.users = state.users.map((u) =>
          u.id === state.user!.id ? { ...u, ...action.payload } : u
        );
      }
    },
    // Logout
    logoutUser: (state) => {
      state.user = null;
    },
  
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u.id !== action.payload);
      if (state.user?.id === action.payload) {
        state.user = null;
      }
    },

    updateUserInList: (state, action: PayloadAction<User>) => {
      state.users = state.users.map((u) =>
        u.id === action.payload.id ? action.payload : u
      );
     
      if (state.user?.id === action.payload.id) {
        state.user = action.payload;
      }
    },
  },
});

export const {
  setUser,
  updateUser,
  logoutUser,
  setUsers,
  deleteUser,
  updateUserInList,
} = userSlice.actions;

export default userSlice.reducer;
