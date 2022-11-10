import dbConnect from "../../../lib/mongodb";
import { Appointment as AppointmentType, ResponseData } from "../../../types";
import Appointment from "../../../models/Appointment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await dbConnect();
    const { doctor, patient, to, from, status }: AppointmentType = req.body;
    const data = await Appointment.create({
      doctor,
      patient,
      to,
      from,
      status,
    });
    return res
      .status(200)
      .json({ message: "Appointment created successfully.", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong processing your request" });
    console.log("Error: ", error);
  }
}
