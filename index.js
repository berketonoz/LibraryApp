const { log } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const collectionPath = path.join(
  __dirname,
  "./Library Case API Collection.postman_collection.json"
);
const usersPath = path.join(__dirname, "./data/Users.json");
const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));
const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id === parseInt(id));
  res.json(user);
});

app.get("/test/collection/:id", (req, res) => {
  const id = req.params.id;
  res.json(JSON.parse(collection.item[id].response[0].body));
});

app.listen(port, () => {
  console.log(`Library management app listening on port ${port}`);
});
