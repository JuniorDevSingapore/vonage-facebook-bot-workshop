require('dotenv').config()

const app = require('express')()
const bodyParser = require('body-parser')
const nedb = require('nedb')
const Vonage = require('@vonage/server-sdk')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const messages = new nedb({ filename: 'messages.db', autoload: true })
const vonage = new Vonage({
  apiKey: process.env.VONAGE_KEY,
  apiSecret: process.env.VONAGE_SECRET,
  applicationId: process.env.APP_ID,
  privateKey: './private.key'
}, {
  apiHost: 'https://messages-sandbox.nexmo.com'
})

function sendMessage(sender, recipient, text) {
  const to = { type: 'messenger', id: recipient }
  const from = { type: 'messenger', id: sender }
  const message = { content: { type: 'text', text: text } }

  vonage.channel.send(to, from, message, function(error, result) {
    if(error) { return console.error(error) }
    console.log(result)
  })
}

app.post('/inbound', function(request, response) {
  // console.log(request.body)

  messages.insert(request.body, function (error, record) {
    if (error) {
      sendMessage(request.body.to.id, request.body.from.id, 'Sorry! There was a problem.')
      return console.error(error)
    }
    sendMessage(request.body.to.id, request.body.from.id, 'Thanks for your message!')
    console.log(record)
  })
  response.send('ok')
})

app.post('/status', function(request, response) {
  // console.log(request.body)

  response.send('ok')
})

app.listen(3000)
