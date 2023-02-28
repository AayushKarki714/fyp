import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum Role {
  ADMIN = "ADMIN",
  LANCER = "LANCER",
  CLIENT = "CLIENT",
}
interface WorkspaceState {
  memberId: string;
  workspaceId: string;
  role: Role;
}

const initialState: WorkspaceState = {
  memberId: "",
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
export { Role };
export default workspaceSlice.reducer;
