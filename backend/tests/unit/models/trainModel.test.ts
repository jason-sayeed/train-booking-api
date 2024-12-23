import Train from '../../../src/models/trainModel';
import '../../mongodb_helper';

describe('Train Model', () => {
  beforeEach(async () => {
    await Train.deleteMany({});
  });

  it('should create and save a train successfully', async (): Promise<void> => {
    const train = new Train({
      name: 'Express Train',
      capacity: 100,
      routes: [],
    });

    const savedTrain = await train.save();

    expect(savedTrain._id).toBeDefined();
    expect(savedTrain.name).toBe('Express Train');
    expect(savedTrain.capacity).toBe(100);
    expect(savedTrain.routes).toEqual([]);
  });

  it('should not save a train without a name', async (): Promise<void> => {
    const train = new Train({
      capacity: 100,
      routes: [],
    });

    await expect(train.save()).rejects.toThrow(
      'Train name is required',
    );
  });

  it('should not save a train without a capacity', async (): Promise<void> => {
    const train = new Train({
      name: 'Express Train',
      routes: [],
    });

    await expect(train.save()).rejects.toThrow(
      'Train capacity is required',
    );
  });

  it('should not save a train with a capacity less than 1', async (): Promise<void> => {
    const train = new Train({
      name: 'Express Train',
      capacity: 0,
      routes: [],
    });

    await expect(train.save()).rejects.toThrow(
      'There must be at least one seat on the train',
    );
  });

  it('should update a train successfully', async (): Promise<void> => {
    const train = new Train({
      name: 'Express Train',
      capacity: 100,
      routes: [],
    });

    const savedTrain = await train.save();

    await Train.updateOne(
      { _id: savedTrain._id },
      { name: 'Updated Express Train' },
    );

    const updatedTrain = await Train.findById(
      savedTrain._id,
    );
    expect(updatedTrain?.name).toBe(
      'Updated Express Train',
    );
  });

  it('should delete a train by ID', async () => {
    const train = new Train({
      name: 'Express Train',
      capacity: 100,
      routes: [],
    });

    const savedTrain = await train.save();

    const result = await Train.deleteOne({
      _id: savedTrain._id,
    });
    expect(result.deletedCount).toBe(1);
  });

  it('should not allow a train with duplicate name', async () => {
    const trainData1 = {
      name: 'Express Train',
      capacity: 100,
      routes: [],
    };
    const trainData2 = {
      name: 'Express Train',
      capacity: 120,
      routes: [],
    };

    const train1 = new Train(trainData1);
    await train1.save();

    const train2 = new Train(trainData2);
    await expect(train2.save()).rejects.toThrow(
      'duplicate key error',
    );
  });
});
