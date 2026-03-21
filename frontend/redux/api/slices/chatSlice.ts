import { Message } from '@/types/Chat';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


export interface ChatState {
  messagesByChat: Record<string, Message[]>;
}

const initialState: ChatState = {
  messagesByChat: {}
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    
    setInitialMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      state.messagesByChat[chatId] = messages;
    },

    // The Websocket will then add the mssage to the state
    receivedMessage: (state, action: PayloadAction<Message>) => {
      const { chatId } = action.payload;
      
      // Create the new record if the messages for a chat dont exist yet
      if (!state.messagesByChat[chatId]) {
        state.messagesByChat[chatId] = [];
      }

      // Add the message
      state.messagesByChat[chatId].push(action.payload);
    },
  },
});

export const { setInitialMessages, receivedMessage } = chatSlice.actions;
export default chatSlice.reducer;