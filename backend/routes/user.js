const express = require("express");
const User = require('../models/user');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const storage = require('../utils/multer-storage');
const user = require("../models/user");
const checkAuth = require("../middleware/check-auth");

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            const userResult = {id: result._id, name: result.name, email: result.email, picture: result.picture};
            const token = jwt.sign(
                userResult, 
                process.env.SECRET_KEY_TOKEN, 
                {expiresIn: '1h' });
            res.status(201).json({
                message: 'User created',
                token: token,
                user: userResult,
                expiresIn: 3600
            });
        }).catch(error => {
            res.status(500).json({
                error: error
            });
        });
    }, error => {
        res.status(500).json({
            error: "Hashing password failed !"
        });
    });
});

router.post('/signin', (req, res, next) => {
    let fetchedUser;
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                res.status(401).json({
                    message: "Auth failed"
                });
                return false;
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                res.status(401).json({
                    message: "Auth failed"
                });
                return false;
            }
            const userData = {id: fetchedUser._id, name: fetchedUser.name, email: fetchedUser.email, picture: fetchedUser.picture};
            const token = jwt.sign(
                userData, 
                process.env.SECRET_KEY_TOKEN, 
                {expiresIn: '1h' });
            return res.status(200).json({
                token: token,
                user: userData,
                expiresIn: 3600
            });
        })
        .catch(error => {
            return res.status(401).json({
                message: "Auth failed"
            });
        });
});

router.get('', checkAuth, (req, res, next) => {
    User.findOne({email: req.userData.email})
    .then(user => {
        return res.status(201).json({
            message: "User found !",
            user: {
                id: user._id,
                name: user.name,
                picture: user.picture
            }
        });
    });
});

module.exports = router;

