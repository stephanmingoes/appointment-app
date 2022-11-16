import { Paper, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Error from "../../components/error";
import Loading from "../../components/loading";
import { Status, UserType } from "../../types";
import UserLoggedIn from "../../hooks/UserLoggedIn";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useSnackbar } from "notistack";
import dayjs, { Dayjs } from "dayjs";

const textBoxSx = {
  marginBottom: "1rem",
  minWidth: "300px",
};

export default function User() {
  const router = useRouter();
  const { isLoggedIn, user } = UserLoggedIn();
  const { enqueueSnackbar } = useSnackbar();
  const [doctorLoading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [fetchError, setError] = useState(false);
  const [user1, setUser] = useState<any | null>(null);
  const [from, setFrom] = useState<Dayjs | null>(dayjs());
  const [to, setTo] = useState<Dayjs | null>(dayjs());
  const [description, setDescription] = useState("");
  const { id } = router.query;

  useEffect(() => {
    async function getUser() {
      setLoading(true);
      const data = await axios.get("/api/user/" + id);
      setUser(data.data.data);
      setLoading(false);
    }
    if (id) {
      getUser().catch((err) => {
        setLoading(false);
        setError(true);
      });
    }
  }, [id]);
  if (doctorLoading) {
    return <Loading />;
  }

  if (fetchError) {
    return <Error />;
  }

  if (user1) {
    return (
      <>
        <Paper sx={{ marginTop: "1rem", padding: "1rem 1rem" }}>
          <Typography variant="h3">
            {user1?.type == UserType.DOCTOR ? "Doctor" : "Patient"}
          </Typography>
          <br />
          <br />
          <Typography gutterBottom>Name: {user1?.name}</Typography>
          <Typography gutterBottom>Email: {user1?.email}</Typography>
          <Typography gutterBottom>Type: {user1?.type}</Typography>
          <Typography gutterBottom>About: {user1?.about}</Typography> <br />
          {isLoggedIn && user?.type == UserType.PATIENT && (
            <Button
              variant="contained"
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              Set Appointment
            </Button>
          )}
        </Paper>
        {toggle && (
          <Paper sx={{ margin: "1rem 0", padding: "1rem 1rem" }}>
            <Typography variant="h3">Create an appointment</Typography>
            <br />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              {" "}
              <TextField
                required
                name="description"
                type="text"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                label="Description"
                variant="outlined"
                sx={textBoxSx}
              />
              <br />
              <DateTimePicker
                renderInput={(props) => <TextField sx={textBoxSx} {...props} />}
                label="From"
                value={from}
                onChange={(newValue) => {
                  setFrom(newValue);
                }}
              />
              <br />
              <br />
              <DateTimePicker
                renderInput={(props) => <TextField sx={textBoxSx} {...props} />}
                label="From"
                value={to}
                onChange={(newValue) => {
                  setTo(newValue);
                }}
              />
              <br />
              <br />
              <Button
                variant="contained"
                onClick={async () => {
                  if (!(description.trim().length > 5))
                    return enqueueSnackbar(
                      "Description must be greater than 5"
                    );
                  if (!from?.isAfter(dayjs()))
                    return enqueueSnackbar(
                      "Startdate must be some time after today"
                    );
                  if (!from?.isBefore(to))
                    return enqueueSnackbar(
                      "Start time must be before end time"
                    );
                  try {
                    enqueueSnackbar("Creating appointment", {
                      variant: "info",
                    });
                    await axios.post(
                      "/api/appointment/create",
                      {
                        to,
                        from,
                        status: Status.PENDING,
                        description,
                        doctor: id,
                      },
                      {
                        headers: {
                          authorization: `Bearer ${
                            JSON.parse(
                              localStorage.getItem("profile") as string
                            ).token
                          }`,
                        },
                      }
                    );
                    enqueueSnackbar("Created appointment successfully", {
                      variant: "success",
                    });
                    setTo(dayjs());
                    setFrom(dayjs());
                    setDescription("");
                    setToggle(false);
                  } catch (error) {
                    console.log(error);
                    enqueueSnackbar(
                      "Something went wrong creating your appointment",
                      {
                        variant: "error",
                      }
                    );
                  }
                }}
              >
                Set Appointment
              </Button>
            </LocalizationProvider>
          </Paper>
        )}
      </>
    );
  }
}
