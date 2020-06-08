const socket = io()

socket.on('console', message => {
  console.log(message)
})

// listen for the incoming event emitted by the server
socket.on('welcomeMessage', welcomeMessage => {
  document.querySelector('#socket').textContent = welcomeMessage
})

// listen for the incoming event emitted by the server
socket.on('serverMessage', message => {
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
  socket.emit('clientMessage', message, ack => {
    console.log('message received by the server')
    console.log(`Ack message from server: ${ack}`)
  })
  event.target.message.value = ''
})

document.querySelector('#send-location').addEventListener('click', event => {
  event.preventDefault()
  if (!navigator.geolocation) { return alert('Geolocation is not available in your browser') }
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude: lat, longitude: long } = position.coords
    socket.emit('position', { lat, long }, ack => {
      console.log(`Server says: ${ack}`)
    })
  })
})
// Add event listener on the id and emit the name to the server
/*
document.querySelector('#increment').addEventListener('click', () => {
  socket.emit('increment')
})
 */
