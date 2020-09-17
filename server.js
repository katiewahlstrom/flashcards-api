const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dataAccessLayer = require("./dataAccessLayer");
const { ObjectId, ObjectID } = require("mongodb");

dataAccessLayer.connect();

// Create the Server
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/api/stacks", async (request, response) => {
  const stacks = await dataAccessLayer.findAll();

  response.send(stacks);
});
//Starting the Server

app.get("/api/stacks/:id", async (request, response) => {
  const stackdId = request.params.id;
  if (!ObjectID.isValid(stackId)) {
    response.status(400).send(`StackID ${stackId} is incorrect.`);
    return;
  }
  const stackQuery = {
    _id: new ObjectId(stackId),
  };
  let stack;

  try {
    stack = await dataAccessLayer.findOne(stackQuery);
  } catch (error) {
    response.status(404).send(`stack with id ${stackId} not found`);
    return;
  }
  response.send(stack);
});

app.post("/api/stacks", async (request, response) => {
  //read the json body from the request
  const body = request.body;

  //validate the json body to have the required properties
  /* Required Properties: 
    -name
    -price
    -category
    */
  if (!body.title) {
    response.status(400).send("Bad Request. Validation Error.  Missing title!");
    return;
  }

  //Validate data types of properties
  // title => non-empty string
  //price => Greter than 0 Number
  //category => non-empty string

  if (body.title && typeof body.title !== "string") {
    response.status(400).send("The title parameter must be of type string.");
    return;
  }
  if (!body.cards || (body.cards && body.cards.length === 0)) {
    body.cards = [];
  }
  await dataAccessLayer.insertOne(body);

  response.status(201).send();
});

app.put("/api/stacks/:id", async (request, response) => {
  const stackId = request.params.id;
  const body = request.body;

  if (!ObjectId.isValid(stackId)) {
    console.log("PUT stack Id", !ObjectID.isValid(stackId));
    response.status(400).send(`stackId ${stackId} is incorrect.`);
    return;
  }

  const stackQuery = {
    _id: new ObjectId(stackId),
  };

  let result = await dataAccessLayer.updateOne(stackQuery, body);
  console.log("working", result);
  response.send(result);

  // DELETE EXISTING stack BY ID
  //DELETE /api/stacks/:id
});

app.delete("/api/stacks/:id", async (request, response) => {
  const stackId = request.params.id;

  if (!ObjectID.isValid(stackId)) {
    response.status(400).send(`stackID ${stackId} is incorrect.`);
    return;
  }

  const stackQuery = {
    _id: new ObjectId(stackId),
  };
  try {
    await dataAccessLayer.deleteOne(stackQuery);
  } catch (error) {
    response.status(404).send(`stack with id ${stackId} not found`);
    return;
  }

  response.send();
});
const port = process.env.PORT ? process.env.PORT : 3005;
app.listen(port, () => {
  console.log("API STARTED!");
});
