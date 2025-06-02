import { useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { Service } from "@/interfaces/interfaces";

interface UseServicesResult {
  services: Service[];
  loading: boolean;
  error: string | null;
}

export function useServices(brandId: number): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    axios
      .get(apiEndpoints.getServicesByBrandId(brandId))
      .then((response) => {
        if (!isMounted) return;
        if (response.data.success) {
          setServices(response.data.content || []);
        } else {
          setError("فشل في جلب قائمة الخدمات");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching services:", err);
        setError("حدث خطأ أثناء تحميل الخدمات");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  return { services, loading, error };
}
