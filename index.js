const express = require("express");
const dotenv = require("dotenv");
var cors = require("cors");
const colors = require("colors");
const { json } = require("body-parser");
const { nanoid } = require("nanoid");

dotenv.config({ path: "./config.env" });

var app = express();

app.use(cors());
app.use(json());

let todos = [
  {
    id: nanoid(),
    title: "todo 1",
    completed: true,
  },
  {
    id: nanoid(),
    title: "todo 2",
    completed: false,
  },
  {
    id: nanoid(),
    title: "todo 3",
    completed: true,
  },
  {
    id: nanoid(),
    title: "todo 4",
    completed: false,
  },
  {
    id: nanoid(),
    title: "todo 5",
    completed: false,
  },
];
app.get("/", (req, res) => res.send("Welcome to todo-api"));

app.get("/todos", (req, res) => res.send(todos));

app.post("/todos", (req, res) => {
  const title = req.body.title;
  switch (title) {
    case null:
      res.statusMessage = "title value cannot be null";
      res.status(400).end();
      break;
    case undefined:
      res.statusMessage = "title value cannot be undefined";
      res.status(400).end();
      break;
    case "":
      res.statusMessage = "title value cannot be empty string";
      res.status(400).end();
      break;
    default:
      const todo = { id: nanoid(), title, completed: false };
      todos.push(todo);
      return res.send(todo);
      break;
  }
});

app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((todo) => todo?.id === id);
  const completed = Boolean(req.body?.completed);
  if (index > -1) {
    todos[index].completed = completed;
  }
  return res.send(todos[index]);
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  const index = todos.findIndex((todo) => todo.id === id);
  if (index > -1) {
    todos.splice(index, 1);
  }
  res.send(todos);
});

const PORT = 7001;

app.listen(PORT, console.log(`Server running on port ${PORT}`.green.bold));

module.exports = app;
