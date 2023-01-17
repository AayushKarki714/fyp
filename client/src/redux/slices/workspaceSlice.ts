import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum Role {
  ADMIN = "ADMIN",
  LANCER = "LANCER",
  CLIENT = "CLIENT",
}
interface WorkspaceState {
  workspaceId: string;
  role: Role;
}

const initialState: WorkspaceState = {
  workspaceId: "",
  role: Role.CLIENT,
};

export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    switchWorkSpace: (state, action: PayloadAction<WorkspaceState>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { switchWorkSpace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
