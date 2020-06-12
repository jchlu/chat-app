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

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })
    if (error) {
      return callback(error)
    }
    socket.join(user.room)
    socket.emit('message', generateMessage('Admin', welcomeMessage))
    socket.to(user.room).broadcast.emit('message', generateMessage('Admin', `${user.name} joined the ${user.room} room`))
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(room)
    })
    callback()
  })

  // Listen for messages coming in from the client
  socket.on('clientMessage', (message, callback) => {
    const user = getUser(socket.id)
    if (!user) {
      const error = { error: 'Something went wrong. Please refresh the browser' }
      return callback(error)
    }
    const { name, room } = user
    io.to(room).emit('message', generateMessage(name, message))
    const ack = `Message received at ${Date.now()}`
    callback(ack)
  })

  socket.on('disconnect', () => {
    // removeUser , if it works then send message below
    const user = removeUser(socket.id)
    if (user) {
      const { name, room } = user
      io.to(room).emit('message', generateMessage('Admin', `${name} left the chat room.`))
      io.to(room).emit('roomData', {
        room,
        users: getUsersInRoom(room)
      })
    }
    // emit user disconnected message
  })

  socket.on('position', (location, callback) => {
    const user = getUser(socket.id)
    if (!user) {
      const error = { error: 'Something went wrong. Please refresh the browser' }
      return callback(error)
    }
    const { name, room } = user
    io.to(room).emit('position', generatePositionMessage(name, location))
    const ack = 'Location was received and shared'
    callback(ack)
  })
})

module.exports = {
  app,
  server
}
