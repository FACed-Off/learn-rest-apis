const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;
const model = require("../model/users")


function verifyUser (req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        const error = new Error("bad request")
        error.status = 400
        next(error)
    } else {
        const authJWT = authHeader.replace("Bearer ", "")
        jwt.verify(authJWT, SECRET, (err, jwt) => {
            if (err) {
                const error = new Error("bad access token")
                error.status = 401
                next(error)
            } else if (jwt) {
                model
                    .getUserById(jwt.userId)
                    .then((user) => {
                        req.user = user
                        next();
                    })
                    .catch(next)
            }
        })
    }
}

module.exports = verifyUser;