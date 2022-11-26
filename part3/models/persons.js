const mongoose = require('mongoose')

const url = process.env.MONGODB_URI 

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    }, 
    number:{
        type: String, 
        minLength: 8,
        validate: {validator: function(v) {
            const breakdown1 = !isNaN(v.slice(0, 2)) && v[2]==='-' && !isNaN(v.slice(3))
            const breakdown2 = !isNaN(v.slice(0, 3)) && v[3]==='-' && !isNaN(v.slice(4))
            return breakdown1 || breakdown2
        }}
    } 
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id 
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)