import { Link, useLocation } from "react-router-dom";
import { motion, Variants } from "framer-motion";

interface Props {
  children: React.ReactNode;
  url: string;
  isOpen: boolean;
  Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
}

const SideNavLink: React.FC<Props> = function ({
  children,
  url,
  Icon,
  isOpen,
}) {
  const location = useLocation();
  const activeLink = location.pathname === url;

  const variant: Variants = {
    initial: {
      opacity: isOpen ? 1 : 0,
    },
    animate: {
      opacity: isOpen ? 0 : 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <button className={`${activeLink ? "bg-[#434343]" : ""} overflow-hidden`}>
      <Link className="flex gap-2 items-center px-6 py-3" to={url}>
        <Icon className="h-5 flex-shrink-0" />
        <motion.p variants={variant}>{children}</motion.p>
      </Link>
    </button>
  );
};

export default SideNavLink;
