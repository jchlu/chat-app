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
const chatForm = document.querySelector('#chat-form')
const chatInput = chatForm.querySelector('input')
const chatButton = chatForm.querySelector('button')
chatForm.addEventListener('submit', event => {
  event.preventDefault()
  const message = event.target.message.value
  if (!message.length) { return null }
  // disable message sending until server responds
  chatButton.setAttribute('disabled', 'disabled')
  socket.emit('clientMessage', message, ack => {
    // re-enable send button, blank input anf focus the message input
    chatButton.removeAttribute('disabled')
    chatInput.value = ''
    chatInput.focus()
    console.log('message received by the server')
    console.log(`Ack message from server: ${ack}`)
  })
})

const locationButton = document.querySelector('#send-location')
locationButton.addEventListener('click', event => {
  event.preventDefault()
  if (!navigator.geolocation) { return alert('Geolocation is not available in your browser') }
  // disable location button to prevent sending multiple times if delayed
  locationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude: lat, longitude: long } = position.coords
    socket.emit('position', { lat, long }, ack => {
      // re-enable location button
      locationButton.removeAttribute('disabled')
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
