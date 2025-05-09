import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `MG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    }
  },
  referenceNumber: { type: String },
  customer: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    name: { type: String, required: true }
  },
  mangoDetails: {
    type: {
      type: String,
      enum: ['Kent', 'Tommy Atkins', 'Haden', 'Keitt', 'Other'],
      required: true
    },
    variety: String,
    qualityGrade: { type: String, enum: ['Premium', 'Grade A', 'Grade B'] },
    quantity: {
      value: { type: Number, required: true, min: 100 },
      unit: { type: String, default: 'kg' }
    },
    packaging: {
      type: { type: String, enum: ['crates', 'boxes', 'pallets'] },
      count: Number
    }
  },
  route: {
    origin: {
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
      },
      address: { type: String, required: true },
      contact: {
        name: String,
        phone: String
      },
      scheduledDate: { type: Date, required: true }
    },
    destination: {
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
      },
      address: { type: String, required: true },
      contact: {
        name: String,
        phone: String
      },
      scheduledDate: { type: Date }
    },
    waypoints: [{
      sequence: Number,
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] }
      },
      address: String,
      action: { type: String, enum: ['pickup', 'delivery', 'stop'] }
    }],
    distance: { type: Number }, // in km
    estimatedDuration: { type: Number } // in minutes
  },
  assignedTruck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  status: {
    type: String,
    enum: [
      'pending',
      'dispatched',
      'in-progress',
      'on-hold',
      'delivered',
      'cancelled',
      'problem'
    ],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    changedBy: String,
    timestamp: { type: Date, default: Date.now },
    notes: String
  }],
  documents: [{
    type: { type: String, enum: ['invoice', 'pod', 'permit'] },
    url: String,
    reference: String
  }],
  billing: {
    rate: Number,
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['unbilled', 'billed', 'paid'], default: 'unbilled' }
  },
  notes: [{
    content: String,
    createdBy: String,
    createdAt: { type: Date, default: Date.now }
  }],
  temperatureLogs: [{
    timestamp: { type: Date, default: Date.now },
    temperature: Number,
    recordedBy: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
shipmentSchema.index({ shipmentId: 1 }, { unique: true });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ 'route.origin.location.coordinates': '2dsphere' });
shipmentSchema.index({ 'route.destination.location.coordinates': '2dsphere' });

// Pre-save hook to update status history
shipmentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory = this.statusHistory || [];
    this.statusHistory.push({
      status: this.status,
      changedBy: 'system' // Would be actual user in real app
    });
  }
  next();
});

export default mongoose.model('Shipment', shipmentSchema);