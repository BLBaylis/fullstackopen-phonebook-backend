const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(express.static('build'))
app.use(cors());
app.use(bodyParser.json())
morgan.token('body', (req, res) => req.method === "POST" ? JSON.stringify(req.body) : " ")
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (req, res) => {
  res.send(
    `<p>Phonebook has entries for ${persons.length} people.</p><p>${Date.now()}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  person ? res.json(person) : res.status(404).end();
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const oldLength = persons.length;
  persons = persons.filter(person => person.id !== id);
  persons.length === oldLength - 1 ? res.status(204).end() : res.status(404).end();
})

const generateId = () => {
  return persons.length > 0 ? Math.max(...persons.map(person => person.id)) + 1: 0;
}

app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error : "Missing content"
    })
  }

  const { name, number } = req.body;

  const names = persons.map(person => person.name);

  if (names.includes(name)) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    name,
    number,
    id: generateId()
  }

  persons = persons.concat(person);
  res.send(person);
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})