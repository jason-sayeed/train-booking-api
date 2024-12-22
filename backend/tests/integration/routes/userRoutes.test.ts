import request from 'supertest';
import app from '../../../src/app';
import User from '../../../src/models/userModel';
import '../../mongodb_helper';

describe('User Routes', () => {
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    await User.deleteMany();
  });

  describe('POST /users', () => {
    it('should create a new user and return 201', async (): Promise<void> => {
      const res = await request(app)
        .post('/users')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(userData.name);
      expect(res.body.email).toBe(userData.email);
    });

    it('should return 400 if required fields are missing', async (): Promise<void> => {
      const res = await request(app)
        .post('/users')
        .send({ email: userData.email });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        'Name, email, and password are required',
      );
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async (): Promise<void> => {
      const user = await User.create(userData);

      const res = await request(app).get(
        `/users/${user._id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(userData.name);
      expect(res.body.email).toBe(userData.email);
    });
  });

  describe('GET /users', () => {
    it('should return all users', async (): Promise<void> => {
      await User.create(userData);
      await User.create({
        ...userData,
        email: 'janedoe@example.com',
      });

      const res = await request(app).get('/users');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user and return the updated user', async (): Promise<void> => {
      const user = await User.create(userData);

      const res = await request(app)
        .put(`/users/${user._id}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe('Updated Name');
    });

    it('should return 400 if the user is not found', async (): Promise<void> => {
      const res = await request(app)
        .put('/users/invalid-id')
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid ID format');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user by ID and return a success message', async (): Promise<void> => {
      const user = await User.create(userData);

      const res = await request(app).delete(
        `/users/${user._id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        'User successfully deleted',
      );
    });

    it('should return 400 if the user is not found', async (): Promise<void> => {
      const res = await request(app).delete(
        '/users/invalid-id',
      );

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid ID format');
    });
  });
});
