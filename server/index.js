const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/routemaster';

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB via Docker Network"))
  .catch(err => console.error("MongoDB Connection Error:", err));

const shipmentSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['In Transit', 'Out for Delivery', 'Delivered'], 
    default: 'In Transit' 
  },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  location: { type: String, default: 'Warehouse' }
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);

app.get('/', (req, res) => res.send("RouteMaster API is live and containerized!"));

app.get('/shipments', async (req, res) => {
  try {
    const data = await Shipment.find().sort({ updatedAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch shipments from Database" });
  }
});

app.post('/shipments', async (req, res) => {
  try {
    const newShipment = new Shipment(req.body);
    await newShipment.save();
    res.status(201).json(newShipment);
  } catch (err) {
    res.status(400).json({ error: "Duplicate Tracking ID or Missing Required Fields" });
  }
});

app.put('/shipments/:id', async (req, res) => {
  try {
    const { status, location } = req.body;
    const updated = await Shipment.findByIdAndUpdate(
      req.params.id, 
      { status, location }, 
      { new: true, runValidators: true } // Ensures new status is one of the Enum values
    );
    if (!updated) return res.status(404).json({ error: "Shipment not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update shipment status" });
  }
});

app.delete('/shipments/:id', async (req, res) => {
  try {
    const deleted = await Shipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Shipment not found" });
    res.json({ message: "Shipment successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error during deletion" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));