import React from "react";
import "./Spinner.css";
import { ClipLoader } from "react-spinners";

type Props = {
  isLoading?: boolean;
};
const override = {
  borderWidth: "6px", // Increase the thickness here
};

const Spinner = ({ isLoading = true }: Props) => {
  return (
    <div id="loading-spinner">
      <ClipLoader
        color="#36d7b7"
        loading={isLoading}
        size={65}
        cssOverride={override}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;
