const express = require("express");
var morgan = require("morgan");

const app = express();

const PORT = 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    return response.json(person);
  }
  response.sendStatus(404);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = id ? persons.find((p) => p.id === id) : null;
  if (!person) {
    return response.sendStatus(404);
  }
  persons = persons.filter((p) => p.id !== person.id);
  response.sendStatus(204);
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};
app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  const person = persons.find((p) => p.name === name);
  if (person) {
    return response.status(409).json({ error: "name must be unique" });
  }

  const id = String(generateId());

  const newPerson = {
    name,
    number,
    id,
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

app.get("/info", (request, response) => {
  const date = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people <br><br> ${date} </p>`
  );
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
