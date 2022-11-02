import React, { useState, useRef, RefObject } from "react";
import { Link } from "react-router-dom";
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import axios from "../api/axios";
import { updateUser } from "../redux/slices/authSlice";
import { useAppSelector, useAppDispatch } from "../redux/store/hooks";
import { motion } from "framer-motion";
import useOnClickOutside from "../hooks/useOnClickOutside";

interface IUserModal {
  user: any;
}

const UserModal = React.forwardRef<HTMLDivElement, IUserModal>(
  ({ user }, ref) => {
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
      await axios.get("/auth/logout");
      dispatch(updateUser(null));
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        ref={ref}
        className="absolute right-12 top-14 w-52 flex flex-col gap-3 p-2 rounded-md bg-[#27292a] shadow-2xl border-2 border-[#434343] origin-top-right"
      >
        <div className="flex items-center  gap-2 p-2 hover:bg-[#434343]  rounded-md">
          <UserIcon className="h-5" />
          <p>{user?.displayName}</p>
        </div>
        <div
          onClick={handleLogout}
          className="flex items-center  gap-2 p-2 hover:bg-[#434343] cursor-pointer rounded-md"
        >
          <ArrowRightOnRectangleIcon className="h-5" />
          <p>Logout</p>
        </div>
      </motion.div>
    );
  }
);

const NavBar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [showUserDetails, setShowUserDetail] = useState(false);
  const ref = useRef(null) as RefObject<HTMLDivElement>;

  useOnClickOutside(ref, () => {
    setShowUserDetail(false);
  });

  return (
    <nav
      className="relative h-[10vh] px-6 py-8 flex items-center justify-between
    bg-[#27292a] border-b-4 border-[#333]
    "
    >
      <h1 className="text-2xl">
        <Link to="/dashboard">ProjectZone</Link>
      </h1>
      <div>
        <div
          ref={ref}
          className="flex items-center cursor-pointer"
          onClick={() => setShowUserDetail(!showUserDetails)}
        >
          <img
            className="w-8 h-8 rounded-full"
            src={user?.photos[0]?.value}
            alt="User Profile"
            referrerPolicy="no-referrer"
          />
          {showUserDetails && <UserModal user={user} />}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
