import type React from "react";

import {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { Freelancer } from "@/interfaces/interfaces";

interface FreelancersContextType {
  freelancers: Freelancer[];
  size: number;
  loading: boolean;
  fetchFreelancers: (size: number) => Promise<void>;
  increaseSize: () => void;
}

const FreelancersContext = createContext<FreelancersContextType | undefined>(
  undefined
);

export const useFreelancers = () => {
  const context = useContext(FreelancersContext);
  if (!context) {
    throw new Error("useFreelancers must be used within a FreelancersProvider");
  }
  return context;
};

interface FreelancersProviderProps {
  children: ReactNode;
}

export const FreelancersProvider: React.FC<FreelancersProviderProps> = ({
  children,
}) => {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [size, setSize] = useState(8); // Initial size is 8
  const [loading, setLoading] = useState(false);

  const fetchFreelancers = async (size: number) => {
    setLoading(true);
    try {
      const response = await axios.get(apiEndpoints.getFreelancers(size));
      if (response.data.success) {
        setFreelancers(response.data.content?.data || []);
      }
    } catch (error) {
      console.error("Error fetching freelancers", error);
    } finally {
      setLoading(false);
    }
  };

  const increaseSize = () => {
    setSize((prev) => prev + 8); // Increase size by 8
  };

  useEffect(() => {
    fetchFreelancers(size);
  }, [size]);

  return (
    <FreelancersContext.Provider
      value={{ freelancers, size, loading, fetchFreelancers, increaseSize }}
    >
      {children}
    </FreelancersContext.Provider>
  );
};
