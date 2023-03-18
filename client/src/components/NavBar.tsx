import React, { useState, useRef, RefObject } from "react";
import { Link } from "react-router-dom";
import { BellIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../redux/store/hooks";
import { motion } from "framer-motion";
import useOnClickOutside from "../hooks/useOnClickOutside";
import UserModal from "./Modals/UserModal";
import NotificationModal from "./Modals/NotificationModal";
import { useQuery } from "react-query";
import axios from "../api/axios";

const NavBar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [showUserDetails, setShowUserDetail] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef(null) as RefObject<HTMLDivElement>;
  const notificationsRef = useRef(null) as RefObject<HTMLDivElement>;

  const unReadNotificationQuery = useQuery("unread-notifications", async () => {
    const res = await axios.get(
      `/notification/${user.id}/get-unread-notifications-count`
    );
    return res.data;
  });

  useOnClickOutside(profileRef, () => setShowUserDetail(false));
  useOnClickOutside(notificationsRef, () => setIsNotificationsOpen(false));
  const unreadNotificationCount = unReadNotificationQuery?.data?.data;

  return (
    <nav
      className="relative h-[10vh] px-6 py-8 flex items-center justify-between
    bg-[#27292a] border-b-4 border-[#333]
    "
    >
      <h1 className="text-xl md:text-2xl">
        {" "}
        <Link to="/dashboard">ProjectZone</Link>{" "}
      </h1>
      <div className="flex items-center gap-4">
        <div ref={notificationsRef}>
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative flex items-center justify-center w-10 h-10 cursor-pointer bg-[#333] select-none rounded-full"
          >
            <div className=" w-5 h-5 flex items-center justify-center text-xs absolute top-[01px] right-[2px] bg-red-600 rounded-full">
              {unreadNotificationCount}
            </div>
            <BellIcon className="h-5 w-5 text-white" />
          </motion.div>
          {isNotificationsOpen && <NotificationModal />}
        </div>
        <motion.div
          ref={profileRef}
          className="relative flex items-center rounded-full"
          onClick={() => setShowUserDetail(!showUserDetails)}
        >
          <img
            className="w-10 h-10 cursor-pointer rounded-full"
            src={user?.photo}
            alt="User Profile"
            referrerPolicy="no-referrer"
          />{" "}
          {showUserDetails && <UserModal user={user} />}{" "}
        </motion.div>{" "}
      </div>{" "}
    </nav>
  );
};
export default NavBar;
