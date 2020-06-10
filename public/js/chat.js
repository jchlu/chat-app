const socket = io()

// Elements
const chatForm = document.querySelector('#chat-form')
const chatInput = chatForm.querySelector('input')
const chatButton = chatForm.querySelector('button')
const serverMessages = document.querySelector('#server-messages')
const messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const positionTemplate = document.querySelector('#position-template').innerHTML

// Listen for messages to be logged to the console
socket.on('console', ({ created, message }) => {
  console.log(created, message)
})

// listen for the welcome message emitted by the server
socket.on('serverMessage', ({ created, message }) => {
  const html = Mustache.render(messageTemplate, {
    created: moment(created).format('h:mm a'),
    message
  })
  serverMessages.insertAdjacentHTML('beforebegin', html)
})

// listen for the incoming event emitted by the server
socket.on('message', ({ created, message }) => {
  const html = Mustache.render(messageTemplate, { created, message })
  messages.insertAdjacentHTML('beforebegin', html)
})

// listen for the position event emitted by the server
socket.on('position', ({ created, url }) => {
  const html = Mustache.render(positionTemplate, {
    created: moment(created).format('h:mm a'),
    url
  })
  messages.insertAdjacentHTML('beforebegin', html)
})

// Add event listener on the id and emit the name to the server
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
