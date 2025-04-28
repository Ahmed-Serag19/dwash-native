import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { User, Car, UserAddress } from "@/interfaces/interfaces";
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
  const [loading, setLoading] = useState(true); // Initially loading is true
  const [token, setToken] = useState<string | null>(null); // Global token state

  // Function to retrieve token from AsyncStorage
  const retrieveToken = async () => {
    const storedToken = await AsyncStorage.getItem("accessToken");
    setToken(storedToken);
    return storedToken;
  };

  const getUser = async () => {
    try {
      setLoading(true); // Set loading before fetching data
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setUser(null);
        setLoading(false); // Stop loading if no token found
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
        // Handle 401 Unauthorized error gracefully
        setUser(null);
      }
      await AsyncStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false); // Ensure loading is turned off once data fetching is done
    }
  };

  const getCars = async () => {
    try {
      setLoading(true); // Start loading before fetching
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setCars([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(apiEndpoints.getAllCars, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setCars(response.data.content || []);
      } else {
        console.error("Error fetching cars:", response.data.messageEn);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setCars([]);
      }
    } finally {
      setLoading(false); // End loading once cars are fetched
    }
  };

  const getAddresses = async () => {
    try {
      setLoading(true); // Start loading before fetching
      const storedToken = await retrieveToken();
      if (!storedToken) {
        setAddresses([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(apiEndpoints.getAddresses, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (response.data.success) {
        setAddresses(response.data.content || []);
      } else {
        console.error("Error fetching addresses:", response.data.messageEn);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAddresses([]);
      }
    } finally {
      setLoading(false); // End loading once addresses are fetched
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
        await Promise.all([getUser(), getCars(), getAddresses()]); // Fetch all data simultaneously
      } else {
        setLoading(false);
      }
    };

    initialize();
  }, [token]); // Dependencies array ensures this only runs when the token is set

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
