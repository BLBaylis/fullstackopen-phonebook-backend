const router = require('express').Router()
const Person = require('../models/person')

router.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
  
const getFormattedDateFromTimeStamp = timestamp => {
  const date = new Date(timestamp)
  return {
    year: date.getFullYear(),
    month: date.getMonth()+1,
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  }
}
  
router.get('/info', (req, res) => {
  Person.find({})
    .then(persons => {
      const now = Date.now()
      const { year, month, date, hours, minutes, seconds } = getFormattedDateFromTimeStamp(now)
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
  
router.get('/persons', (req, res) => {
  Person.find({})
    .then(persons => res.json(persons.map(person => person.toJSON())))
    .catch(err => {
      console.log(err.message)
      res.status(500).end()
    })
})
  
router.get('/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => person ? res.json(person.toJSON()) : res.status(404).end())
    .catch(next)
})
  
router.delete('/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(deleted => deleted ? res.status(204).end() : res.status(404).end())
    .catch(next)
})
  
router.post('/persons', (req, res, next) => {
  const { name, number } = req.body
  const person = new Person({ name, number })
  person.save()
    .then(savedPerson => res.json(savedPerson.toJSON()))
    .catch(next)
})
  
router.put('/persons/:id', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error : 'Missing content'
    })
  }
  Person.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(updated => res.json(updated.toJSON()))
    .catch(next)
})

module.exports = router