import { RequestHandler } from 'express';
import Train from '../models/trainModel';
import { handleError } from '../utils/handleError';
import {
  sendError,
  sendSuccess,
} from '../utils/responseHelper';

export const createTrain: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const { name, route, capacity, schedule } = req.body;

    if (!name || !route || !capacity || !schedule) {
      return sendError(
        res,
        'Name, route, capacity, and schedule are required',
        400,
      );
    }

    const newTrain = await Train.create({
      name,
      route,
      capacity,
      schedule,
    });

    return sendSuccess(res, newTrain, 201);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const getTrain: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return sendError(res, 'Train not found', 404);
    }
    return sendSuccess(res, train);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const updateTrain: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const updatedTrain = await Train.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedTrain) {
      return sendError(res, 'Train not found', 404);
    }
    return sendSuccess(res, updatedTrain);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const deleteTrain: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const deletedTrain = await Train.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedTrain) {
      return sendError(res, 'Train not found', 404);
    }
    return sendSuccess(res, {
      message: 'Train successfully deleted',
    });
  } catch (error: unknown) {
    return handleError(res, error);
  }
};

export const getAllTrains: RequestHandler = async (
  _req,
  res,
): Promise<void> => {
  try {
    const trains = await Train.find();
    return sendSuccess(res, trains);
  } catch (error: unknown) {
    return handleError(res, error);
  }
};
