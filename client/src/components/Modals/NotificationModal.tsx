import React from "react";
import { motion } from "framer-motion";
import handleStopPropagation from "../../utils/handleStopPropagation";

const NotificationModal: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={handleStopPropagation}
      className="fixed h-[85vh] top-14 right-20 w-[360px] bg-custom-light-dark border-2 border-dark-gray shadow-md rounded-md p-2 text-2xl z-10 origin-top-right"
    >
      <h2>Notifications</h2>
    </motion.div>
  );
};

export default NotificationModal;
