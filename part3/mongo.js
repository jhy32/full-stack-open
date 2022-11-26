const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://johan:${password}@cluster0.6pl59gj.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length < 5) {
    mongoose.connect(url).then((result) => {
        Person.find({}).then(result => {
            result.forEach(person => {console.log(person)})
        })
        mongoose.connection.close()
    })
} else {
    mongoose.connect(url).then((result) => {
            const person = new Person({
                name: process.argv[3], 
                number: process.argv[4],
                id: Math.floor(Math.random()*100000000)
            })
            return person.save()
        })
    .then(() => (mongoose.connection.close()))
}


