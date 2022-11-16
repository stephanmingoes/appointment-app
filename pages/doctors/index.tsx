import { Paper, Typography, Button, Card, Stack } from "@mui/material";
import UseLoadDoctors from "../../hooks/UseLoadDoctors";
import React from "react";
import Link from "next/link";
import Loading from "../../components/loading";
import Error from "../../components/error";

export default function Doctors() {
  const { doctors, loading, error } = UseLoadDoctors();
  if (loading) return <Loading />;

  if (error) return <Error />;

  if (doctors) {
    return (
      <Paper sx={{ marginTop: "1rem", padding: "1rem 1rem" }}>
        <Typography variant="h3" gutterBottom>
          Doctors
        </Typography>
        <Stack spacing={3}>
          {" "}
          {doctors.map((doctor: any) => (
            <Card sx={{ padding: "1rem 1rem" }} key={doctor._id}>
              <Typography>Name: {doctor.name}</Typography>
              <Typography>Email: {doctor.email}</Typography>
              <Typography>About: {doctor.about}</Typography>
              <br />

              <Link href={`/user/${doctor._id}`}>
                <Button variant="contained">View Profile</Button>
              </Link>
            </Card>
          ))}
        </Stack>
      </Paper>
    );
  }
}
