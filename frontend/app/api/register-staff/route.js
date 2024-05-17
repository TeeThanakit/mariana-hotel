import { NextResponse } from "next/server";
// const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();

// app.use(cors());
// app.use(express.json());

// MongoDB connection string
const mongoURI = "mongodb+srv://admin:Ffgi,vo15639@mariana-hotel.ucgnibf.mongodb.net/Mariana-Hotel-DB?retryWrites=true&w=majority";
mongoose.connect(mongoURI);

// Connect to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Connected successfully to MongoDB Atlas");
});


const credentialSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  staffID: String,
}, { collection: 'credential' });

const staffSchema = new mongoose.Schema({
  staffID: String,
  name: String,
  lastName: String,
  email: String,
  tel: String,
}, { collection: 'staff' });

const Credential = mongoose.model('Credential', credentialSchema);
const Staff = mongoose.model('Staff', staffSchema);

app.post("/api/register-staff", async (req, res) => {
  const { name, lastname, phoneNumber, email, username, password, permission } =
    req.body;

  try {
    // Generate new staff ID
    const lastStaff = await Staff.findOne().sort({ staffID: -1 }).exec();
    let newStaffID = "DOG001";
    if (lastStaff) {
      const lastIDNum = parseInt(lastStaff.staffID.replace("DOG", ""), 10);
      newStaffID = `DOG${(lastIDNum + 1).toString().padStart(3, "0")}`;
    }

    // Save credentials
    const newCredential = new Credential({
      username,
      password,
      role: permission,
      staffID: newStaffID,
    });
    await newCredential.save();

    // Save personal information
    const newStaff = new Staff({
      staffID: newStaffID,
      name,
      lastName: lastname,
      email,
      tel: phoneNumber,
    });
    await newStaff.save();

    res.status(201).json({ message: "Staff registered successfully!" });
  } catch (error) {
    console.error("Error registering staff:", error);
    res.status(500).json({ message: "Error registering staff" });
  }
});
