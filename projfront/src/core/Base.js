import React from "react";
import Menu from "./Menu";

const Base = ({
  title = "My Title",
  description = "Description goes here",
  className = "bg-dark text-white p-2",
  children,
}) => (
  <div>
    <Menu />
    <div className="container-fluid">
      <div className="bg-dark text-white text-center py-4">
        <h2 className="display-4">{title}</h2>
        <p className="lead">{description}</p>
      </div>
      <div className={className}>{children}</div>
    </div>
    <footer className="footer bg-dark mt-auto py-3">
      <div className="container-fluid bg-primary text-white text-center py-3">
        <h4>If you have any questions, fell free to reach us!</h4>
        <button className="btn btn-warning btn-lg ">Contact Us</button>
      </div>
      <div className="container">
        <span className="text-muted">
          Made with &#10084; by{" "}
          <span className="text-white">Bunish Sachdeva</span>
        </span>
      </div>
    </footer>
  </div>
);

export default Base;
