module.exports = (err, req, res, next) => {
    console.error(err.message);

    if (err.name === 'CastErr' && err.kind === 'ObjectId') {
        return res.status(400).send({ err: 'malformatted id' })
    } 
    
    res.status(500).end()
}