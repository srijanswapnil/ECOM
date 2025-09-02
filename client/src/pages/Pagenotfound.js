import React from "react";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout/Layout";

const Pagenotfound = () => {
  return (
    <Layout>
      <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-3">Oops! Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
        <NavLink to="/" className="btn btn-warning px-4">
          Back to Home
        </NavLink>
      </div>
    </Layout>
  );
};

export default Pagenotfound;
