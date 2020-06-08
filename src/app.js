const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const staticPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const welcomeMessage = 'Welcome to the Chat App'

app.use(express.static(staticPath))

io.on('connection', socket => {
  socket.emit('welcomeMessage', welcomeMessage)
  socket.broadcast.emit('console', 'A new user joined')
  socket.on('clientMessage', (message, callback) => {
    io.emit('serverMessage', message)
    const ack = `Message received at ${Date.now()}`
    callback(ack)
  })

  socket.on('disconnect', () => {
    // emit user disconnected message
    io.emit('console', 'A user disconnected.')
  })

  socket.on('position', (location, callback) => {
    const { lat, long } = location
    const message = `https://google.com/maps?=${lat},${long}`
    io.emit('console', message)
    const ack = 'Location was received and shared'
    callback(ack)
  })
})

module.exports = {
  app,
  server
}
