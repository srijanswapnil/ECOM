import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

import DropIn from "braintree-web-drop-in-react";
import axios from "axios";

const Cart = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [instance, setInstance] = useState(null);
  const [clientToken, setClientToken] = useState("");

  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/token`
      );
      setClientToken(data.clientToken);
    } catch (err) {
      console.log("Error fetching client token:", err);
    }
  };

  useEffect(() => {
    // fetch token on mount
    getToken();
  }, [auth?.token]);

  const navigate = useNavigate();

  // Memoized calculations for better performance
  const cartSummary = useMemo(() => {
    const totalItems =
      cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;
    const totalPrice =
      cart?.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 1),
        0
      ) || 0;

    return {
      totalItems,
      totalPrice: totalPrice.toFixed(2),
    };
  }, [cart]);

  // Remove item from cart with confirmation
  const removeFromCart = useCallback(
    (productId) => {
      if (!productId) return;

      try {
        const updatedCart = cart.filter((item) => item._id !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    },
    [cart, setCart]
  );

  // Update quantity with validation
  const updateQuantity = useCallback(
    (productId, newQuantity) => {
      if (!productId || isNaN(newQuantity)) return;

      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      // Limit maximum quantity
      const maxQuantity = 99;
      const validQuantity = Math.min(
        Math.max(1, Math.floor(newQuantity)),
        maxQuantity
      );

      try {
        const updatedCart = cart.map((item) =>
          item._id === productId ? { ...item, quantity: validQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    },
    [cart, setCart, removeFromCart]
  );

  // Clear entire cart with confirmation
  const clearCart = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        setCart([]);
        localStorage.removeItem("cart");
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  }, [setCart]);

  // Handle payment processing
  const handlePayment = async () => {
    try {
      if (!instance) {
        alert("Payment UI not ready yet. Please try again.");
        return;
      }

      setIsLoading(true);

      // Get payment nonce from DropIn instance
      const { nonce } = await instance.requestPaymentMethod();

      // Send nonce + cart to backend
      const { data } = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/product/braintree/payment`,
        { nonce, cart }
      );

      setIsLoading(false);

      if (data?.ok) {
        // Clear cart
        localStorage.removeItem("cart");
        setCart([]);

        // Navigate to orders
        navigate("/dashboard/user/orders");

        alert("✅ Payment Completed Successfully");
      } else {
        alert("❌ Payment Failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setIsLoading(false);
      alert("Something went wrong while processing payment");
    }
  };

  // Handle checkout process
  const handleCheckout = useCallback(() => {
    if (!auth?.user?.address?.trim()) {
      if (
        window.confirm(
          "Please update your address in profile before checkout. Go to profile now?"
        )
      ) {
        navigate("/dashboard/user/profile");
      }
      return;
    }

    setIsLoading(true);
    // Add your checkout logic here
    console.log("Proceeding to checkout...");
    // Reset loading state after checkout logic
    setTimeout(() => setIsLoading(false), 1000);
  }, [auth?.user?.address, navigate]);

  // Handle quantity input change
  const handleQuantityInputChange = useCallback(
    (productId, value) => {
      const numValue = parseInt(value) || 1;
      updateQuantity(productId, numValue);
    },
    [updateQuantity]
  );

  const isCartEmpty = !cart?.length;
  const isUserLoggedIn = !!auth?.token;
  const userName = auth?.user?.name || "Guest";

  return (
    <Layout title="Shopping Cart">
      <div className="container py-4">
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="text-center">
              <h1 className="bg-light p-3 mb-3 rounded">
                Hello, {isUserLoggedIn ? userName : "Guest"}!
              </h1>
              <h4 className="text-muted">
                {isCartEmpty
                  ? "Your Cart Is Empty"
                  : `You have ${cartSummary.totalItems} ${
                      cartSummary.totalItems === 1 ? "item" : "items"
                    } in your cart`}
                {!isUserLoggedIn && !isCartEmpty && (
                  <small className="d-block text-warning mt-2">
                    Please login to checkout
                  </small>
                )}
              </h4>
            </div>
          </div>
        </div>

        {isCartEmpty ? (
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <h3 className="text-muted mb-3">Your cart is empty</h3>
                  <p className="text-muted mb-4">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <Link to="/" className="btn btn-primary btn-lg">
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8 mb-4">
              <div className="card shadow-sm">
                <div className="card-header bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Cart Items</h3>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={clearCart}
                      disabled={isLoading}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  {cart.map((item, index) => (
                    <div
                      key={item._id}
                      className={`row align-items-center py-3 ${
                        index < cart.length - 1 ? "border-bottom" : ""
                      }`}
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
                            e.target.src = "/placeholder-image.png"; // Add fallback image
                          }}
                        />
                      </div>

                      <div className="col-md-5 col-sm-8 mb-3 mb-md-0">
                        <h5 className="mb-2">
                          {item.name || "Unnamed Product"}
                        </h5>
                        {item.description && (
                          <p className="text-muted small mb-2">
                            {item.description.length > 100
                              ? `${item.description.substring(0, 100)}...`
                              : item.description}
                          </p>
                        )}
                        <h5 className="text-success mb-0">
                          ${(item.price || 0).toFixed(2)}
                        </h5>
                      </div>

                      <div className="col-md-4">
                        <div className="d-flex flex-column align-items-end">
                          {/* Quantity Controls - FIXED VERSION */}
                          <div className="d-flex align-items-center mb-2">
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  (item.quantity || 1) - 1
                                )
                              }
                              disabled={isLoading || (item.quantity || 1) <= 1}
                              style={{ minWidth: "35px" }}
                              aria-label={`Decrease quantity for ${item.name}`}
                            >
                              -
                            </button>

                            {/* FIXED: Added id, name, and aria-label attributes */}
                            <input
                              type="number"
                              className="form-control text-center mx-2"
                              style={{ width: "60px" }}
                              value={item.quantity || 1}
                              min="1"
                              max="99"
                              id={`quantity-${item._id}`}
                              name={`quantity-${item._id}`}
                              aria-label={`Quantity for ${item.name}`}
                              onChange={(e) =>
                                handleQuantityInputChange(
                                  item._id,
                                  e.target.value
                                )
                              }
                              disabled={isLoading}
                            />

                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                updateQuantity(
                                  item._id,
                                  (item.quantity || 1) + 1
                                )
                              }
                              disabled={isLoading || (item.quantity || 1) >= 99}
                              style={{ minWidth: "35px" }}
                              aria-label={`Increase quantity for ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            className="btn btn-danger btn-sm mb-2"
                            onClick={() => removeFromCart(item._id)}
                            disabled={isLoading}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            Remove
                          </button>

                          {/* Subtotal */}
                          <div className="text-end">
                            <strong>
                              Subtotal: $
                              {(
                                (item.price || 0) * (item.quantity || 1)
                              ).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div
                className="card shadow-sm sticky-top"
                style={{ top: "20px" }}
              >
                <div className="card-header bg-white">
                  <h3 className="mb-0">Order Summary</h3>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Items ({cartSummary.totalItems})</span>
                    <span>${cartSummary.totalPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span className="text-success">Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mb-0">Total:</h5>
                    <h5 className="mb-0 text-success">
                      ${cartSummary.totalPrice}
                    </h5>
                  </div>

                  {/* Address Check Warning */}
                  {isUserLoggedIn && !auth?.user?.address?.trim() && (
                    <div className="alert alert-warning py-2 px-3 mb-3 small">
                      <strong>Note:</strong> Please update your address in
                      profile before checkout.
                    </div>
                  )}

                  {/* Braintree Drop-in Payment */}
                  {isUserLoggedIn && auth?.user?.address && (
                    <div className="mb-3">
                      <h5 className="mb-3">Payment Method</h5>
                      <div className="border rounded p-3">
                        {clientToken ? (
                          <DropIn
                            options={{
                              authorization: clientToken,
                              paypal: { flow: "vault" },
                            }}
                            onInstance={(inst) => {
                              console.log("✅ DropIn instance ready:", inst);
                              setInstance(inst);
                            }}
                          />
                        ) : (
                          <p>Loading payment options...</p>
                        )}
                      </div>

                      <button
                        className="btn btn-success w-100 mt-3 mb-2"
                        onClick={handlePayment}
                        disabled={isLoading || !instance}
                        aria-label="Make payment"
                      >
                        {isLoading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Processing Payment...
                          </>
                        ) : (
                          "Make Payment"
                        )}
                      </button>
                    </div>
                  )}

                  {/* Checkout Button - Show when not logged in or no address */}
                  {!isUserLoggedIn && (
                    <button
                      onClick={() =>
                        navigate("/login", { state: { from: "/cart" } })
                      }
                      className="btn btn-primary w-100 mb-2"
                      aria-label="Login to proceed to checkout"
                    >
                      Login to Checkout
                    </button>
                  )}

                  {isUserLoggedIn && !auth?.user?.address && (
                    <button
                      className="btn btn-warning w-100 mb-2"
                      onClick={() => navigate("/dashboard/user/profile")}
                      aria-label="Update address to proceed to checkout"
                    >
                      Update Address to Checkout
                    </button>
                  )}

                  <button
                    className="btn btn-outline-danger w-100 mb-2"
                    onClick={clearCart}
                    disabled={isLoading}
                    aria-label="Clear all items from cart"
                  >
                    Clear Cart
                  </button>

                  <Link
                    to="/"
                    className="btn btn-outline-secondary w-100"
                    aria-label="Continue shopping"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
