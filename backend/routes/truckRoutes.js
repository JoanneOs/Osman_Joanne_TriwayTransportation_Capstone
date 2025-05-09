import express from 'express';
import asyncHandler from 'express-async-handler';
import Truck from '../models/TruckModel.js';
import { validateTruckInput } from '../validation/truckValidation.js';

const router = express.Router();

router.get('/', asyncHandler(async (req, res) => {
  const { status, location, page = 1, limit = 10 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (location) query['currentLocation.address'] = new RegExp(location, 'i');
  const trucks = await Truck.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });
  const count = await Truck.countDocuments(query);
  res.json({
    trucks,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const truck = await Truck.findById(req.params.id);
  if (!truck) {
    res.status(404);
    throw new Error('Truck not found');
  }
  res.json(truck);
}));

router.post('/', asyncHandler(async (req, res) => {
  const { errors, isValid } = validateTruckInput(req.body);
  if (!isValid) {
    res.status(400);
    throw new Error(Object.values(errors).join(' '));
  }
  const truck = new Truck(req.body);
  const createdTruck = await truck.save();
  res.status(201).json(createdTruck);
}));

export default router;
