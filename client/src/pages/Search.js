import React from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../context/search";
import { Link } from "react-router-dom";

const Search = () => {
  const [value] = useSearch();

  return (
    <Layout title={"Search Results"}>
      <div className="container py-4">
        {/* Results Count */}
        <div className="mb-4 text-center">
          <h4>
            {value?.results?.length > 0
              ? `Found ${value.results.length} product(s)`
              : "No products found"}
          </h4>
        </div>

        {/* Products Grid */}
        <div className="row">
          {value?.results && value.results.length > 0 ? (
            value.results.map((p) => (
              <div key={p._id} className="col-xl-4 col-md-6 mb-4">
                <div className="card h-100 shadow-sm border-0 product-card">
                  <div className="position-relative">
                    {/* Product Image */}
                    <div
                      className="card-img-top d-flex justify-content-center align-items-center overflow-hidden"
                      style={{ height: "250px", backgroundColor: "#f8f9fa" }}
                    >
                      <img
                        src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                        alt={p.name}
                        className="img-fluid product-image"
                        style={{
                          maxHeight: "230px",
                          width: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                          const fallback = document.createElement("div");
                          fallback.className =
                            "text-muted text-center py-4 w-100";
                          fallback.innerHTML = `
                            <i class="fas fa-image fa-3x mb-2 opacity-50"></i>
                            <p class="mb-0">Image not available</p>
                          `;
                          e.target.parentElement.appendChild(fallback);
                        }}
                      />
                    </div>

                    {/* Stock Badge */}
                    <div className="position-absolute top-0 end-0 m-2">
                      <span
                        className={`badge ${
                          p.quantity > 0 ? "bg-success" : "bg-danger"
                        }`}
                      >
                        <i
                          className={`fas ${
                            p.quantity > 0 ? "fa-check" : "fa-times"
                          } me-1`}
                        ></i>
                        {p.quantity > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    {/* Category Badge */}
                    {p.category?.name && (
                      <div className="position-absolute top-0 start-0 m-2">
                        <span className="badge bg-info">{p.category.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark mb-2">
                      {p.name}
                    </h5>
                    <p
                      className="card-text text-muted flex-grow-1"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {p.description?.substring(0, 80)}
                      {p.description?.length > 80 && "..."}
                    </p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <h4 className="text-success fw-bold mb-0">${p.price}</h4>
                        <small className="text-muted">Best Price</small>
                      </div>

                      <div className="d-flex gap-2">
                        <Link
                          to={`/product/${p.slug}`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          <i className="fas fa-eye me-1"></i>
                          View
                        </Link>
                        <button
                          className="btn btn-primary btn-sm px-3"
                          disabled={p.quantity === 0}
                        >
                          <i className="fas fa-cart-plus me-1"></i>
                          {p.quantity > 0 ? "Add to Cart" : "Sold Out"}
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="mt-3 pt-3 border-top">
                      <div className="row text-center">
                        <div className="col-6">
                          <small className="text-muted d-block">Category</small>
                          <small className="fw-bold">
                            {p.category?.name || "General"}
                          </small>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Stock</small>
                          <small
                            className={`fw-bold ${
                              p.quantity > 0 ? "text-success" : "text-danger"
                            }`}
                          >
                            {p.quantity || 0} left
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No products found</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Search;
