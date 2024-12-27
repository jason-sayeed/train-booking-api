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
    const {
      startStation,
      endStation,
      date,
      numberOfSeatsRequested,
    } = req.query;

    const seatCount: number = parseInt(
      numberOfSeatsRequested as string,
      10,
    );

    const route = await Route.findOne({
      startStation,
      endStation,
    });

    if (!route) {
      return sendError(res, 'Route not found', 404);
    }

    const trains = await Train.find({
      route: route._id,
      operatingDate: new Date(date as string),
      availableSeats: { $gte: seatCount },
    });

    if (!trains.length) {
      return sendError(
        res,
        'No trains found for the specified route, date and seat count',
        404,
      );
    }

    const trainsWithSeats = trains.map((train) => ({
      trainId: train._id.toString(),
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
      availableSeats: train.availableSeats,
    }));

    return sendSuccess(res, trainsWithSeats);
  } catch (error: unknown) {
    return sendError(
      res,
      'Error searching for trains',
      500,
    );
  }
};
