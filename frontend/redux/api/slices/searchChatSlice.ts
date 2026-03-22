import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SearchChatState {
  searchText: string
}

const initialState: SearchChatState = {
  searchText: ""
}

export const searchChatSlice = createSlice({
  name: "searchChatSlice",
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    }
  }
})

export const { setSearchText } = searchChatSlice.actions;
export default searchChatSlice.reducer;