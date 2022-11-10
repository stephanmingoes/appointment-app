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
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "Missing ID" });
    switch (req.method) {
      case "PATCH":
        const { to, from, status }: AppointmentType = req.body;
        const newAppointment = await Appointment.findByIdAndUpdate(
          id,
          { to, from, status },
          { new: true }
        );

        return res
          .status(200)
          .json({ message: "Appointment updated", data: newAppointment });

      case "GET":
        let data = await Appointment.findById(id);
        return res
          .status(200)
          .json({ message: "Appointment fetched successfully", data: data });
      case "DELETE":
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        return res.status(200).json({
          message: "Appointment deleted successfully",
          data: deletedAppointment,
        });
      default:
        return res.status(400).json({ message: "Invalid http request" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong processing your request" });
    console.log("Error: ", error);
  }
}
