import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface AuthSlice {
    username: string | null,
    accessJwt: string | null,
    accessTokenExpiresIn: number | null
}

const initialState: AuthSlice = {
    username: null,
    accessJwt: null,
    accessTokenExpiresIn: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthState: (_state, action: PayloadAction<AuthSlice>) => {
            return action.payload;
        }
    }
})

export const {setAuthState} = authSlice.actions;
export default authSlice.reducer;