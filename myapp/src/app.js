const express = require('express')
const app = express()
const port = 3000

// Enable all CORS requests (not secure)
const cors = require('cors')
app.use(cors())

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const game = require('./routes/game')
app.use('/games', game)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

