import { ShoutData } from "@/components/Shout";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ShoutsSlice {
  shouts: ShoutData[];
}

const initialState: ShoutsSlice = {
  shouts: [
    {
      accImg: '/acc.png',
      name: 'Fabrizio Roman',
      hasBadge: true,
      username: 'Fabrizio14',
      createdAt: "1 std.",
      desc: "Mein erster Beitrag was looooooo Mein erster Beitrag was looooooo Mein erster Beitrag was looooooo",
      shoutImg: '/stadion.jpg',
      comments: 1000,
      reShouts: 500,
      likes: 10000
    },
    {
      accImg: '/acc.png',
      name: 'Fabrizio',
      hasBadge: true,
      username: 'Fabrizio14',
      createdAt: "1 std.",
      desc: "Mein erster Beitrag was looooooo\nMein erster Beitrag was looooooo\nMein erster Beitrag was looooooo",
      shoutImg: '/stadion.jpg',
      comments: 1000,
      reShouts: 500,
      likes: 10000
    }
  ]
};

const shoutsSlice = createSlice({
  name: "shouts",
  initialState,
  reducers: {
    addShout: (state, action: PayloadAction<ShoutData>) => {
      state.shouts.unshift(action.payload);
    }
  }
});

export const {addShout} = shoutsSlice.actions;
export default shoutsSlice.reducer;
