import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: String,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
