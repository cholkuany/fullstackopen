const mongoose = require("mongoose");

const PROCESS_ARGV_LENGTH = process.argv.length;

if (PROCESS_ARGV_LENGTH < 3) {
  console.log("Password is missing!");
  process.exit(0);
}
const password = process.argv[2];

const url = `mongodb+srv://fullstackopen:${password}@myatlasclusteredu.xazg4rm.mongodb.net/phonebookApp?appName=myAtlasClusterEDU`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

// Fetches persons
if (PROCESS_ARGV_LENGTH === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

// Creates person
if (PROCESS_ARGV_LENGTH >= 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });
  person.save().then((p) => {
    console.log(`added ${p.name} number ${p.number} to phonebook`);
    mongoose.connection.close();
  });
}
