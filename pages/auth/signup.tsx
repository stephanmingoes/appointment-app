import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import dayjs, { Dayjs } from "dayjs";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSnackbar } from "notistack";
import { Box, Button, Checkbox, Paper, Typography } from "@mui/material";
import validator from "validator";
import { User, UserType } from "../../types";
import UserLoggedIn from "../../hooks/UserLoggedIn";

export default function Signup() {
  const { isLoggedIn } = UserLoggedIn();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [birthdate, setBirthDate] = useState<Dayjs | null>(dayjs());
  const [asDoctor, setAsDoctor] = useState(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [creds, setCreds] = useState({
    name: "",
    email: "",
    about: "",
    password: "",
  });

  const handleDateChange = (newValue: Dayjs | null) => {
    setBirthDate(newValue);
  };

  const setUserType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAsDoctor(event.target.checked);
  };
  const getAndSetIpAddress = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIpAddress(res.data.IPv4);
  };

  const updateFields = (e: any) => {
    const { name, value } = e.target;
    setCreds((prev) => ({ ...prev, [name]: value }));
  };
  const textBoxSx = {
    marginBottom: "1rem",
  };

  const submitUser = async () => {
    try {
      const user: User = {
        ...creds,
        ip: ipAddress,
        birthday: birthdate?.toDate() as Date,
        type: asDoctor ? UserType.DOCTOR : UserType.PATIENT,
      };
      if (!(ipAddress.length > 0)) return enqueueSnackbar("Invalid Ip Address");
      if (!validator.isEmail(user.email)) {
        enqueueSnackbar("Invalid Email");
        return;
      }
      if (!(user.name.trim().length > 5)) {
        enqueueSnackbar("Name must be longer than 5.");
        return;
      }
      if (!(user.password.trim().length > 5)) {
        enqueueSnackbar("Password must be longer than 5.");
        return;
      }
      if (!(user.about.trim().length > 5)) {
        enqueueSnackbar("About must be longer than 5.");
        return;
      }
      enqueueSnackbar("Wait while we sign you up", { variant: "info" });
      const signupdata = await axios.post("/api/user/signup", user);
      enqueueSnackbar(signupdata.data.message, { variant: "success" });
      router.push("/auth/login");
      setCreds({
        name: "",
        email: "",
        about: "",
        password: "",
      });
      setAsDoctor(false);
      setBirthDate(dayjs());
    } catch (err: any) {
      console.log(err);
      enqueueSnackbar(err?.response?.data?.message ?? "Something Went Wrong", {
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) router.push("/profile");
    getAndSetIpAddress().catch((err) => console.log(err));
  }, [isLoggedIn, router]);

  return (
    <>
      <Box
        sx={{
          maxWidth: 500,
          height: "auto",
          padding: "2rem 1rem",
          margin: "2rem auto",
        }}
        component={Paper}
      >
        <Typography marginBottom={"1rem"} textAlign="center" variant="h4">
          Sign up
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextField
            required
            name="name"
            type="text"
            value={creds.name}
            onChange={updateFields}
            label="Full Name"
            variant="outlined"
            sx={textBoxSx}
            fullWidth
          />
          <TextField
            required
            name="email"
            type="email"
            value={creds.email}
            onChange={updateFields}
            label="Email Address"
            variant="outlined"
            sx={textBoxSx}
            fullWidth
          />
          <TextField
            required
            name="password"
            label="Password"
            value={creds.password}
            onChange={updateFields}
            type="password"
            variant="outlined"
            sx={textBoxSx}
            fullWidth
          />
          <TextField
            required
            name="about"
            label="About"
            value={creds.about}
            onChange={updateFields}
            type="text"
            variant="outlined"
            fullWidth
            sx={textBoxSx}
          />
          <DesktopDatePicker
            label="Birthday"
            inputFormat="MM/DD/YYYY"
            value={birthdate}
            onChange={handleDateChange}
            renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => (
              <TextField sx={textBoxSx} required fullWidth {...params} />
            )}
          />
          <Checkbox checked={asDoctor} required onChange={setUserType} />
          Sign up as a Doctor instead.
          <br />
          <br />
          <Button variant="contained" onClick={submitUser} fullWidth>
            Sign up
          </Button>
        </LocalizationProvider>
      </Box>
    </>
  );
}
