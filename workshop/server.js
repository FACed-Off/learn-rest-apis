const express = require("express");
const dogs = require("./handlers/dogs");
const users = require("./handlers/users")
const handleError = require("./middleware/error");
const verifyUser = require("./middleware/auth")

const PORT = process.env.PORT || 3000;

const server = express();

server.use(express.json());

server.get("/dogs", dogs.getAll);
server.get("/dogs/:id", dogs.get);
server.post("/dogs", verifyUser, dogs.post);
server.delete("/dogs/:id", verifyUser, dogs.del);
server.post("/users", users.post);
server.post("/login", users.login);

server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
