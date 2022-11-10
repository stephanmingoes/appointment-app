import dbConnect from "../../../lib/mongodb";
import { ResponseData } from "../../../types";
import Appointment from "../../../models/Appointment";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await dbConnect();
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: "Missing ID." });
    let data = await Appointment.find({
      $or: [{ patient: id }, { doctor: id }],
    });
    return res
      .status(200)
      .json({ message: "Appointments fetched successfully", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong processing your request" });
    console.log("Error: ", error);
  }
}
