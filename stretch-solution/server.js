const express = require("express");
const cors = require("cors");
const dogs = require("./handlers/dogs");
const users = require("./handlers/users");
const logger = require("./middleware/logger");
const verifyUser = require("./middleware/auth");
const handleError = require("./middleware/error");

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());
server.use(express.json());
server.use(logger);

server.get("/v1/dogs", dogs.getAll);
server.get("/v1/dogs/:id", dogs.get);
server.post("/v1/dogs/", verifyUser, dogs.post);
server.put("/v1/dogs/:id", verifyUser, dogs.put);
server.delete("/v1/dogs/:id", verifyUser, dogs.del);

server.get("/v1/users/:id", users.post);
server.post("/v1/users", users.post);
server.put("/v1/users/:id", users.put);
server.delete("/v1/users/:id", users.del);
server.post("/v1/users/login", users.login);

server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
