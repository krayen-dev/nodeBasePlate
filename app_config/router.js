const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const serviceAccount = require('../firebase/event-calendar-firebase.json');
const { initializeApp } = require('firebase-admin/app');
// const app = initializeApp();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const { getAuth } = require('firebase-admin/auth');
const HttpStatus = require('http-status-codes');

// Validate JWT Token
router.use(async function (req, res, next) {
    const usertoken = req.headers.authorization;
    const token = usertoken.split(' ');

    try {
        const response = await getAuth().verifyIdToken(token[1]);
        next();
    } catch (error) {
        console.log(error);
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send({
            success: false,
            message: HttpStatus.ReasonPhrases.UNAUTHORIZED,
        });
    }
});

const user = require('../app/controllers/user');

// Router for User
router.post('/signup', user.signUp); // create user
router.post('/invite', user.inviteUser); // invite user
router.get('/users', user.getUsersbyCustomer); // get users by customerId


module.exports = router;