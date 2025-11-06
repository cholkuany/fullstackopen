require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

const PORT = process.env.PORT;

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({})
    .then((phonebooks) => {
      response.json(phonebooks);
    })
    .catch((error) => console.log(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        return response.json(person);
      } else {
        return response.sendStatus(404);
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount) {
        console.log(`deleted ${result.deletedCount} ${id}`);
        response.sendStatus(204);
      } else {
        return response.sendStatus(404);
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  Person.findOne({ name })
    .then((person) => {
      if (person) {
        return response.status(409).json({ error: "name must be unique" });
      }

      const newPerson = new Person({ name, number });
      newPerson
        .save()
        .then((savedPerson) => {
          response.json(savedPerson);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).send({ error: "missing name or number" });
  }
  Person.findOneAndUpdate(
    { _id: id },
    {
      name,
      number,
    },
    { new: true }
  )
    .then((savedPerson) => {
      if (savedPerson) {
        console.log(
          `${savedPerson.name} number updated to ${savedPerson.number}`
        );
        response.json(savedPerson);
      } else {
        response.status(404).send({ error: `no such identifier: ${id}` });
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  const date = new Date().toString();
  Person.countDocuments().then((count) => {
    response.send(
      `<p>Phonebook has info for ${count} people <br><br> ${date} </p>`
    );
  });
});

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
