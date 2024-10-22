// backend.js
import express from "express";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";

import userService from "./services/user-service.js";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));
} else {
  console.log("Already connected to MongoDB");
}
// mongoose
//   .connect(MONGO_CONNECTION_STRING)
//   .catch((error) => console.log(error));
  
const app = express();
const port = 8000;
const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    }
  ]
};

const findUserByNameandJob = (name, job) => {
  return users["users_list"].filter(
    (user) => user["name"] === name && user["job"] === job
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  const NewUser = { ...user, id: generateID()};
  users["users_list"].push(NewUser);
  return NewUser;
};

const deleteUser = (id) => {
  const index = users["users_list"].findIndex((user) => user['id'] === id);
  users["users_list"].splice(index,1);
  return;
};
const generateID = () => {
  return Math.random().toString(36).substr(2, 6);
};

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  try {
    const users = await userService.getUsers(name, job);
    res.status(200).json({ users_list: users });
  } catch (error) {
    res.status(500).send("Error fetching users: " + error.message);
  }
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"]; //or req.params.id
  try {
    const result = await userService.findUserById(id);
    if (!result) {
      res.status(404).send("Resource not found.");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).send("Error fetching user: " + error.message);
  }
});

app.post("/users", async (req, res) => {
  const userToAdd = req.body;
  const addedUser = addUser(userToAdd);
  try {
    const addedUser = await userService.addUser(userToAdd);
    res.status(201).json(addedUser);
  } catch (error) {
    res.status(500).send("Error adding user: " + error.message);
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = req.params["id"];
  try {
    const result = await userService.deleteUserById(id);
    if (!result) {
      res.status(404).send("User not found.");
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.status(500).send("Error deleting user: " + error.message);
  }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});