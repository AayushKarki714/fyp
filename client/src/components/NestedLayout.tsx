import React, { useState, useRef } from "react";
import { Outlet } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import SideNavLink from "./SideNavLink";
import {
  PhotoIcon,
  ChartBarIcon,
  // Squares2X2Icon,
  SquaresPlusIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  WrenchScrewdriverIcon,
  // Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";

function NestedLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  const asideVariants: Variants = {
    initial: {
      width: isSideBarOpen ? "16rem" : "4.5rem",
    },
    animate: {
      width: isSideBarOpen ? "4.5rem" : "16rem",
      transition: {
        type: "tween",
      },
    },
  };

  return (
    <React.Fragment>
      <AnimatePresence initial={false}>
        <motion.aside
          initial={"initial"}
          animate={"animate"}
          variants={asideVariants}
          className="flex-shrink-0 bg-[#27292a]"
        >
          <div className="flex flex-col gap-2 py-8">
            <SideNavLink
              url="/dashboard"
              Icon={SquaresPlusIcon}
              isOpen={isSideBarOpen}
            >
              Dashboard
            </SideNavLink>
            <SideNavLink
              url="/chat"
              Icon={ChatBubbleLeftIcon}
              isOpen={isSideBarOpen}
            >
              Chat
            </SideNavLink>
            <SideNavLink
              url="/todo"
              Icon={PencilSquareIcon}
              isOpen={isSideBarOpen}
            >
              Todo
            </SideNavLink>
            <SideNavLink url="/gallery" Icon={PhotoIcon} isOpen={isSideBarOpen}>
              Gallery
            </SideNavLink>
            <SideNavLink
              url="/progress"
              Icon={ChartBarIcon}
              isOpen={isSideBarOpen}
            >
              Progress
            </SideNavLink>
            <SideNavLink
              url="/setting"
              Icon={WrenchScrewdriverIcon}
              isOpen={isSideBarOpen}
            >
              Setting
            </SideNavLink>
          </div>
        </motion.aside>
      </AnimatePresence>
      <div className="flex items-center flex-shrink-0 w-6 group">
        <button
          className="hidden w-2 h-10 rounded-full ml-2 bg-[#333] hover:bg-gray-300 group-hover:block"
          onClick={() => {
            setIsSideBarOpen(!isSideBarOpen);
          }}
        ></button>
      </div>
      {/* 100vh - 10vh where 10vh is the height of the NavBar */}
      <div
        className="custom-scrollbar bg-[#18191a] flex-grow h-[90vh] px-4 pt-16 pb-6  text-4xl overflow-y-auto
      "
      >
        <Outlet />
      </div>
    </React.Fragment>
  );
}

export default NestedLayout;
