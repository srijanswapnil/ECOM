import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";

const Orders = () => {
  const [auth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from backend
  const getOrders = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/orders`
      );
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>All Orders</h1>

            {loading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              orders.map((order, i) => (
                <div key={order._id} className="mb-4">
                  {/* Order Summary Table */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Date</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{order.status}</td>
                        <td>{order.buyer?.name}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>{order.payment?.success ? "Success" : "Failed"}</td>
                        <td>{order.products.length}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Products in this Order */}
                  <div className="mb-3">
                    {order.products.map((item) => (
                      <div
                        key={item._id}
                        className="row align-items-center py-3 border-bottom"
                      >
                        <div className="col-md-3 col-sm-4 mb-3 mb-md-0">
                          <img
                            src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${item._id}`}
                            alt={item.name || "Product"}
                            className="img-fluid rounded shadow-sm"
                            style={{
                              maxHeight: "120px",
                              width: "100%",
                              objectFit: "cover",
                            }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.png";
                            }}
                          />
                        </div>

                        <div className="col-md-9 col-sm-8">
                          <h5 className="mb-2">{item.name || "Unnamed Product"}</h5>
                          {item.description && (
                            <p className="text-muted small mb-2">
                              {item.description.length > 100
                                ? `${item.description.substring(0, 100)}...`
                                : item.description}
                            </p>
                          )}
                          <h5 className="text-success mb-0">
                            ₹{item.price?.toFixed(2)}
                          </h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
