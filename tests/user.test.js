const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = require('../src/app');
const User = require('../src/models/user');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Bryan',
    email: 'bryan@email.com',
    password: 'n3udew9g4G%$q23r',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Daniel',
        email: 'abre.go@outlook.com',
        password: 'abc1dsds25',
    }).expect(201);

    // Assert db was mutated correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Daniel',
            email: 'abre.go@outlook.com',
        },
        token: user.tokens[0].token,
    });

    expect(user.password).not.toBe('abc1dsds25');
});

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    // Assert token in response matches the second token
    const user = await User.findById(response.body.user._id);
    const secondToken = user.tokens[1].token;
    expect(response.body.token).toBe(secondToken);
});

test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'email-that@doesnt.exist.com',
        password: 'hu324f8349hg'
    }).expect(400);
});

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test('Shouldn\'t get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
});

test('Should delete account for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // Assert user is no longer on db
    const user = await User.findById(response.body._id);
    expect(user).toBeNull();
});

test('Shouldn\'t delete account for unauthenticated user', async () => {
    request(app)
        .delete('/users/me')
        .send()
        expect(401);
});