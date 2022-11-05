import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WorkspaceState {
  workspaceId: string;
}

const initialState: WorkspaceState = {
  workspaceId: "32424q",
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    switchWorkSpace: (state, action: PayloadAction<any>) => {
      state.workspaceId = action.payload.workspaceId;
    },
  },
});

export const { switchWorkSpace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
