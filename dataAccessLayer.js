const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const url = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_DATABASE;

console.log(url);
console.log(databaseName);

const collectionName = "stacks";
const settings = {
  useUnifiedTopology: true,
};

let databaseClient;
let stackCollection;

const connect = function () {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, settings, (error, client) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      databaseClient = client.db(databaseName);
      stackCollection = databaseClient.collection(collectionName);
      console.log("SUCCESSFULLY CONNECTED TO DATABASE!");
      resolve();
    });
  });
};
const findAll = function () {
  //The shape of the object we're looking for.
  const query = {};

  return new Promise((resolve, reject) => {
    stackCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log(`SUCCESFULLY FOUND ${documents.length} DOCUMENTS`);
      resolve(documents);
    });
  });
};

const findOne = function (query) {
  return new Promise((resolve, reject) => {
    stackCollection.find(query).toArray((error, documents) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      if (documents.length > 0) {
        console.log("SUCCESSFULLY FOUND DOCUMENT!");
        const document = documents[0];
        resolve(document);
      } else {
        reject("No document found!");
      }
    });
  });
};

const insertOne = function (stack) {
  return new Promise((resolve, reject) => {
    stackCollection.insertOne(stack, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      console.log("SUCCESSFULLY INSERTED A NEW DOCUMENT");
      resolve(result);
    });
  });
};

const updateOne = function (query, newStack) {
  const newStackQuery = {};

  if (newStack.title) {
    newStackQuery.title = newStack.title;
  }

  if (newStack.cards) {
    newStackQuery.cards = newStack.cards;
  }

  return new Promise((resolve, reject) => {
    stackCollection.updateOne(
      query,
      { $set: newStackQuery },
      (error, result) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        } else if (result.modifiedCount === 0) {
          console.log("No Document Found or No Modification Made");
          reject("No Document Found or No Modification Made");
          return;
        }

        console.log("SUCCESSFULLY UPDATED DOCUMENT!");
        resolve(result);
      }
    );
  });
};

const deleteOne = function (query) {
  return new Promise((resolve, reject) => {
    stackCollection.deleteOne(query, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      } else if (result.deletedCount === 0) {
        console.log("No Document Found");
        reject("No Document Found");
        return;
      }

      console.log("SUCCESSFULLY DELETED DOCUMENT");
      resolve();
    });
  });
};

module.exports = { connect, findAll, findOne, insertOne, deleteOne, updateOne };
