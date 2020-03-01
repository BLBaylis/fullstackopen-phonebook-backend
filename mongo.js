const mongoose = require('mongoose');

const argsNum = process.argv.length;

if (argsNum < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2];

const url = `mongodb+srv://brad:${password}@phonebook-ukyhr.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('person', personSchema)

if (argsNum === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
            const {name, number} = person;
            console.log(`${name} ${number}`)
        })
        mongoose.connection.close()
    })
} else if (argsNum === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })
    
    person.save().then(savedPerson => {
        const {name, number} = savedPerson;
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

