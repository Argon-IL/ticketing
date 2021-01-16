import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const result = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(result.get('Set-Cookie')).toBeDefined();

  const result2 = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);

  expect(result2.get('Set-Cookie')[0].split(';')[0]).toEqual('express:sess=');
});
