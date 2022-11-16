import mongoose from "mongoose";
import { Status } from "../types";
const AppointmentScehma = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: { type: String, required: true },
  to: { type: Date, required: true },
  from: { type: Date, required: true },
  status: { type: String, enum: Status },
});
const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentScehma);

export default Appointment;
