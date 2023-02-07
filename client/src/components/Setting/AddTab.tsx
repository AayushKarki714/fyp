import React from "react";
import { Role } from "../../redux/slices/workspaceSlice";
import AddUser from "./AddUser";

interface Props {}

const AddTab: React.FC<Props> = () => {
  return (
    <div className="text-base flex gap-12">
      <AddUser role={Role.LANCER} type="Lancer" />
      <AddUser role={Role.CLIENT} type="Client" />
    </div>
  );
};

export default AddTab;
