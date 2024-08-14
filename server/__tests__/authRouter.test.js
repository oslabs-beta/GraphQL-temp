const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/authRouter'); // Adjust the path as necessary
const userController = require('../controllers/userController');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use('/api/auth', authRouter);

// Mock userController functions
jest.mock('../controllers/userController', () => ({
    hashing: (req, res, next) => next(),
    createUser: (req, res, next) => {
        res.locals.user = { username: 'testuser', id: 1 };
        next();
    },
    signJWT: (req, res, next) => {
        res.locals.user.token = 'fake-jwt-token';
        next();
    },
    loginUser: (req, res, next) => {
        res.locals.user = { username: 'testuser', id: 1, token: 'fake-jwt-token' };
        next();
    },
    validateJWT: (req, res, next) => {
        res.locals.user = { username: 'testuser', id: 1 };
        next();
    }
}));

describe('Auth Router', () => {
    // Test Creating new user and if user object with token
    describe('POST /signup', () => {
        it('should create a new user and return user object with token', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', 'testuser');
            expect(response.body).toHaveProperty('token', 'fake-jwt-token');
        });
    });
    // Test user login and return user object with token
    describe('POST /login', () => {
        it('should login user and return user object with token', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({ username: 'testuser', password: 'password123' });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', 'testuser');
            expect(response.body).toHaveProperty('token', 'fake-jwt-token');
        });
    });
    // Test if user has been authenticated and accessible to proceed on protected routes
    describe('POST /protected', () => {
        it('should access protected route with valid token', async () => {
            const response = await request(app)
                .post('/api/auth/protected')
                .set('Authorization', 'Bearer fake-jwt-token')
                .send();

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('username', 'testuser');
        });
    });
});
