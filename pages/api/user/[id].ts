import dbConnect from "../../../lib/mongodb";
import { ResponseData, User as UserType } from "../../../types";
import User from "../../../models/User";
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
      case "DELETE":
        const deletedUser = await User.findByIdAndDelete(id);
        return res
          .status(200)
          .json({ message: "User deleted successfully", data: deletedUser });
      case "GET":
        const user = await User.findById(id);
        return res.status(200).json({ message: "User found", data: user });
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
