const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");

usersRouter.post("/", async (request, response) => {
  const saltRounds = 10;
  const { username, name, password } = request.body;

  if (password.length < 3) {
    return response.status(400).json({ error: "password too short" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name,
    username,
    hashedPassword,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get("/", async (request, response) => {
  const filters = { title: 1, url: 1, likes: 1 };
  const users = await User.find({}).populate("blogs", filters);

  response.json(users);
});

module.exports = usersRouter;
