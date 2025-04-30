import type React from "react";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { User, Car, UserAddress } from "@/interfaces/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

interface UserContextType {
  user: User | null;
  cars: Car[];
  addresses: UserAddress[];
  loading: boolean;
  getUser: () => Promise<void>;
  getCars: () => Promise<void>;
  getAddresses: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [dataFetchInProgress, setDataFetchInProgress] = useState(false);

  // Function to retrieve token from AsyncStorage
  const retrieveToken = async () => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    setToken(storedToken);
    return storedToken;
  };

  const getUser = async () => {
    try {
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setUser(null);
        return;
      }

      const response = await axios.get(apiEndpoints.getProfile, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setUser(response.data.content);
      } else {
        await AsyncStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
      }
    }
  };

  const getCars = async () => {
    try {
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setCars([]);
        return;
      }

      const response = await axios.get(apiEndpoints.getAllCars, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setCars(response.data.content || []);
      } else {
        console.error("Error fetching cars:", response.data.messageEn);
        setCars([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    }
  };

  const getAddresses = async () => {
    try {
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setAddresses([]);
        return;
      }

      const response = await axios.get(apiEndpoints.getAddresses, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setAddresses(response.data.content || []);
      } else {
        console.error("Error fetching addresses:", response.data.messageEn);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAddresses([]);
    }
  };

  const fetchAllData = async () => {
    if (dataFetchInProgress) return;

    setDataFetchInProgress(true);
    setLoading(true);

    try {
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setUser(null);
        setCars([]);
        setAddresses([]);
        setLoading(false);
        setDataFetchInProgress(false);
        return;
      }

      // Create all API requests but don't wait for them yet
      const userPromise = axios
        .get(apiEndpoints.getProfile, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          return { data: { success: false } };
        });

      const carsPromise = axios
        .get(apiEndpoints.getAllCars, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .catch((error) => {
          console.error("Error fetching cars:", error);
          return { data: { success: false, content: [] } };
        });

      const addressesPromise = axios
        .get(apiEndpoints.getAddresses, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .catch((error) => {
          console.error("Error fetching addresses:", error);
          return { data: { success: false, content: [] } };
        });

      // Execute all requests in parallel
      const [userResponse, carsResponse, addressesResponse] = await Promise.all(
        [userPromise, carsPromise, addressesPromise]
      );

      // Process responses
      if (userResponse.data.success) {
        setUser(userResponse.data.content);
      } else {
        setUser(null);
      }

      setCars(carsResponse.data.success ? carsResponse.data.content || [] : []);
      setAddresses(
        addressesResponse.data.success
          ? addressesResponse.data.content || []
          : []
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set default values on error
      setUser(null);
      setCars([]);
      setAddresses([]);
    } finally {
      // Always end loading state and mark data fetch as complete
      setLoading(false);
      setDataFetchInProgress(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setUser(null);
      setCars([]);
      setAddresses([]);
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const storedToken = await retrieveToken();
      if (storedToken) {
        fetchAllData();
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        cars,
        addresses,
        loading,
        getUser,
        getCars,
        getAddresses,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
