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

    const route = await Route.findOne({
      startStation,
      endStation,
    });

    if (!route) {
      return sendError(res, 'Route not found', 404);
    }

    const trains = await Train.find({
      route: route._id,
      'availableDates.date': {
        $in: date as string,
      },
    });

    if (!trains.length) {
      return sendError(
        res,
        'No trains found for the specified route and date',
        404,
      );
    }

    const trainsWithSeats = trains.flatMap((train) => {
      return train.availableDates
        .map((dateObj) => ({
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
          availableSeats: dateObj.availableSeats,
        }))
        .filter(
          (dateObj): boolean => dateObj.availableSeats > 0,
        );
    });

    if (!trainsWithSeats.length) {
      return sendError(
        res,
        'No trains available for the specified date and route',
        404,
      );
    }

    return sendSuccess(res, trainsWithSeats);
  } catch (error: unknown) {
    return sendError(
      res,
      'Error searching for trains',
      500,
    );
  }
};
