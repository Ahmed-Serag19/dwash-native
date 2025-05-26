import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiEndpoints } from "@/constants/endPoints";

export async function fetchCart() {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const response = await axios.get(apiEndpoints.getCart, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}

export async function lockSlot(slotId: number) {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) throw new Error("AUTH_REQUIRED");

  const url = `${apiEndpoints.lockSlot}?slotId=${slotId}`;
  console.log("🔐 lockSlot URL:", url);
  console.log("🔐 lockSlot token:", token);

  try {
    // Try sending an empty JSON object
    const resp = await axios.put(
      url,
      {}, // ← empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("🔐 lockSlot success response:", resp.data);
    return resp.data;
  } catch (err: any) {
    // Log the full error response from the server
    console.error(
      "🔐 lockSlot error response data:",
      err.response?.data || err
    );
    throw err;
  }
}

export async function makePayment(data: {
  invoiceId: number;
  slotId: number;
  discountCode?: string;
  userAddress: number;
  userCar: number;
}) {
  const token = await AsyncStorage.getItem("accessToken");
  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const payload = {
    paymentMethodId: 2,
    ...data,
  };

  const response = await axios.post(apiEndpoints.makePayment, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
}
