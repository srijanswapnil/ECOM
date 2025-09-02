import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [deleting, setDeleting] = useState(null);
  // Fetch products
  const getAllProducts = async () => {
    try {
       const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/get-product`
      );
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      setDeleting(productId);
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/product/delete-product/${productId}`
      );
      
      if (data?.success) {
        toast.success("Product deleted successfully!");
        // Remove the deleted product from the state
        setProducts(products.filter(p => p._id !== productId));
      } else {
        toast.error(data?.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      if (error.response?.status === 404) {
        toast.error("Product not found");
        // Remove from state anyway since it doesn't exist
        setProducts(products.filter(p => p._id !== productId));
      } else if (error.response?.status === 401) {
        toast.error("Authentication failed. Please login again.");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Error deleting product");
      }
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="container mt-4">
              <h2 className="text-center mb-4">All Products</h2>
              
              <div className="row">
                {products?.map((p) => (
                  <div key={p._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <Link 
                        to={`/dashboard/admin/product/${p.slug}`}
                        className="text-decoration-none"
                      >
                        <div className="card-img-top d-flex justify-content-center align-items-center" style={{ height: "200px", backgroundColor: "#f8f9fa" }}>
                          
                            <img
                              src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`}
                              alt={p.name}
                              className="img-fluid"
                              style={{ 
                                maxHeight: "180px", 
                                maxWidth: "100%", 
                                objectFit: "cover" 
                              }}
                            />
                          
                        </div>
                        <div className="card-body">
                          <h5 className="card-title text-dark">{p.name}</h5>
                          <p className="card-text text-muted">
                            {p.description?.substring(0, 60)}...
                          </p>
                          <p className="card-text">
                            <strong className="text-success">${p.price}</strong>
                          </p>
                        </div>
                      </Link>
                      <div className="card-footer bg-transparent">
                        <div className="d-flex justify-content-between">
                          
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(p._id, p.name)}
                            disabled={deleting === p._id}
                          >
                            {deleting === p._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-trash me-1"></i>
                                Delete
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {products?.length === 0 && (
                <div className="text-center mt-5">
                  <h4 className="text-muted">No products found</h4>
                  <Link to="/dashboard/admin/create-product" className="btn btn-primary mt-3">
                    Create First Product
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;