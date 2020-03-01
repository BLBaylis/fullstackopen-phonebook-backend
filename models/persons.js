const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false)

const url = process.env.MONGO_URI

console.log("Connecting to MongoDB")

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(res => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting to MongoDB: ", err.message))

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('person', personSchema)