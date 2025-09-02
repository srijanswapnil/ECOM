import React from "react";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container text-center">
        <p className="mb-2">© {new Date().getFullYear()} ECOM. All rights reserved.</p>

        <div className="mb-2">
          <NavLink to="/" className="text-light text-decoration-none mx-2">
            Home
          </NavLink>
          <NavLink to="/category" className="text-light text-decoration-none mx-2">
            Category
          </NavLink>
          <NavLink to="/contact" className="text-light text-decoration-none mx-2">
            Contact
          </NavLink>
        </div>

        <div>
          <a href="#" className="text-light mx-2">
            <FaFacebook />
          </a>
          <a href="#" className="text-light mx-2">
            <FaInstagram />
          </a>
          <a href="#" className="text-light mx-2">
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
