import dotenv from "dotenv";
import * as fs from "node:fs";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

dotenv.config();

connectDB();

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    console.log("Data loaded");

    process.exit();
  } catch (error) {
    console.error("Failed to import data:", error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log("Data deleted");

    process.exit();
  } catch (error) {
    console.error("Failed to delete data:", error);
  }
};

importData();
