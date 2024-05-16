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

// Post contact info
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

//Fetch Hotel Data
const roomTypeSchema = new mongoose.Schema({}, { collection: 'roomtypes' });

const RoomType = mongoose.model('RoomType', roomTypeSchema);

app.get('/api/roomtypes', async (req, res) => {
  try {
    const roomTypes = await RoomType.find({}, 'price types capacity image children _id'); // Fetch only roomID and clean_status fields
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const roomCleanSchema = new mongoose.Schema({
  clean: String,
  room: String
}, { collection: 'roomtypes' }); // This tells Mongoose to use the exact collection name

const roomClean = mongoose.model('RoomClean', roomCleanSchema);

app.get('/api/roomclean', async (req, res) => {
  try {
    // Modify this line to filter for rooms that are marked as available
    const roomCleans = await roomClean.find({ clean: "NO" });
    res.json(roomCleans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room clean status
app.put('/api/roomclean/:roomId', async (req, res) => {
  const roomId = req.params.roomId;
  const { clean } = req.body;
  try {
    const updatedRoom = await roomClean.findByIdAndUpdate(roomId, { clean }, { new: true });
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
}, { collection: 'username' });
const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
