const socket = io()

const { name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Elements
const chatForm = document.querySelector('#chat-form')
const chatInput = chatForm.querySelector('input')
const chatButton = chatForm.querySelector('button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')
const serverMessages = document.querySelector('#server-messages')
const sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const positionTemplate = document.querySelector('#position-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// listen for the incoming event emitted by the server
socket.on('message', ({ name, created, message }) => {
  const html = Mustache.render(messageTemplate, {
    name,
    created: moment(created).format('h:mm a'),
    message
  })
  messages.insertAdjacentHTML('beforebegin', html)
})

// listen for the position event emitted by the server
socket.on('position', ({ name, created, url }) => {
  const html = Mustache.render(positionTemplate, {
    name,
    created: moment(created).format('h:mm a'),
    url
  })
  messages.insertAdjacentHTML('beforebegin', html)
})

// listen for the roomData event
socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  sidebar.innerHTML = html
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

socket.emit('join', { name, room }, (error) => {
  // display error to the user
  if (error) {
    alert(error)
    location.href = '/'
  }
})
