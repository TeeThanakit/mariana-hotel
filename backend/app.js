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
}, { collection: 'contact_us', versionKey: false });

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

const contactviewSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
}, { collection: 'contact_us', versionKey: false });

const contactView = mongoose.model('contactView', contactviewSchema);

app.get('/api/contactview', async (req, res) => {
  try {
    const contactViews = await contactView.find({});
    res.json(contactViews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const roomTypeSchema = new mongoose.Schema({}, { collection: 'roomtypes', versionKey: false });

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
}, { collection: 'booking', versionKey: false });

const roomSchema = new mongoose.Schema({
  room: String,
  price: String,
  types: String,
  capacity: String,
  children: String,
  image: String,
  clean: String,
}, { collection: 'roomtypes', versionKey: false });

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
      //console.log(`Existing bookings for room ${room.room}:`, existingBookings);

      const overlappingBooking = existingBookings.find(existingBooking => {
        const existingCheckIn = new Date(existingBooking["check-in_date"]);
        const existingCheckOut = new Date(existingBooking["check-out_date"]);
        
        // Check if there is an overlap with the new booking dates
        return !(checkIn >= existingCheckOut || checkOut <= existingCheckIn);
      });

      //console.log(`Room ${room.room} overlapping booking:`, overlappingBooking);
      return overlappingBooking ? null : room;
    });

    const availableRoomsFiltered = (await Promise.all(availabilityPromises)).filter(room => room !== null);
    //console.log('Filtered available rooms:', availableRoomsFiltered);

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
}, { collection: 'roomtypes', versionKey: false });

const RoomClean = mongoose.model('RoomClean', roomCleanSchema);

app.get('/api/roomclean', async (req, res) => {
  try {
    const roomCleans = await RoomClean.find({});
    res.json(roomCleans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/roomclean/:room', async (req, res) => {
  const room = req.params.room;
  const { clean } = req.body;
  try {
    const updatedRoom = await RoomClean.findOneAndUpdate(
      { room: room },
      { clean: clean },
      { new: true }
    );
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
}, { collection: 'credential', versionKey: false });

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: "Login successful", username: user.username, role: user.role });
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
}, { collection: 'credential', versionKey: false });

const staffSchema = new mongoose.Schema({
  staffID: String,
  name: String,
  lastName: String,
  email: String,
  tel: String,
}, { collection: 'staff', versionKey: false });

const Credential = mongoose.model('Credential', credentialSchema);
const Staff = mongoose.model('Staff', staffSchema);

const roleSchema = new mongoose.Schema({
  staffID: String,
  role: String
}, { collection: 'credential' }); // Adjust collection name as per your setup
const Role = mongoose.model('Role', roleSchema);

// Route to fetch staff information
app.get('/api/staff', async (req, res) => {
  try {
    // Use aggregation to join staff and credentials collections
    const staffWithRoles = await Staff.aggregate([
      {
        $lookup: {
          from: 'credential',
          localField: 'staffID',
          foreignField: 'staffID',
          as: 'credentials'
        }
      },
      {
        $unwind: {
          path: '$credentials',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          staffID: 1,
          name: 1,
          lastName: 1,
          email: 1,
          tel: 1,
          role: { $ifNull: ['$credentials.role', 'Unknown'] },
          username: '$credentials.username'
        }
      }
    ]);

    res.json(staffWithRoles);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: error.message });
  }
});



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

// Define schema for financial data
const financialSchema = new mongoose.Schema({
  date: Date,
  revenue: Number,
  expenses: Number,
  profit: Number,
}, { versionKey: false });

// Create a model for financial data
const Financial = mongoose.model('Financial', financialSchema);

// Route to fetch financial data
app.get('/api/financial', async (req, res) => {
  try {
    const financialData = await Financial.find();
    res.json(financialData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  customerID: String
}, { collection: 'customer', versionKey: false });

const paymentSchema = new mongoose.Schema({
  roomPrice: Number,
  name: String,
  paymentType: String,
  timestamp: { type: Date, default: Date.now },
  paymentID: String,
}, { collection: 'payment', versionKey: false });

const bookTestSchema = new mongoose.Schema({
  "check-in_date": Date,
  "check-out_date": Date,
  room: String,
  paymentID: String,
  customerID: String,
}, { collection: 'booking', versionKey: false });

const Customer = mongoose.model('Customer', customerSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const BookTest = mongoose.model('BookTest', bookTestSchema);

const generateRandomID = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

app.post('/api/bookings', async (req, res) => {
  const { name, email, phone, paymentType, roomId, checkInDate, checkOutDate, room, roomType, roomPrice } = req.body;

  const customerID = phone;
  const paymentID = generateRandomID(12);

  const customer = new Customer({
    name,
    email,
    phone,
    customerID
  });

  const payment = new Payment({
    roomPrice,
    name,
    paymentType,
    paymentID
  });

  const booking = new BookTest({
    "check-in_date": new Date(checkInDate),
    "check-out_date": new Date(checkOutDate),
    room,
    paymentID,
    customerID
  });

  try {
    await customer.save();
    await payment.save();
    await booking.save();
    res.status(201).json({ message: 'Booking confirmed and data saved successfully' });
  } catch (error) {
    console.error('Error saving booking data:', error);
    res.status(500).json({ message: 'Error saving booking data' });
  }
});

//const Payment = mongoose.model('Payment', paymentSchema);

const paymentviewSchema = new mongoose.Schema({
  roomPrice: Number,
  name: String,
  paymentType: String,
  paymentID: String,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'payment', versionKey: false });

const PaymentView = mongoose.model('PaymentView', paymentviewSchema);

app.get('/api/paymentview', async (req, res) => {
  try {
    const paymentViews = await PaymentView.find({});
    //console.log("Sending payment data:", paymentViews);  // Log data being sent
    res.json(paymentViews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const bookingviewSchema = new mongoose.Schema({
  "check-in_date": { type: Date, default: Date.now },
  "check-out_date": { type: Date, default: Date.now },
  room: String,
  paymentID: String,
  customerID: String,
}, { collection: 'booking', versionKey: false });

const BookingView = mongoose.model('BookingView', bookingviewSchema);

app.get('/api/bookinfview', async (req, res) => {
  try {
    const bookingViews = await BookingView.find({});
    //console.log("Sending payment data:", bookingViews);  // Log data being sent
    res.json(bookingViews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
