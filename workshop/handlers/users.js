const model = require("../model/users")
const dotenv = require("dotenv")
require("dotenv").config();
const SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

function post (req, res, next) {
    const user = req.body
    model
        .createUser(user)
        .then((user) => {
            const accessToken = jwt.sign({userId: user.id}, SECRET, { expiresIn: "1h" });
            const response = {
                id: user.id,
                email: user.email,
                name: user.name,
                accessToken
            }
            res.status(201).send(response)
        })
        .catch(next)
}

function login (req, res, next) {
    const user = req.body;
    const email = user.email;
    const password = user.password;
    model
        .getUser(email)
        .then((dbUser) => {
            if (dbUser.password == password) {
                const accessToken = jwt.sign({userId: dbUser.id}, SECRET, { expiresIn: "1h"})
                res.status(200).send({accessToken})
            } else {
                const error = new Error("Unauthorised");
                error.status = 401;
                next(error)
            }
        })
        .catch(next)
}

module.exports = { post, login }