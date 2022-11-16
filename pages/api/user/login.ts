import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import { User as UserType, ResponseData } from "../../../types";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await dbConnect();

    let { email, password }: UserType = req.body;

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!existingUser)
      return res.status(401).json({
        message: "No account exist with this email address.",
      });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Incorrect Password" });

    const token = jsonwebtoken.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        type: existingUser.type,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "User logged in successfully.",
      data: {
        name: existingUser.name,
        about: existingUser.about,
        email: existingUser.email,
        birthday: existingUser.birthday,
        id: existingUser._id,
        token: token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong trying to log you in" });
    console.log(error);
  }
}
