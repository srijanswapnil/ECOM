import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [status] = useState([
    "Not Processed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const getAllOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/auth/all-orders`);
      setOrders(data);
    } catch (err) {
      console.log("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`${process.env.REACT_APP_API}/api/v1/auth/order-status/${orderId}`, { status: value });
      toast.success("Order status updated");
      getAllOrders();
    } catch (error) {
      console.log(error);
      toast.error("Error updating order status");
    }
  };


  return (
    <Layout title="All Orders Data">
      <div className="container-fluid m-3 p-3">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <AdminMenu />
          </div>

          {/* Orders Table */}
          <div className="col-md-9">
            <h1 className="text-center">All Orders</h1>

            <div className="border shadow">
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
                  {orders?.map((o, i) => (
                    <tr key={o._id}>
                      <td>{i + 1}</td>
                      <td>
                        <select
                          className="form-select"
                          onChange={(e) => handleChange(o._id, e.target.value)}
                          defaultValue={o?.status}
                        >
                          {status.map((s, idx) => (
                            <option key={idx} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{new Date(o?.createdAt).toLocaleDateString()}</td>
                      <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminOrders;