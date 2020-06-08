const socket = io()

// listen for the incoming event emitted by the server
socket.on('welcomeMessage', welcomeMessage => {
  document.querySelector('#socket').textContent = welcomeMessage
})

// listen for the incoming event emitted by the server
socket.on('message', message => {
  document.querySelector('#messages').textContent += '\r\n' + message
})

// listen for the incoming event emitted by the server
socket.on('broadcast', broadcast => {
  document.querySelector('#broadcasts').textContent += '\r\n' + broadcast
})

// Add event listener on the id and emit the name to the server
document.querySelector('#chat-form').addEventListener('submit', event => {
  event.preventDefault()
  const message = event.target.message.value
  if (!message.length) { return null }
  console.log(message)
  socket.emit('message', message)
  event.target.message.value = ''
})

// Add event listener on the id and emit the name to the server
/*
document.querySelector('#increment').addEventListener('click', () => {
  socket.emit('increment')
})
 */
