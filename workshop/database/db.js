const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const dbPath = path.join(__dirname, "db.json");
const initialData = require("./init.json");

// create db.json if it doesn't exist yet
try {
  //returns true is path exists and false otherwise
  const dbFileExists = fs.existsSync(dbPath);
  if (!dbFileExists) {
    //creates a new file if the db.json file does not exist.
    //initalData - the value to convert to a string
    //null (replacer function) - each value of the key-value pairs is not modified during stringify
    //2-indicate how many space characters to use as white space.
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  }
} catch (error) {
  console.error("Error creating db.json");
  console.error(error);
}

//string to js object
//read the file and return its content
let db = JSON.parse(fs.readFileSync(dbPath));

function select(key, filterFn) {
  const table = db[key]; //dogs and users
  return new Promise((resolve, reject) => {
    //if table doesnt exist throw this error
    if (!table) return reject(new Error(`Table '${key}' not found`));
    //cant understand why filterFn works, I understand that this is a parameter
    if (filterFn) return resolve(table.filter(filterFn));
    return resolve(table);
  });
}

function insert(key, value) {
  const table = db[key];
  //if tanle does not exist it will throw an error
  if (!table) return Promise.reject(new Error(`Table '${key}' not found`));
  //if the table exists it will push the value into the key
  table.push(value);
  //writes data to a file
  return (
    fsPromises
      //takes in the file and stringifies the js object and returnd the content
      .writeFile(dbPath, JSON.stringify(db, null, 2))
      //then returns the value
      .then(() => value)
  );
}

function update(key, newValue, filterFn) {
  const table = db[key];
  //if there is no filter function which check if id exists
  return new Promise((resolve, reject) => {
    if (!filterFn)
      return reject(new Error("Please provide a filter function to update"));
    //if there is no key throw an error
    if (!table) return reject(new Error(`Table '${key}' not found`));
    //finding the id inside the table
    const index = table.findIndex(filterFn);
    //assigns newvalues to said id
    table[index] = Object.assign(table[index], newValue);
    return fsPromises
      .writeFile(dbPath, JSON.stringify(db, null, 2))
      .then(() => resolve(table[index]));
  });
}

function del(key, filterFn) {
  const table = db[key];
  return new Promise((resolve, reject) => {
    //if there is no filter function which check if id exists
    if (!filterFn)
      return reject(new Error("Please provide a filter function to delete"));
    //no table return error
    if (!table) return reject(new Error(`Table '${key}' not found`));
    //filters the id that exists in the table
    const newTable = table.filter(filterFn);
    //assigns db[key] to  newTable
    db[key] = newTable;
    return fsPromises
      .writeFile(dbPath, JSON.stringify(db, null, 2))
      .then(() => resolve());
  });
}

module.exports = { select, insert, update, del };
