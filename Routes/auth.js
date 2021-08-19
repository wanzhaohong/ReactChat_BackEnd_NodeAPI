const router = require('express').Router();
const User = require('../Models/User');

//other packages for authentication
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerValidation, loginValidation } = require('../validation/validation');

//register
router.post('/register', async (request, response) => {
    //Validate data before create a new user
    const { error } = registerValidation(request.body);
    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    // Check if the registered user is already in the database.
    const nameExist = await User.findOne({ username: request.body.username });
    if (nameExist) {
        return response.status(400).send('The current username already exists in the database.');
    }

    // Hash the current password.
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(request.body.password, salt);

    // Assign the current user's info and save it into the MongoDB.
    const user = new User({
        username: request.body.username,
        password: hashPassword
    });

    try {
        const saveUser = await user.save();
        response.json(saveUser);
    } catch (err) {
        response.status(400).send(err);
    }
});

// For Login
router.post('/login', async (request, response) => {
    //Validate data before login
    const { error } = loginValidation(request.body);
    if (error) {
        return response.status(400).send(error.details[0].message);
    }

    // Check if the username exists in the database.
    const user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).send('The current username does not exists in the database.');
    }

    // Check if the password correct.
    const validPassword = await bcrypt.compare(request.body.password, user.password);
    if (!validPassword) {
        return response.status(400).send('Invalid password.')
    }
    // Create and assign a token, so it can represent that we have logged in already.
    response.status(200).send(user);
});

module.exports = router;