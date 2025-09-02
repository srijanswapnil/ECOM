import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");
const [loading, setLoading] = useState(false);

  // Fetch categories
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
      toast.error("Something went wrong in getting categories");
    }
  };

  // Fetch single product details
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/single-product/${params.slug}`
      );
      if (data.success) {
        setName(data.product.name);
        setId(data.product._id);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping ? "1" : "0");
        setCategory(data.product.category?._id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in fetching product");
    }
  };

  useEffect(() => {
    getAllCategory();
    getSingleProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping);
      productData.append("category", category);
      if (photo) {
        productData.append("photo", photo);
      }

      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/product/update-product/${id}`,
        productData
      );

      if (data?.success) {
        toast.success("Product updated successfully!");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in updating product");
    }
  };

  return (
    <Layout>
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            {/* Header Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="mb-1">
                      <i className="fas fa-edit text-primary me-2"></i>
                      Update Product
                    </h2>
                    <p className="text-muted mb-0">Modify product information and settings</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/dashboard/admin/products")}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Products
                  </button>
                </div>
                <hr className="my-3" />
              </div>
            </div>

            {/* Form Card */}
            <div className="row">
              <div className="col-lg-8">
                <div className="card shadow-sm">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-box me-2"></i>
                      Product Information
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleUpdate}>
                      <div className="row">
                        {/* Category Selection */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-tags text-info me-2"></i>
                            Category *
                          </label>
                          <select
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                          >
                            <option value="">-- Select Category --</option>
                            {categories.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Product Name */}
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-cube text-success me-2"></i>
                            Product Name *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Enter product name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          <i className="fas fa-align-left text-warning me-2"></i>
                          Description *
                        </label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Enter product description..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>

                      <div className="row">
                        {/* Price */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-dollar-sign text-success me-2"></i>
                            Price *
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-boxes text-primary me-2"></i>
                            Quantity *
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                            min="0"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                          />
                        </div>

                        {/* Shipping */}
                        <div className="col-md-4 mb-3">
                          <label className="form-label fw-bold">
                            <i className="fas fa-shipping-fast text-info me-2"></i>
                            Shipping Available *
                          </label>
                          <select
                            className="form-select"
                            value={shipping}
                            onChange={(e) => setShipping(e.target.value)}
                            required
                          >
                            <option value="">-- Select --</option>
                            <option value="1">✓ Yes</option>
                            <option value="0">✗ No</option>
                          </select>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary me-md-2"
                          onClick={() => navigate("/dashboard/admin/products")}
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary btn-lg px-4"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Updating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-save me-2"></i>
                              Update Product
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Photo Upload Section */}
              <div className="col-lg-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-camera me-2"></i>
                      Product Photo
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    {/* Photo Upload */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Upload New Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setPhoto(e.target.files[0])}
                      />
                      <div className="form-text">
                        <i className="fas fa-info-circle me-1"></i>
                        Supported formats: JPG, PNG, GIF (Max 5MB)
                      </div>
                    </div>

                    {/* Photo Preview */}
                    <div className="position-relative">
                      {photo ? (
                        <div className="mb-3">
                          <div className="badge bg-warning text-dark mb-2">
                            <i className="fas fa-eye me-1"></i>
                            New Photo Preview
                          </div>
                          <div className="border rounded p-2 bg-light">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt="preview"
                              className="img-fluid rounded"
                              style={{ maxHeight: "200px", width: "100%" }}
                            />
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mt-2"
                            onClick={() => setPhoto(null)}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Remove
                          </button>
                        </div>
                      ) : (
                        id && (
                          <div className="mb-3">
                            <div className="badge bg-info text-white mb-2">
                              <i className="fas fa-image me-1"></i>
                              Current Photo
                            </div>
                            <div className="border rounded p-2 bg-light">
                              <img
                                src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${id}`}
                                alt={name}
                                className="img-fluid rounded"
                                style={{ maxHeight: "200px", width: "100%" }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                              <div className="text-muted py-4" style={{ display: 'none' }}>
                                <i className="fas fa-image fa-3x mb-2"></i>
                                <p>No image available</p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {!photo && !id && (
                      <div className="text-muted py-4">
                        <i className="fas fa-cloud-upload-alt fa-3x mb-3"></i>
                        <p>No photo uploaded</p>
                        <small>Upload a photo to see preview</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Summary Card */}
                <div className="card shadow-sm mt-3">
                  <div className="card-header bg-light">
                    <h6 className="mb-0">
                      <i className="fas fa-clipboard-list me-2"></i>
                      Product Summary
                    </h6>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <strong>Name:</strong> 
                        <span className="text-muted ms-2">{name || 'Not set'}</span>
                      </li>
                      <li className="mb-2">
                        <strong>Price:</strong> 
                        <span className="text-success ms-2">${price || '0.00'}</span>
                      </li>
                      <li className="mb-2">
                        <strong>Quantity:</strong> 
                        <span className="text-primary ms-2">{quantity || '0'}</span>
                      </li>
                      <li className="mb-0">
                        <strong>Shipping:</strong> 
                        <span className={`ms-2 badge ${shipping === "1" ? 'bg-success' : shipping === "0" ? 'bg-danger' : 'bg-secondary'}`}>
                          {shipping === "1" ? 'Available' : shipping === "0" ? 'Not Available' : 'Not Set'}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
