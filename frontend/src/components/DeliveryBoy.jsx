import React, { useEffect, useState } from "react";
import Nav from "./Nav.jsx";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import DeliveryBoyTracking from "./DeliveryBoyTracking.jsx";
import { ClipLoader } from "react-spinners";
import { socket } from "../socket";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

function DeliveryBoy() {
  const { userData } = useSelector((state) => state.user);

  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [availableAssignments, setAvailableAssignments] = useState(null);
  const [otp, setOtp] = useState("");
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* -------------------- GEOLOCATION + SOCKET -------------------- */
  useEffect(() => {
    if (!socket || userData?.role !== "deliveryBoy") return;

    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          socket.emit("updateLocation", {
            latitude,
            longitude,
            userId: userData._id
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData?._id]);

  /* -------------------- SOCKET EVENTS -------------------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("newAssignment", (data) => {
      setAvailableAssignments((prev) => [...(prev || []), data]);
    });

    return () => {
      socket.off("newAssignment");
    };
  }, []);

  /* -------------------- API CALLS -------------------- */
  const getAssignments = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-assignments`,
        { withCredentials: true }
      );
      setAvailableAssignments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true }
      );
      setCurrentOrder(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!userData) return;
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData]);

  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true }
      );
      getCurrentOrder();
    } catch (err) {
      console.log(err);
    }
  };

  const sendOtp = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id
        },
        { withCredentials: true }
      );
      setShowOtpBox(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage("");
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp
        },
        { withCredentials: true }
      );
      setMessage(res.data.message);
      location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  /* -------------------- CALCULATIONS -------------------- */
  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  /* -------------------- UI -------------------- */
  return (
    <div className="w-screen min-h-screen flex flex-col items-center bg-[#fff9f6]">
      <Nav />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] text-center">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userData?.fullName}
          </h1>
          <p className="text-sm text-[#ff4d2d]">
            Lat: {deliveryBoyLocation?.lat} | Lon: {deliveryBoyLocation?.lon}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 w-[90%]">
          <h1 className="text-lg font-bold mb-3 text-[#ff4d2d]">
            Today Deliveries
          </h1>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayDeliveries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#ff4d2d" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 text-center">
            <h1 className="text-xl font-semibold">Today's Earning</h1>
            <span className="text-3xl font-bold text-green-600">
              ₹{totalEarning}
            </span>
          </div>
        </div>

        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%]">
            {availableAssignments?.length > 0 ? (
              availableAssignments.map((a, i) => (
                <div key={i} className="border p-4 mb-3 flex justify-between">
                  <div>
                    <p className="font-semibold">{a.shopName}</p>
                    <p className="text-sm text-gray-500">
                      {a.deliveryAddress.text}
                    </p>
                  </div>
                  <button
                    onClick={() => acceptOrder(a.assignmentId)}
                    className="bg-orange-500 text-white px-4 rounded"
                  >
                    Accept
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No Available Orders</p>
            )}
          </div>
        )}

        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%]">
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation:
                  deliveryBoyLocation ||
                  {
                    lat: userData.location.coordinates[1],
                    lon: userData.location.coordinates[0]
                  },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude
                }
              }}
            />

            {!showOtpBox ? (
              <button
                onClick={sendOtp}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? <ClipLoader size={20} color="white" /> : "Delivered"}
              </button>
            ) : (
              <div className="mt-4">
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full border p-2 rounded"
                  placeholder="Enter OTP"
                />
                <button
                  onClick={verifyOtp}
                  className="mt-2 w-full bg-orange-500 text-white py-2 rounded"
                >
                  Submit OTP
                </button>
                {message && <p className="text-green-500 mt-2">{message}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryBoy;
