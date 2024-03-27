const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./../middleware/authmiddleware')
const Datastore = require('./../database/database');
const { generateToken, comparePassword, verifyToken } = require('./../utility/helper');

const multer = require('multer')
router.use(isAuthenticated)
router.get('/userData' , async (req, res) => {
    try {
        const email = res.locals.email;
        const user = await Datastore.getUser({
            email: email
        })
        const userData = {
            ...user
        }
        delete userData.hashedPassword
        res.send(userData).status(200);
    } catch (error) {
        console.error(error);
        res.status(404).send(error.message)
    }
});

router.patch('/userData', multer({
    dest: 'files/'
}).single('photo'), async (req, res) => {
    try {
        const email = res.locals.email;
        const password = res.locals.password;
        if(req.file)
            req.body.photo = req.file
        console.log(req.body);
        const user = await Datastore.updateUser(email, req.body)
        const authPayload= {};
        if(req.body.email){
            authPayload['email'] = req.body.email;
        } else 
            authPayload['email'] = email;
        if(req.body.pasword){
            authPayload['pasword'] = req.body.pasword;
        } else 
            authPayload['pasword'] = password;

        if(req.body.email || req.body.pasword){
            const token=generateToken(authPayload);
            res.cookie('session_token', token);
        }
        const userData = {
            ...user
        };
        delete userData.hashedPassword
        res.send(userData).status(200);
    } catch (error) {
        console.error(error);
        res.status(404).send(error.message)
    }
})

router.get('/users', async (req, res) =>{
    try {
        const email = res.locals.email;
        const users = await Datastore.getAllUsers(email)

        res.send(users).status(400);
    } catch (error) {
        console.error(error);
        res.status(404).send(error.message)
    }
})

module.exports = router;