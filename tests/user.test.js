const request = require('supertest');
const app = require('../src/app');

test('Should signup a new user', async () => {
    await request(app).post('/users').send({
        name: 'Daniel',
        email: 'abre.go@outlook.com',
        password: 'abc1dsds25',
    }).expect(201);
});