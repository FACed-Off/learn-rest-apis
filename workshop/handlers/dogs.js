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
  const user = req.user;
  const dog = req.body;
  dog.owner = user.id;
  model
    .createDog(dog)
    .then((dog) => {
      res.status(201).send(dog);
    })
    .catch(next);
}

function del(req, res, next) {
  const dogId = req.params.id;
  const user = req.user.id;
  model
    .getDog(dogId)
    .then((dog)=>{
      if (dog.owner == user) {
        model
          .deleteDog(dogId)
          .then(() => res.status(204).send())
          .catch(next)
      } else {
        const error = new Error("bad owner")
        error.status = 401;
        next(error)
      }
    })
}

module.exports = { getAll, get, post, del };
