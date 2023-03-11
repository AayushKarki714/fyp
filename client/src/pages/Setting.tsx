import React, { useState } from "react";
import Tab from "../utils/Tab";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import SettingNavLink from "../components/Setting/SettingNavLink";
import {
  EyeDropperIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import AddTab from "../components/Setting/AddTab";
import RemoveTab from "../components/Setting/RemoveTab";
import AssignTab from "../components/Setting/AssignTab";

const Setting = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.ADD);

  const handleSelectTab = (tab: Tab) => {
    setSelectedTab(tab);
  };

  useNavigateToDashboard();

  return (
    <div className="flex flex-col gap-6 ">
      <nav>
        <ul className="flex border-b-2 border-custom-light-dark">
          <SettingNavLink
            tab={Tab.ADD}
            selectedTab={selectedTab}
            onSelectTab={handleSelectTab.bind(null, Tab.ADD)}
          >
            <span>
              <UserPlusIcon className="h-6 w-6" />
            </span>
            Add
          </SettingNavLink>
          <SettingNavLink
            tab={Tab.REMOVE}
            selectedTab={selectedTab}
            onSelectTab={handleSelectTab.bind(null, Tab.REMOVE)}
          >
            <span>
              <UserMinusIcon className="h-6 w-6" />
            </span>
            Remove
          </SettingNavLink>
          <SettingNavLink
            tab={Tab.ASSIGN}
            selectedTab={selectedTab}
            onSelectTab={handleSelectTab.bind(null, Tab.ASSIGN)}
          >
            <span>
              <EyeDropperIcon className="h-6 w-6" />
            </span>
            Assign
          </SettingNavLink>
        </ul>
      </nav>
      <div>
        {selectedTab === Tab.ADD && <AddTab />}
        {selectedTab === Tab.REMOVE && <RemoveTab />}
        {selectedTab === Tab.ASSIGN && <AssignTab />}
      </div>
    </div>
  );
};

export default Setting;
