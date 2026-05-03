import React, { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

const PaymentPage = () => {
  const [courseId, setCourseId] = useState("");
  const token = localStorage.getItem("token");

  const handlePayment = async () => {
    try {
      if (!token) {
        alert("Please login first");
        return;
      }

      if (!courseId) {
        alert("Enter courseId");
        return;
      }

      // 1️⃣ Create Order
      const { data: order } = await axios.post(
        `${API}/payment/create-order`,
        { courseId: Number(courseId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2️⃣ Razorpay Options
      const options = {
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,

        name: "LevelUp",
        description: "Course Payment",

        handler: async function (response) {
          try {
            // 3️⃣ Verify Payment
            await axios.post(
              `${API}/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: Number(courseId),
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            alert("Payment successful & enrolled");

          } catch (err) {
            console.error(err);
            alert("Verification failed");
          }
        },

        prefill: {
          name: "User",
          email: "user@gmail.com",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Payment Page</h2>

      <input
        type="number"
        placeholder="Enter Course ID"
        value={courseId}
        onChange={(e) => setCourseId(e.target.value)}
      />

      <br /><br />

      <button onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;