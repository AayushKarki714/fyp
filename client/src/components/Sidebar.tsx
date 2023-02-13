import React from "react";
import { motion, Variants } from "framer-motion";
import SideNavLink from "./SideNavLink";
import {
  PhotoIcon,
  ChartBarIcon,
  SquaresPlusIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "../redux/store/hooks";

interface Props {
  isSideBarOpen: boolean;
}

const Sidebar: React.FC<Props> = ({ isSideBarOpen }) => {
  const { role } = useAppSelector((state) => state.workspace);
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
    <AnimatePresence initial={false}>
      <motion.aside
        initial={"initial"}
        animate={"animate"}
        variants={asideVariants}
        className="flex-shrink-0 bg-[#27292a]"
      >
        <div className="flex flex-col gap-2 py-4">
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
            url="/demo-progress"
            Icon={ChartBarIcon}
            isOpen={isSideBarOpen}
          >
            Demo Progress
          </SideNavLink>
          {role === "ADMIN" && (
            <SideNavLink
              url="/setting"
              Icon={WrenchScrewdriverIcon}
              isOpen={isSideBarOpen}
            >
              Setting
            </SideNavLink>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default Sidebar;
