import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[A-Z0-9]{6,8}$/.test(v);
      },
      message: props => `${props.value} is not a valid license plate!`
    }
  },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { 
    type: Number,
    min: 2000,
    max: new Date().getFullYear() + 1
  },
  vin: {
    type: String,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
      }
    }
  },
  fleetNumber: { type: String },
  capacity: {
    type: Number,
    required: true,
    min: 1000,
    max: 40000
  },
  temperatureControl: {
    enabled: { type: Boolean, default: false },
    minTemp: { type: Number },
    maxTemp: { type: Number }
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'in-maintenance', 'out-of-service'],
    default: 'available'
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      default: [0, 0]
    },
    address: String
  },
  mileage: { type: Number },
  lastMaintenance: { type: Date },
  nextMaintenance: { type: Date },
  insurance: {
    provider: String,
    policyNumber: String,
    expiry: Date
  },
  documents: [{
    name: String,
    url: String,
    expiry: Date,
    status: {
      type: String,
      enum: ['valid', 'expired', 'expiring-soon'],
      default: 'valid'
    }
  }],
  notes: [{
    content: String,
    createdBy: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
truckSchema.index({ licensePlate: 1 }, { unique: true });
truckSchema.index({ vin: 1 }, { unique: true, sparse: true });
truckSchema.index({ status: 1 });
truckSchema.index({ 'currentLocation.coordinates': '2dsphere' });

// Virtual for maintenance status
truckSchema.virtual('maintenanceStatus').get(function() {
  if (!this.nextMaintenance) return 'unknown';
  const daysLeft = Math.floor((this.nextMaintenance - Date.now()) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return 'overdue';
  if (daysLeft < 7) return 'due-soon';
  return 'ok';
});

export default mongoose.model('Truck', truckSchema);