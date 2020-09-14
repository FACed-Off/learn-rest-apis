const express = require("express");
const dogs = require("./handlers/dogs");
const handleError = require("./middleware/error");

const PORT = process.env.PORT || 3000;

const server = express();

server.use(express.json());

server.get("/dogs", dogs.getAll);
server.get("/dogs/:id", dogs.get);
server.post("/dogs", dogs.post);

server.use(handleError);

server.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
