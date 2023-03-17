import { createContext, useState, useContext } from "react";

interface Iadmin {
  id: string;
  username: string;
}

interface IAdminContext {
  admin: Iadmin | null;
  setAdmin: React.Dispatch<React.SetStateAction<Iadmin | null>>;
  isSystemAdminLoggedIn: () => boolean;
}

const AdminContext = createContext<IAdminContext | null>(null);

function AdminContextProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Iadmin | null>(null);

  function isSystemAdminLoggedIn() {
    return Boolean(admin);
  }

  const value = { admin, setAdmin, isSystemAdminLoggedIn };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

function useSystemAdmin() {
  const context = useContext(AdminContext);
  if (!context)
    throw new Error(
      "useSystemAdmin can only be used within <AdminContextProvider/>"
    );
  return context;
}

export { useSystemAdmin };
export default AdminContextProvider;
