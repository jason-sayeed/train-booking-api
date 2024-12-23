import { RequestHandler } from 'express';
import Train from '../models/trainModel';
import Route from '../models/routesModel';
import {
  sendError,
  sendSuccess,
} from '../utils/responseHelper';

export const searchTrains: RequestHandler = async (
  req,
  res,
): Promise<void> => {
  try {
    const { startStation, endStation, date } = req.query;

    if (!startStation || !endStation || !date) {
      return sendError(
        res,
        'Route and date are required',
        400,
      );
    }

    const searchDate = date as string;

    // Find the route object for the provided startStation and endStation
    const route = await Route.findOne({
      startStation,
      endStation,
    });

    if (!route) {
      return sendError(res, 'Route not found', 404);
    }

    const trains = await Train.find({
      route: route._id, // Match the route by ObjectId
      availableDates: {
        $in: [searchDate], // Check if the train operates on this date
      },
    });

    if (trains.length === 0) {
      return sendError(
        res,
        'No trains found for the specified route and date',
        404,
      );
    }

    // Return relevant train data: departure time, arrival time, available seats
    const result = trains.map((train) => ({
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      availableSeats: train.availableSeats,
    }));

    return sendSuccess(res, result);
  } catch (error: unknown) {
    return sendError(
      res,
      'Error searching for trains',
      500,
    );
  }
};
