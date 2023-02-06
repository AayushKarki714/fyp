import { motion } from "framer-motion";
import Tab from "../../utils/Tab";

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
    <li
      onClick={onSelectTab}
      className="px-8 py-2 cursor-pointer relative hover:text-custom-light-green "
    >
      <div className="flex items-center gap-2 text-2xl ">{children}</div>
      {isSelectedTab ? (
        <motion.div
          className="absolute left-0 right-0 h-[2px] -bottom-[2px]  bg-custom-light-green"
          layoutId="underline"
        />
      ) : null}
    </li>
  );
};

export default SettingNavLink;
