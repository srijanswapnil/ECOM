import React, { useEffect, useState, useMemo } from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [total, setTotal] = useState(0);
  const [cart, setCart] = useCart();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name"); // name, price-low, price-high

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`
      );

      if (data?.success) {
        if (page === 1) {
          // First page → replace products
          setProducts(data.products);
        } else {
          // Next pages → append products
          setProducts((prev) => [...prev, ...data.products]);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-category`
      );
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in category");
    }
  };

  useEffect(() => {
    getAllProducts();
    if (page === 1) {
      getAllCategory();
    }
  }, [page]);

  const processedProducts = useMemo(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category?._id)
      );
    }

    // Apply price filter
    if (selectedPrice.length > 0) {
      const [min, max] = selectedPrice;
      filtered = filtered.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, selectedCategories, selectedPrice, sortBy]);

  // Update filtered products when processed products change
  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  // Handle category filter
  const handleCategoryFilter = (categoryId) => {
    let updatedCategories = [];

    if (selectedCategories.includes(categoryId)) {
      updatedCategories = selectedCategories.filter((id) => id !== categoryId);
    } else {
      updatedCategories = [...selectedCategories, categoryId];
    }

    setSelectedCategories(updatedCategories);
  };

  // Handle price filter
  const handlePriceFilter = (priceRange) => {
    setSelectedPrice(priceRange);
  };

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/product-count`
      );
      if (data?.success) {
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error fetching product count:", error);
    }
  };

  useEffect(() => {
    getTotal();
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedPrice([]);
    setSortBy("name");
  };

  // Loading component
  const LoadingSpinner = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "200px" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="container my-2">
        {/* Filter and Products Section */}
        <div className="row">
          {/* Filter Sidebar */}
          <div className="col-lg-3 mb-4">
            {/* Category Filter */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filter By Category
                </h5>
              </div>
              <div className="card-body p-3">
                <div className="form-check-container">
                  {categories.map((cat) => (
                    <div key={cat._id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`category-${cat._id}`}
                        checked={selectedCategories.includes(cat._id)}
                        onChange={() => handleCategoryFilter(cat._id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`category-${cat._id}`}
                      >
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="fas fa-dollar-sign me-2"></i>
                  Filter By Price
                </h5>
              </div>
              <div className="card-body p-3">
                <div className="form-check-container">
                  {Prices.map((p) => (
                    <div key={p._id} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        id={`price-${p._id}`}
                        name="price"
                        checked={
                          JSON.stringify(selectedPrice) ===
                          JSON.stringify(p.array)
                        }
                        onChange={() => handlePriceFilter(p.array)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`price-${p._id}`}
                      >
                        {p.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reset Filters Button */}
            <button
              onClick={resetFilters}
              className="btn btn-outline-secondary w-100"
              disabled={
                selectedCategories.length === 0 && selectedPrice.length === 0
              }
            >
              <i className="fas fa-refresh me-2"></i>
              Reset All Filters
            </button>
          </div>

          {/* Products Section */}
          <div className="col-lg-9">
            {/* Results Header with Sort */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h3 className="fw-bold mb-1">All Products</h3>
                <p className="text-muted mb-0">
                  Showing {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                  {selectedCategories.length > 0 && (
                    <span className="ms-2">
                      in {selectedCategories.length} categor
                      {selectedCategories.length !== 1 ? "ies" : "y"}
                    </span>
                  )}
                </p>
              </div>

              <div className="d-flex align-items-center gap-3">
                <label
                  htmlFor="sortSelect"
                  className="form-label mb-0 text-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id="sortSelect"
                  className="form-select"
                  style={{ width: "auto" }}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedPrice.length > 0) && (
              <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                  {selectedCategories.map((catId) => {
                    const category = categories.find((c) => c._id === catId);
                    return (
                      <span key={catId} className="badge bg-primary">
                        {category?.name}
                        <button
                          className="btn-close btn-close-white ms-2"
                          style={{ fontSize: "0.7em" }}
                          onClick={() => handleCategoryFilter(catId)}
                        ></button>
                      </span>
                    );
                  })}
                  {selectedPrice.length > 0 && (
                    <span className="badge bg-success">
                      ${selectedPrice[0]} - ${selectedPrice[1]}
                      <button
                        className="btn-close btn-close-white ms-2"
                        style={{ fontSize: "0.7em" }}
                        onClick={() => setSelectedPrice([])}
                      ></button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading && page === 1 ? (
              <LoadingSpinner />
            ) : (
              <div className="row">
                {filteredProducts?.length > 0 ? (
                  filteredProducts.map((p) => (
                    <div key={p._id} className="col-xl-4 col-md-6 mb-4">
                      <div className="card h-100 shadow-sm border-0 product-card">
                        <div className="position-relative">
                          <div
                            className="card-img-top d-flex justify-content-center align-items-center overflow-hidden"
                            style={{
                              height: "250px",
                              backgroundColor: "#f8f9fa",
                            }}
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
                              <span className="badge bg-info">
                                {p.category.name}
                              </span>
                            </div>
                          )}
                        </div>

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
                              <h4 className="text-success fw-bold mb-0">
                                ${p.price}
                              </h4>
                              <small className="text-muted">Best Price</small>
                            </div>

                            <div className="d-flex gap-2">
                              <Link to={`/product/${p.slug}`}>
                                <i className="fas fa-eye me-1"></i>
                                View
                              </Link>
                              <button
                                className="btn btn-primary btn-sm px-3"
                                onClick={() => {
                                  setCart([...cart, p]);
                                  localStorage.setItem(
                                    "cart",
                                    JSON.stringify([...cart,p])
                                  );
                                  toast.success("Item added to cart");

                                  
                                }}
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
                                <small className="text-muted d-block">
                                  Category
                                </small>
                                <small className="fw-bold">
                                  {p.category?.name || "General"}
                                </small>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">
                                  Stock
                                </small>
                                <small
                                  className={`fw-bold ${
                                    p.quantity > 0
                                      ? "text-success"
                                      : "text-danger"
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
                  <div className="col-12 text-center py-5">
                    <div className="card border-0 bg-light">
                      <div className="card-body py-5">
                        <i className="fas fa-search fa-4x text-muted mb-3"></i>
                        <h4 className="text-muted">No products found</h4>
                        <p className="text-muted mb-3">
                          {selectedCategories.length > 0
                            ? "No products match the selected filters"
                            : "No products available at the moment"}
                        </p>
                        {(selectedCategories.length > 0 ||
                          selectedPrice.length > 0) && (
                          <button
                            className="btn btn-primary"
                            onClick={resetFilters}
                          >
                            <i className="fas fa-refresh me-2"></i>
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Load More Button */}
            <div className="text-center mt-4">
              {products && products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prevPage) => prevPage + 1);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx="true">{`
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .form-check-input:checked {
          background-color: #0d6efd;
          border-color: #0d6efd;
        }

        .form-check-label {
          cursor: pointer;
          user-select: none;
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .badge {
          cursor: pointer;
        }

        .badge .btn-close {
          opacity: 0.7;
        }

        .badge .btn-close:hover {
          opacity: 1;
        }

        .input-group-text {
          background-color: #f8f9fa;
          border-color: #dee2e6;
        }

        .spinner-border {
          width: 3rem;
          height: 3rem;
        }

        @media (max-width: 768px) {
          .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
          }

          .d-flex.align-items-center.gap-3 {
            justify-content: space-between;
          }
        }
      `}</style>
    </Layout>
  );
};

export default HomePage;
