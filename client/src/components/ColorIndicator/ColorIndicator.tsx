import ColorBox from "./ColorBox";
import { motion } from "framer-motion";

interface Props {
  onMouseEnter: (event: React.MouseEvent) => any;
  onMouseLeave: (event: React.MouseEvent) => any;
}

const ColorIndicator: React.FC<Props> = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 1 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="absolute w-96  right-3 top-10 grid grid-cols-2 gap-2  p-3 bg-custom-light-dark rounded-md  origin-top-right "
    >
      <div className="absolute right-0 -top-3 right-angled-triangle bg-custom-light-dark w-5 h-5"></div>
      <ColorBox color="bg-blue-600">More than 15 day</ColorBox>
      <ColorBox color="bg-purple-600">Between 10 and 15 day</ColorBox>
      <ColorBox color="bg-yellow-600">Between 5 and 10 day</ColorBox>
      <ColorBox color="bg-orange-600">Between 1 and 5 day</ColorBox>
      <ColorBox color="bg-red-600">No days</ColorBox>
      <ColorBox color="bg-green-600">Completed</ColorBox>
    </motion.div>
  );
};

export default ColorIndicator;
