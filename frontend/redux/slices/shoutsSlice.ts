import { ShoutData } from "@/components/Shout";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/** Shape of the shouts Redux slice state. */
export interface ShoutsSlice {
  shouts: ShoutData[];
}

/** Initial demo shouts displayed before real data is loaded from the API. */
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

/**
 * Redux slice managing the list of shouts shown in the feed.
 * `addShout` prepends a newly created shout to the top of the list.
 */
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
