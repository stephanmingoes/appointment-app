import { useState, useEffect } from "react";
import axios from "axios";

export default function UseLoadDoctors() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [doctors, setDoctors] = useState<[] | null>(null);

  useEffect(() => {
    async function getUser() {
      if (!localStorage.getItem("profile")) {
        setError(true);
        return;
      }
      setLoading(true);
      const data = await axios.get("/api/doctors/get", {
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("profile") as string).token
          }`,
        },
      });

      console.log(data.data.data);
      const doctorsFound = data.data.data;
      setDoctors(doctorsFound);
      setLoading(false);
    }

    getUser().catch((err) => {
      console.log(err);
      setError(true);
      setLoading(false);
    });
  }, []);
  return { doctors, loading, error };
}
