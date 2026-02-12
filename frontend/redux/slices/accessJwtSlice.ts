import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface AccessJwtSlice {
    accessJwt: string | null,
    expiresIn: number | null
}

const initialState: AccessJwtSlice = {
    accessJwt: null,
    expiresIn: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessJwtState: (_state, action: PayloadAction<AccessJwtSlice>) => {
            return action.payload;
        }
    }
})

export const {setAccessJwtState} = authSlice.actions;
export default authSlice.reducer;