import { Paper, Typography, Button, Stack, Card } from "@mui/material";
import dayjs from "dayjs";

import React, { useEffect, useState } from "react";
import UserLoggedIn from "../../hooks/UserLoggedIn";
import { useSnackbar } from "notistack";
import axios from "axios";
import { Status, UserType } from "../../types";
import Link from "next/link";
import Error from "../../components/error";
import Loading from "../../components/loading";

export default function Profile() {
  const { isLoggedIn, user, loading, error } = UserLoggedIn();
  const { enqueueSnackbar } = useSnackbar();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function getAppointments() {
      const data = await axios.get("/api/appointment/getall", {
        headers: {
          authorization: `Bearer ${
            JSON.parse(localStorage.getItem("profile") as string).token
          }`,
        },
      });
      setAppointments(data.data.data);
    }

    getAppointments().catch((err) => console.log(err));
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }
  if (isLoggedIn) {
    return (
      <>
        <Paper sx={{ marginTop: "1rem", padding: "1rem 1rem" }}>
          <Typography variant="h3">Welcome to your profile</Typography>
          <br />
          <br />
          <Typography gutterBottom>Name: {user?.name}</Typography>
          <Typography gutterBottom>Email: {user?.email}</Typography>
          <Typography gutterBottom>
            Birthday: {dayjs(user?.birthday).format("MMMM D, YYYY")}
          </Typography>
          <Typography gutterBottom>About: {user?.about}</Typography>
          <br />

          <Button
            variant="contained"
            color="error"
            sx={{ marginRight: "1rem" }}
            onClick={async () => {
              try {
                enqueueSnackbar("Attempting to delete user", {
                  variant: "info",
                });
                await axios.delete("/api/user/user", {
                  headers: {
                    authorization: `Bearer ${
                      JSON.parse(localStorage.getItem("profile") as string)
                        .token
                    }`,
                  },
                });
                enqueueSnackbar("User deleted successfully", {
                  variant: "success",
                });
                localStorage.removeItem("profile");
                window.location.reload();
              } catch (error) {
                enqueueSnackbar("Something went wrong while deleting user", {
                  variant: "error",
                });
              }
            }}
          >
            Delete
          </Button>

          {user?.type == UserType.PATIENT && (
            <Link href="/doctors">
              {" "}
              <Button variant="contained">Look for a Doctor</Button>
            </Link>
          )}
        </Paper>
        <Paper sx={{ marginTop: "1rem", padding: "1rem 1rem" }}>
          <Typography variant="h3" gutterBottom>
            Appointments
          </Typography>
          <Stack spacing={3}>
            {appointments.map((ap: any) => (
              <Card key={ap._id} sx={{ padding: "1rem" }}>
                {user?.type == UserType.PATIENT ? (
                  <>
                    <Link href={`user/${ap.doctor._id}`}>
                      {" "}
                      <Typography
                        gutterBottom
                        sx={{ color: "#1e26ffa7", textDecoration: "underline" }}
                      >
                        Doctor: {ap.doctor.name}
                      </Typography>
                    </Link>

                    <a href={`mailto:${ap.doctor.email}`}>
                      <Typography
                        gutterBottom
                        sx={{ color: "#1e26ffa7", textDecoration: "underline" }}
                      >
                        Doctors Email: {ap.doctor.email}
                      </Typography>
                    </a>
                  </>
                ) : (
                  <>
                    {" "}
                    <Link href={`user/${ap.patient._id}`}>
                      <Typography
                        gutterBottom
                        sx={{ color: "#1e26ffa7", textDecoration: "underline" }}
                      >
                        Patient: {ap.patient.name}
                      </Typography>
                    </Link>
                    <a href={`mailto:${ap.patient.email}`}>
                      <Typography
                        gutterBottom
                        sx={{ color: "#1e26ffa7", textDecoration: "underline" }}
                      >
                        Patients Email: {ap.patient.email}
                      </Typography>
                    </a>
                  </>
                )}
                <Typography gutterBottom>
                  Description: {ap.description}
                </Typography>
                <Typography gutterBottom>
                  To: {dayjs(ap.to).format("MMMM DD, YYYY HH:mm ")}
                </Typography>
                <Typography gutterBottom>
                  From: {dayjs(ap.from).format("MMMM DD, YYYY HH:mm ")}
                </Typography>
                <Typography gutterBottom>Status: {ap.status}</Typography>
                <br />

                {user?.type == UserType.DOCTOR && ap.status == Status.PENDING && (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ marginRight: "1rem" }}
                      onClick={async () => {
                        try {
                          enqueueSnackbar("Accepting appointment", {
                            variant: "info",
                          });
                          await axios.patch(
                            "/api/appointment/" + ap._id,
                            { status: Status.ACCEPTED },
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
                          enqueueSnackbar("Appointment Accepted", {
                            variant: "success",
                          });
                          window.location.reload();
                        } catch (error) {
                          enqueueSnackbar(
                            "Something went wrong accepting appointment",
                            { variant: "error" }
                          );
                        }
                      }}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={async () => {
                        try {
                          enqueueSnackbar("Rejecting appointment", {
                            variant: "info",
                          });
                          await axios.patch(
                            "/api/appointment/" + ap._id,
                            { status: Status.REJECTED },
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
                          enqueueSnackbar("Appointment Rected Sucessfully", {
                            variant: "success",
                          });
                          window.location.reload();
                        } catch (error) {
                          enqueueSnackbar(
                            "Something went wrong rejecting appointment",
                            { variant: "error" }
                          );
                        }
                      }}
                    >
                      Decline
                    </Button>
                  </>
                )}
              </Card>
            ))}
          </Stack>
        </Paper>
      </>
    );
  }
}
