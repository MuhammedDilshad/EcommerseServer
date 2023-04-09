import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  console.log("hi");
  const salt = await bcrypt.genSalt(10);
  console.log(salt, "salt");

  console.log(req.body, "reqbody");
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashPassword, "hashPassword");
  req.body.password = hashPassword;

  const newUser = await userModel(req.body);
  const { email } = req.body;

  try {
    console.log("try");
    const oldUser = await userModel.findOne({ email });
    if (oldUser) {
      res.status(400).json({ message: "user already exist" });
    }
    const user = await newUser.save();

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWTTOKEN,
      { expiresIn: "1hr" }
    );
    res.status(200).json({ token, user });
  } catch (error) {
    console.log("catch");
    console.log(error, "this is serrrr");
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.status(400).json("wrong password");
      } else {
        const token = jwt.sign(
          {
            email: user.email,
            id: user._id,
          },
          process.env.JWTTOKEN,
          { expiresIn: "5hr" }
        );
        res.status(200).json({ token, user });
      }
    } else {
      res.status(404).json("user doues not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
