const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const staticPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)

const io = socketio(server)

app.use(express.static(staticPath))

io.on('connection', () => {
  console.log('New websocket client connection')
})

module.exports = {
  app,
  server
}