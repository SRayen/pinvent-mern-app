import React from "react";
import loaderImg from "../../assets/loader.gif";
import ReactDOM from "react-dom";
import "./Loader.scss";

/* portals are useful when you need to render content in a different part of the DOM hierarchy, such as overlaying elements,
 modals, or in this case, rendering a loading spinner in a specific location. look=> index.js*/
const Loader = () => {
  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={loaderImg} alt="Loading ..." />
      </div>
    </div>,
    document.getElementById("loader")
  );
};

export const SpinnerImg = () => {
  return (
    <div className="--center-all">
      <img src={loaderImg} alt="Loading ..." />
    </div>
  );
};

export default Loader;
