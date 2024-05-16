const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection string
const mongoURI = "mongodb+srv://admin:Ffgi,vo15639@mariana-hotel.ucgnibf.mongodb.net/Mariana-Hotel-DB?retryWrites=true&w=majority";
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Connected successfully to MongoDB Atlas");
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { collection: 'contact_us' });

const Contact = mongoose.model('Contact', contactSchema);

app.post('/api/contacts', async (req, res) => {
  const { name, email, message } = req.body;
  const newContact = new Contact({ name, email, message });
  try {
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const roomTypeSchema = new mongoose.Schema({}, { collection: 'roomtypes' });

const RoomType = mongoose.model('RoomType', roomTypeSchema);

app.get('/api/roomtypes', async (req, res) => {
  try {
    const roomTypes = await RoomType.find({}, 'price types capacity children image clean room _id');
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const bookingSchema = new mongoose.Schema({
  room: String,
  "check-in_date": Date,
  "check-out_date": Date,
  customerID: String,
}, { collection: 'booking' });

const roomSchema = new mongoose.Schema({
  room: String,
  price: String,
  types: String,
  capacity: String,
  children: String,
  image: String,
  clean: String,
}, { collection: 'roomtypes' });

const Booking = mongoose.model('Booking', bookingSchema);
const Room = mongoose.model('Room', roomSchema);

app.post('/check-availability', async (req, res) => {
  const { checkInDate, checkOutDate, numAdults, numChildren } = req.body;

  console.log('Received request to check availability:');
  console.log('checkInDate:', checkInDate);
  console.log('checkOutDate:', checkOutDate);
  console.log('numAdults:', numAdults);
  console.log('numChildren:', numChildren);

  try {
    // Convert date strings to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    console.log('Converted checkInDate to Date object:', checkIn);
    console.log('Converted checkOutDate to Date object:', checkOut);

    // Find rooms that can handle the number of adults and children, regardless of cleanliness
    const availableRooms = await Room.find({
      capacity: { $gte: numAdults },
      children: { $gte: numChildren }
    });
    console.log('Found available rooms:', availableRooms);

    // Filter out rooms that have overlapping bookings
    const availabilityPromises = availableRooms.map(async (room) => {
      console.log(`Checking existing bookings for room: ${room.room}`);
      
      const existingBookings = await Booking.find({
        room: room.room,
        $or: [
          { "check-in_date": { $lt: checkOut }, "check-out_date": { $gt: checkIn } }
        ]
      });
      console.log(`Existing bookings for room ${room.room}:`, existingBookings);

      const overlappingBooking = existingBookings.find(existingBooking => {
        const existingCheckIn = new Date(existingBooking["check-in_date"]);
        const existingCheckOut = new Date(existingBooking["check-out_date"]);
        
        // Check if there is an overlap with the new booking dates
        return !(checkIn >= existingCheckOut || checkOut <= existingCheckIn);
      });

      console.log(`Room ${room.room} overlapping booking:`, overlappingBooking);
      return overlappingBooking ? null : room;
    });

    const availableRoomsFiltered = (await Promise.all(availabilityPromises)).filter(room => room !== null);
    console.log('Filtered available rooms:', availableRoomsFiltered);

    if (availableRoomsFiltered.length > 0) {
      res.json({ available: true, rooms: availableRoomsFiltered });
    } else {
      res.json({ available: false, message: 'No rooms available for the selected dates.' });
    }
  } catch (error) {
    console.error('Error checking room availability:', error);
    res.status(500).send('Error checking room availability: ' + error.message);
  }
});

const roomCleanSchema = new mongoose.Schema({
  clean: String,
  room: String
}, { collection: 'roomtypes' });

const RoomClean = mongoose.model('RoomClean', roomCleanSchema);

app.get('/api/roomclean', async (req, res) => {
  try {
    const roomCleans = await RoomClean.find({ clean: "NO" });
    res.json(roomCleans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/roomclean/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const { clean } = req.body;
  try {
    const updatedRoom = await RoomClean.findByIdAndUpdate(roomId, { clean }, { new: true });
    if (updatedRoom) {
      res.status(200).json(updatedRoom);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  staffid: String
}, { collection: 'credential' });

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: "Login successful", role: user.role });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

// Add a new endpoint for staff registration
app.post('/api/register-staff', async (req, res) => {
  const { name, lastname, phoneNumber, email, username, password, permission } = req.body;

  try {
    // Generate new staff ID
    const lastStaff = await Staff.findOne().sort({ staffID: -1 }).exec();
    let newStaffID = 'DOG001';
    if (lastStaff) {
      const lastIDNum = parseInt(lastStaff.staffID.replace('DOG', ''), 10);
      newStaffID = `DOG${(lastIDNum + 1).toString().padStart(3, '0')}`;
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

    res.status(201).json({ message: 'Staff registered successfully!' });
  } catch (error) {
    console.error('Error registering staff:', error);
    res.status(500).json({ message: 'Error registering staff' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
