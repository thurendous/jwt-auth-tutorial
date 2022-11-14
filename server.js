const express = require('express')
const app = express()
const auth = require('./routes/auth')
const post = require('./routes/posts')

const PORT = process.env.PORT || 3000
app.use(express.json())
app.use('/auth', auth)
app.use('/posts', post)

app.listen(PORT, () => {
    console.log('server is being strated')
})

// endpoint is at
app.get('/', (req, res) => {
    res.send('hello hello JWT!')
})
