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
const roomTypeSchema = new mongoose.Schema({
  price: String,
  types: String,
  available: String
}, { collection: 'roomtypes' }); // This tells Mongoose to use the exact collection name

const RoomType = mongoose.model('RoomType', roomTypeSchema);

app.get('/api/roomtypes', async (req, res) => {
  try {
    const roomTypes = await RoomType.find(); // This queries all documents in the roomtypes collection
    res.json(roomTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Server setup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
