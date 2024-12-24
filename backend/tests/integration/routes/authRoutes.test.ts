import request from 'supertest';
import { app } from '../../../src/app';
import User from '../../../src/models/userModel';
import '../../mongodb_helper';

describe('Auth Routes', () => {
  const userData = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'password123',
  };

  afterEach(async (): Promise<void> => {
    await User.deleteMany();
  });

  describe('POST /auth/login', () => {
    // it('should login successfully and redirect to /auth/profile', async (): Promise<void> => {
    //   await User.create(userData);
    //
    //   const agent = request.agent(app);
    //
    //   const res = await agent.post('/auth/login').send({
    //     email: userData.email,
    //     password: userData.password,
    //   });
    //
    //   expect(res.status).toBe(302);
    //   expect(res.headers.location).toBe('/auth/profile');
    // });

    it('should redirect to auth/login for invalid credentials', async (): Promise<void> => {
      await User.create(userData);

      const res = await request(app)
        .post('/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/auth/login');
    });
  });

  describe('GET /auth/login', () => {
    it('should display login message', async (): Promise<void> => {
      const res = await request(app).get('/auth/login');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        'Please login with correct credentials.',
      );
    });
  });

  describe('GET /auth/logout', () => {
    it('should logout successfully and redirect to /auth/login', async (): Promise<void> => {
      const agent = request.agent(app);
      await User.create(userData);

      await agent.post('/auth/login').send({
        email: userData.email,
        password: userData.password,
      });

      const res = await agent.get('/auth/logout');

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/auth/login');
    });
  });

  describe('GET /auth/profile', () => {
    // it('should return user profile if authenticated', async (): Promise<void> => {
    //   const agent = request.agent(app);
    //   const user = await User.create(userData);
    //
    //   await agent.post('/auth/login').send({
    //     email: userData.email,
    //     password: userData.password,
    //   });
    //
    //   const res = await agent.get('/auth/profile');
    //
    //   expect(res.status).toBe(200);
    //   expect(res.body).toHaveProperty(
    //     'id',
    //     user._id.toString(),
    //   );
    //   expect(res.body.name).toBe(userData.name);
    //   expect(res.body.email).toBe(userData.email);
    // });

    it('should return 302 if not authenticated', async (): Promise<void> => {
      const res = await request(app).get('/auth/profile');

      expect(res.status).toBe(302);
      expect(res.headers.location).toBe('/auth/login');
    });
  });
});
