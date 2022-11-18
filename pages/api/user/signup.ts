// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/mongodb";
import { User as UserType, ResponseData } from "../../../types";
import User from "../../../models/User";
import validator from "validator";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    await dbConnect();

    let { name, email, type, password, ip, birthday, about }: UserType =
      req.body;
    email = email.toLowerCase().trim();

    if (!validator.isEmail(email))
      return res.status(400).json({ message: "Please Enter a valid email." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        message: "Email already exist.",
      });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log({
      name,
      email,
      type,
      password: hashedPassword,
      ip,
      birthday,
      about,
    });
    await User.create({
      name,
      email,
      type,
      password: hashedPassword,
      ip,
      birthday,
      about,
    });

    return res.status(201).send({
      message: "User created sucessfully, please proceed to login.",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Something went wrong trying to sign you up" });
  }
}
