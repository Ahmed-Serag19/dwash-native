import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import Toast from "react-native-toast-message";

interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  nameAr: string;
  nameEn: string;
  userType: string;
  status: number;
  agreementAccept: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  getUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUser = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      console.log("Fetching user profile with token");
      const response = await axios.get(apiEndpoints.getProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log(
          "User profile fetched successfully:",
          response.data.content
        );
        setUser(response.data.content);
      } else {
        console.log("Failed to fetch user profile:", response.data);
        await AsyncStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (error: any) {
      console.log("Error fetching user:", error.response?.data || error);
      await AsyncStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      setUser(null);
      Toast.show({
        type: "success",
        text1: "تم تسجيل الخروج بنجاح",
      });
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, getUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
