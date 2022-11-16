import dbConnect from "../../../lib/mongodb";
import { ResponseData, UserType } from "../../../types";
import User from "../../../models/User";
import auth from "../../../middleware/auth";
import type { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await dbConnect();
    let data = await User.find({
      type: UserType.DOCTOR,
    }).select("-password");
    return res
      .status(200)
      .json({ message: "doctors fetched successfully", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong processing your request" });
    console.log("Error: ", error);
  }
}
export default auth(handler);
