import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface UserSlice {
  name: string,
  username: string,
  avatar: string
}

const initialState: UserSlice = {
  name: "",
  username: "",
  avatar: ""
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {

    setUser: (state, action: PayloadAction<UserSlice>) => {
      return action.payload;
    }

  }
})

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
