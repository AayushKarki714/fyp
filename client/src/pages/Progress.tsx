import React, { useState } from "react";
import useNavigateToDashboard from "../hooks/useNavigateToDashboard";
import "react-toastify/dist/ReactToastify.css";
import GeneratedProgress from "../components/Progress/GeneratedProgress";
import ManualProgress from "../components/Progress/ManualProgress";

enum Tab {
  MANUAL = "MANUAL",
  GENERATED = "GENERATED",
}

interface TabbedButtonProps {
  tabType: Tab;
  setSelectedTab: any;
  children: React.ReactNode;
  selectedTab: Tab;
}

const TabbedButton: React.FC<TabbedButtonProps> = ({
  children,
  selectedTab,
  tabType,
  setSelectedTab,
}) => {
  const isActive =
    selectedTab === tabType ? "text-custom-light-green" : "text-gray-400";
  return (
    <li className="mr-2" onClick={() => setSelectedTab(tabType)}>
      <button
        className={`p-4  ${isActive} bg-custom-light-dark rounded-t-lg active dark:bg-gray-800 dark:text-blue-500`}
      >
        {children}
      </button>
    </li>
  );
};

const Progress: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.GENERATED);

  useNavigateToDashboard();
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-custom-light-dark ">
        <TabbedButton
          tabType={Tab.GENERATED}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        >
          Generated
        </TabbedButton>
        <TabbedButton
          selectedTab={selectedTab}
          tabType={Tab.MANUAL}
          setSelectedTab={setSelectedTab}
        >
          Manual
        </TabbedButton>
      </ul>
      <div>
        {selectedTab === Tab.GENERATED && <GeneratedProgress />}
        {selectedTab === Tab.MANUAL && <ManualProgress />}
      </div>
    </div>
  );
};

export default Progress;
