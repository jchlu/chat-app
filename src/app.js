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
  socket.broadcast.emit('broadcast', 'A new user joined')
  socket.on('message', message => {
    io.emit('message', message)
  })

  socket.on('disconnect', () => {
    // emit user disconnected message
    io.emit('broadcast', 'A user disconnected.')
  })
})

module.exports = {
  app,
  server
}