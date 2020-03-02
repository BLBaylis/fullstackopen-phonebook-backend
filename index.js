require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const Person = require('./models/persons')
const errorHandler = require('./middlewares/errorHandler')

app.use(express.static('build'))
app.use(cors());
app.use(bodyParser.json())
morgan.token('body', (req, res) => req.method === "POST" ? JSON.stringify(req.body) : " ")
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const getFormattedDateFromTimeStamp = timestamp => {
  date = new Date(timestamp)
  return {
    year: date.getFullYear(),
    month: date.getMonth()+1,
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}

app.get('/api/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const now = Date.now();
      const { year, month, date, hours, minutes, seconds } = getFormattedDateFromTimeStamp(now);
      res.send(`
        <p>Phonebook has entries for ${persons.length} people.</p>
        <p>${date}/${month}/${year} ${hours}:${minutes}:${seconds}</p>`
      )
    })
    .catch(err => {
      console.log(err.message)
      res.status(500).end()
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons.map(person => person.toJSON())))
    .catch(err => {
      console.log(err.message)
      res.status(500).end()
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => person ? res.json(person.toJSON()) : res.status(404).end())
    .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(deleted => deleted ? res.status(204).end() : res.status(404).end())
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error : "Missing content"
    })
  }

  const { name, number } = req.body;
  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => res.json(savedPerson.toJSON()))
    .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error : "Missing content"
    })
  }
  Person.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updated => res.json(updated.toJSON()))
    .catch(next)
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})