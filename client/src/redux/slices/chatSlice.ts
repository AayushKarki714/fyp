import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ChatType from "../../utils/ChatTab";

interface ChatState {
  id: string | null;
  type: ChatType | null;
}

const initialState: ChatState = {
  id: null,
  type: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    switchChat: (state, action: PayloadAction<ChatState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { switchChat } = chatSlice.actions;
export default chatSlice.reducer;
