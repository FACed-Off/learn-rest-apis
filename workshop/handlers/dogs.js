const model = require("../model/dogs");

function getAll(req, res, next) {
  model
    .getAllDogs()
    .then((dogs) => {
      //console.log(dogs);
      res.send(dogs);
    })
    .catch(next);
}

function get(req, res, next) {
  //console.log(req.params);
  const id = req.params.id;
  model
    .getDog(id)
    .then((dog) => res.send(dog))
    .catch(next);
}

function post(req, res, next) {
  const newDoggy = req.body;
  model
    .createDog(newDoggy)
    .then((dog) => res.status(201).send(dog))
    .catch(next);
}

function del(req, res, next) {
  const dogId = req.params.id
  model
    .deleteDog(dogId)
    .then(() => res.status(204).send())
    .catch(next)
}

module.exports = { getAll, get, post, del };
