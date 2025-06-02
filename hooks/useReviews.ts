import { useState, useEffect } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";

interface Review {
  username: string;
  appraisal: number;
  description: string;
}

interface UseReviewsResult {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

export function useReviews(brandId: number): UseReviewsResult {
  const [reviews, setReviews] = useState<Review[]>([]);
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
      .get(apiEndpoints.getBrandReviews(brandId.toString()))
      .then((response) => {
        if (!isMounted) return;
        if (response.data.success) {
          const data: any[] = response.data.content?.data || [];
          const mapped: Review[] = data.map((r) => ({
            username: r.username,
            appraisal: r.appraisal,
            description: r.description,
          }));
          setReviews(mapped);
        } else {
          setError("فشل في جلب التقييمات");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error fetching reviews:", err);
        setError("حدث خطأ أثناء تحميل التقييمات");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [brandId]);

  return { reviews, loading, error };
}
