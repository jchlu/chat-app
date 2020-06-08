const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const staticPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)

const io = socketio(server)

app.use(express.static(staticPath))

let count = 0

io.on('connection', socket => {
  // only need to let the current client know the count so "socket" is used
  socket.emit('countUpdated', count)
  socket.on('increment', () => {
    count++
    // need to let *all* clients know the count, so "io" is used to emit
    io.emit('countUpdated', count)
  })
})

module.exports = {
  app,
  server
}