const { generateToken, comparePassword, verifyToken } = require('../utility/helper');

const isAuthenticated = async (req, res, next) => {
    console.log(req.body);
    try {
        const sessionToken = req.cookies['session_token'];
        if (!sessionToken) {
            return res.status(401).send('Session token not defined');
        }
        const payload = await verifyToken(sessionToken);
        res.locals.email = payload.email;
        res.locals.password = payload.password;
        next();
    } catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
};

module.exports = {
    isAuthenticated
}