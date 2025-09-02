import React from "react";
import Layout from "../components/Layout/Layout";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const Contact = () => {
  return (
    <Layout>
      <div className="container py-5">
        <h1 className="text-center mb-4">Contact Us</h1>
        <p className="text-center text-muted mb-5">
          We’re here to help! Reach out to us through the following contact details.
        </p>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-sm border-0 p-4 text-center">
              <div className="mb-3">
                <FaEnvelope className="text-warning fs-2" />
                <h5 className="mt-2">Email</h5>
                <p className="text-muted mb-0">support@ecom.com</p>
              </div>
              <hr />
              <div className="mt-3">
                <FaPhone className="text-warning fs-2" />
                <h5 className="mt-2">Phone</h5>
                <p className="text-muted mb-0">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
