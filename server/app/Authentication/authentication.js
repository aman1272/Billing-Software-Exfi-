const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Access denied, no token provided' });
        }

        jwt.verify(token, '1291999aman', (err, decoded) => {
            if (err) {
                console.log("err in jwt auth", err)
                return res.status(401).json({ error: 'Invalid token' });
            }

            req.user = decoded;
            next();
        });
    }
    catch {
        (err) => {
            res.status(501).send({ err, error: true, message: "Something went wrong" })
        }
    }
}

module.exports = verifyToken