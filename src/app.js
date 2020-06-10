const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generatePositionMessage } = require('./utils/messages')

const staticPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const welcomeMessage = 'Welcome to the Chat App'

app.use(express.static(staticPath))

io.on('connection', socket => {
  socket.emit('serverMessage', generateMessage(welcomeMessage))
  socket.broadcast.emit('serverMessage', generateMessage('A new user joined'))
  socket.on('clientMessage', (message, callback) => {
    io.emit('message', generateMessage(message))
    const ack = `Message received at ${Date.now()}`
    callback(ack)
  })

  socket.on('disconnect', () => {
    // emit user disconnected message
    io.emit('serverMessage', generateMessage('A user disconnected.'))
  })

  socket.on('position', (location, callback) => {
    io.emit('position', generatePositionMessage(location))
    const ack = 'Location was received and shared'
    callback(ack)
  })
})

module.exports = {
  app,
  server
}
