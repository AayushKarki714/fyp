import React from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  isLoading: boolean;
}

const Spinner: React.FC<Props> = ({ isLoading }) => {
  return (
    <ClipLoader
      color={"#8ad85c"}
      loading={isLoading}
      cssOverride={{
        width: "40px",
        height: "40px",
        position: "fixed",
        top: "50%",
        left: "50%",
      }}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Spinner;
