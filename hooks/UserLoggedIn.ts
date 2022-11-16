import { useState, useEffect } from "react";
import axios from "axios";
import { UserType } from "../types";

export default function UserLoggedIn() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    type: UserType;
    birthday: Date;
    about: string;
  } | null>(null);

  useEffect(() => {
    async function getUser() {
      if (!localStorage.getItem("profile")) {
        setError(true);
        return;
      }
      setLoading(true);
      const data = await axios.get("/api/user/user", {
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("profile") as string).token
          }`,
        },
      });

      const userFound = data.data.data;
      setIsLoggedIn(true);
      setLoading(false);
      setUser({
        name: userFound.name,
        email: userFound.email,
        type: userFound.type,
        birthday: userFound.birthday,
        about: userFound.about,
      });
    }

    getUser().catch((err) => {
      console.log(err);
      setError(true);
      setLoading(false);
    });
  }, []);
  return { user, isLoggedIn, loading, error };
}
