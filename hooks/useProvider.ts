import { useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { Freelancer } from "@/interfaces/interfaces";

interface UseProviderResult {
  freelancer: Freelancer | null;
  loading: boolean;
  error: string | null;
}

export function useProvider(brandId: number): UseProviderResult {
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
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
      .get(apiEndpoints.getFreelancers(100))
      .then((response) => {
        if (!isMounted) return;
        if (response.data.success) {
          const found: Freelancer | undefined =
            response.data.content?.data.find(
              (f: Freelancer) => f.brandId === brandId
            );
          setFreelancer(found || null);
        } else {
          setError("فشل في جلب بيانات مزود الخدمة");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching provider:", err);
        setError("حدث خطأ أثناء تحميل مزود الخدمة");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  return { freelancer, loading, error };
}
