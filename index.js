const { log } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

const dataPath = path.join(
  __dirname,
  "./Library Case API Collection.postman_collection.json"
);
const apiCollection = JSON.parse(fs.readFileSync(dataPath, "utf8"));

app.get("/users", (req, res) => {
  res.json(apiCollection);
});

app.get("/test/collection/:id", (req, res) => {
    const id = req.params.id;
    res.json(JSON.parse(apiCollection.item[id].response[0].body));
});

app.listen(port, () => {
  console.log(`Library management app listening on port ${port}`);
});
