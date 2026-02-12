import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

/**
 * Interface defining the structure of the access JWT state.
 * Contains the token and its expiration time.
 */
export interface AccessJwtSlice {
    accessJwt: string | null,
    expiresIn: number | null
}

const initialState: AccessJwtSlice = {
    accessJwt: null,
    expiresIn: null
}

/**
 * Redux slice for managing authentication state with JWT tokens.
 * Handles storing and updating access token information.
 */
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        /**
         * Sets the access JWT state with new token information.
         */
        setAccessJwtState: (_state, action: PayloadAction<AccessJwtSlice>) => {
            return action.payload;
        }
    }
})

export const {setAccessJwtState} = authSlice.actions;
export default authSlice.reducer;