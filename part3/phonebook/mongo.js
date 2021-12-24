const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(process.argv)
  console.log('Please provide the following arguments: node mongo.js <password> OR node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]
const collection = 'phonebook'

const url =
  `mongodb+srv://fullstack:${password}@cluster0.kb3p7.mongodb.net/${collection}?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log(`${collection}:`)
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to ${collection}`)
    mongoose.connection.close()
  })
}