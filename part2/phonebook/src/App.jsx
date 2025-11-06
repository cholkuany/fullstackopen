import { useState, useEffect } from "react";
import phonebookService from "./services/phonebook";
import Nodeification from "./components/Notification";

const Filter = ({ searchName, filteredNames }) => (
  <label>
    filter shown with <input value={searchName} onChange={filteredNames} />
  </label>
);

const PersonForm = ({
  handleSubmit,
  newName,
  addName,
  newNumber,
  addNumber,
}) => (
  <form onSubmit={handleSubmit}>
    <h2>add a new</h2>
    <div>
      name: <input value={newName} onChange={addName} />
    </div>
    <div>
      number: <input value={newNumber} onChange={addNumber} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, removePerson }) => (
  <div>
    {persons.map((p) => (
      <Person key={p.name} person={p} removePerson={removePerson} />
    ))}
  </div>
);

const Person = ({ person, removePerson }) => (
  <div>
    {person.name} <span>{person.number}</span>
    <button onClick={() => removePerson(person.id)}>delete</button>
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    phonebookService.getPhonebooks().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [notice, setNotice] = useState(null);

  const filteredPersons = searchName
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : persons;

  const handleSubmit = (event) => {
    event.preventDefault();

    const isNameTaken = doesNameExist(newName);
    if (isNameTaken) {
      if (
        !window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        return;
      } else {
        const personToUpdate = persons.find((p) => p.name === newName);
        const updatedPerson = { ...personToUpdate, number: newNumber };
        phonebookService
          .updatePhonebook(personToUpdate.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToUpdate.id ? person : returnedPerson
              )
            );
            notify(`Updated ${returnedPerson.name}'s number`, "success");
            setNewName("");
            setNewNumber("");
          })
          .catch(() => {
            notify(
              `Information of ${personToUpdate.name} has already been removed from server`,
              "error"
            );
            setPersons(persons.filter((p) => p.id !== personToUpdate.id));
          });
        return;
      }
    }
    const personObject = { name: newName, number: newNumber };
    phonebookService.createPhonebook(personObject).then((returnedPerson) => {
      if (returnedPerson.status === 200) {
        setPersons(persons.concat(returnedPerson.data));
        notify(`Added ${returnedPerson.data.name}`, "success");
        setNewName("");
        setNewNumber("");
      } else {
        notify(returnedPerson.message, "error");
      }
    });
  };

  const notify = (message, type) => {
    setNotice({ message, type });
    setTimeout(() => {
      setNotice(null);
    }, 5000);
  };

  const deletePerson = (id) => {
    const person = persons.find((p) => p.id === id);
    if (!window.confirm(`Delete ${person.name} ?`)) {
      return;
    }
    phonebookService
      .deletePhonebook(id)
      .then((removePerson) => {
        console.log(removePerson);
        setPersons(persons.filter((person) => person.id !== id));
        notify(`Deleted ${person.name}`, "success");
      })
      .catch(() => {
        notify(
          `Information of ${person.name} has already been removed from server`,
          "error"
        );
        setPersons(persons.filter((person) => person.id !== id));
      });
  };

  const addName = (event) => {
    setNewName(event.target.value);
  };
  const addNumber = (event) => {
    setNewNumber(event.target.value);
  };
  const filteredNames = (event) => {
    setSearchName(event.target.value);
  };

  const doesNameExist = (name) => {
    return persons.some((person) => person.name === name);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Nodeification notice={notice} />
      <div>
        <Filter searchName={searchName} filteredNames={filteredNames} />
      </div>
      <PersonForm
        handleSubmit={handleSubmit}
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        addNumber={addNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} removePerson={deletePerson} />
    </div>
  );
};

export default App;
