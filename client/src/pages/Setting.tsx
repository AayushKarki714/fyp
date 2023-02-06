import React, { useState } from "react";
import Tab from "../utils/Tab";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import { motion } from "framer-motion";

interface SettingNavLinkProps {
  tab: Tab;
  selectedTab: Tab;
  children: React.ReactNode;
  onSelectTab: () => void;
}

const SettingNavLink: React.FC<SettingNavLinkProps> = ({
  tab,
  onSelectTab,
  selectedTab,
  children,
}) => {
  const isSelectedTab = tab === selectedTab;
  return (
    <li onClick={onSelectTab}>
      {children}
      {isSelectedTab ? (
        <motion.div className="underline" layoutId="underline" />
      ) : null}
    </li>
  );
};

const Setting = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.ADD);

  const handleSelectTab = (tab: Tab) => {
    setSelectedTab(tab);
  };

  useNavigateToDashboard();

  return (
    <div>
      <nav>
        <ul className="flex">
          <SettingNavLink
            tab={Tab.ADD}
            selectedTab={selectedTab}
            onSelectTab={handleSelectTab.bind(null, Tab.ADD)}
          >
            Hello{" "}
          </SettingNavLink>
          <SettingNavLink
            tab={Tab.REMOVE}
            selectedTab={selectedTab}
            onSelectTab={handleSelectTab.bind(null, Tab.REMOVE)}
          >
            Nice
          </SettingNavLink>
          <SettingNavLink
            tab={Tab.ASSIGN}
            selectedTab={selectedTab}
            onSelectTab={handleSelectTab.bind(null, Tab.ASSIGN)}
          >
            Ola
          </SettingNavLink>
        </ul>
      </nav>
    </div>
  );
};

export default Setting;
