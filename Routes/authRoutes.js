const express = require('express');
const router = express.Router();
const Datastore = require('./../database/database');
const { generateToken, comparePassword, verifyToken } = require('../utility/helper');
const { isAuthenticated } = require('../middleware/authmiddleware');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('../utility/constants');
const {google} = require('googleapis');

// authController.registerUser
router.post('/register', async (req, res) => {
    try {
        const {name, email, password, isAdmin, isPublic} = req.body;
        if(!name)
            throw new Error('Name is required');
        else if(!email)
            throw new Error('Email is required');
        else if(!password)
            throw new Error('Password is required');
        if(isPublic === true)
            req.body.profileVisibility = 'public'
        else if(isPublic === false)
            req.body.profileVisibility = 'private'
        const newUser = await Datastore.addUser(req.body);
        const token=generateToken(req.body);
        res.cookie('session_token', token);
        res.json({
            'message': 'user has been registered',
            'user': newUser,
        }).status(200);
    } catch (error) {
        console.error(error);
        res.status(404).send(error.message)
    }
});
// router.post('/login', authController.loginUser);
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email)
            throw new Error('Email is required');
        else if(!password)
            throw new Error('Password is required');
        const user = await Datastore.getUser(req.body)
        const isPasswordValid = await comparePassword(password, user.hashedPassword);
        if(isPasswordValid){
            const token = generateToken(req.body);
            res.cookie('session_token', token);
            res.status(200).redirect('/userData')
        } else {
            res.status(400).send('Password or email is invalid')
        }
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});
router.get('/google', async (req, res) => {
    try {
        const redirectURL = "http://localhost:3000/auth/google/callback"
        console.log(redirectURL)
        
        const oAuth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            redirectURL
        );
        const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];
        const url = oAuth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
          scope: SCOPES
          });
        res.send(url);
    } catch (error) {
        console.log(error)
    }
});

router.get('/google/callback', async (req, res) => {
    try {
        console.log('google auth query',req.query)
        const code = req.query.code;
        const redirectURL = "http://localhost:3000/auth/google/callback"
        
        const oAuth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            redirectURL
        );
        const tokenResponse = await oAuth2Client.getToken(code);
        console.log('token response',tokenResponse);
        const {tokens} = tokenResponse;
        
        const access_token = tokens.access_token;
        const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
            method: 'GET',
            headers:{
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        })
        // const data = await response.;
        const data = await response.json();
        const {email, id} = data;
        req.body.email = email;
        req.body.password=id;
        req.body.profileVisibility = 'public';
        req.body.isAdmin = false;

        const newUser = await Datastore.addUser(req.body);
        const token=generateToken(req.body);
        res.cookie('session_token', token);
        res.redirect('/userData')
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});
// router.post('/logout', authController.logoutUser);
router.get('/logout', isAuthenticated, (req, res) => {
    try {
        const sessionToken = req.cookies['session_token'];
        res.clearCookie('session_token');
        res.send(`cookie ${sessionToken} has been cleared`).status(200);
    } catch (error) {
        console.error(error);
        res.status(404).send(error.message)
        
    }
});

module.exports = router;