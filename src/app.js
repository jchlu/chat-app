const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generatePositionMessage } = require('./utils/messages')
const { addUser, getUser, getUsersInRoom, removeUser } = require('./utils/users')

const staticPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const welcomeMessage = 'Welcome to the Chat App'

app.use(express.static(staticPath))

io.on('connection', socket => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })
    if (error) {
      return callback(error)
    }
    socket.join(user.room)
    socket.emit('serverMessage', generateMessage(welcomeMessage))
    socket.to(user.room).broadcast.emit('serverMessage', generateMessage(`user ${user.name} joined the ${user.room} room`))
    callback()
  })

  socket.on('clientMessage', (message, callback) => {
    io.emit('message', generateMessage(message))
    const ack = `Message received at ${Date.now()}`
    callback(ack)
  })

  socket.on('disconnect', () => {
    // removeUser , if it works then send message below
    // TODO: continue at 14:10 remaining in _20 video
    const user = removeUser(socket.id)
    if (user) {
      io.to(user.room).emit('serverMessage', generateMessage(`${user.name} has disconnected.`))
    }
    // emit user disconnected message
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
