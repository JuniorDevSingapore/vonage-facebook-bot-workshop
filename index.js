const app = require('express')()
const bodyParser = require('body-parser')
const nedb = require('nedb')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const messages = new nedb({ filename: 'messages.db', autoload: true })

app.post('/inbound', function(request, response) {
  // console.log(request.body)

  messages.insert(request.body, function (error, record) {
    if (error) {
      return console.error(error)
    }
    console.log(record)
  })
  response.send('ok')
})

app.post('/status', function(request, response) {
  // console.log(request.body)

  response.send('ok')
})

app.listen(3000)
