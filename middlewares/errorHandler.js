module.exports = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastErr' && err.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
    }
    
    next(err)
}