const socket = io()

const { name, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Elements
const chatForm = document.querySelector('#chat-form')
const chatInput = chatForm.querySelector('input')
const chatButton = chatForm.querySelector('button')
const locationButton = document.querySelector('#send-location')
const messages = document.querySelector('#messages')
const sidebar = document.querySelector('#sidebar')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const positionTemplate = document.querySelector('#position-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoscroll = () => {
  // just to be defensive...
  if (messages.lastElementChild) {
    // new message element
    const newMessage = messages.lastElementChild
    // height of new message, including the bottom margin
    // styles for the new message
    const newMessageStyle = getComputedStyle(newMessage)
    // bottom margin as an integer
    const marginHeight = parseInt(newMessageStyle.marginBottom)
    // total new message height
    const newMessageHeight = newMessage.offsetHeight + marginHeight
    // visible height of messages container
    const visibleHeight = messages.offsetHeight
    // total height of messages container
    const containerHeight = messages.scrollHeight
    // scroll position at the moment
    const scrollOffset = messages.scrollTop + visibleHeight
    // if container height - new message height is less than the offset, we're at the bottom
    if (containerHeight - newMessageHeight <= scrollOffset) {
      // so, autoscroll to make message visible
      messages.scrollTop = messages.scrollHeight
    }
  }
}

// listen for the incoming event emitted by the server
socket.on('message', ({ name, created, message }) => {
  const html = Mustache.render(messageTemplate, {
    name,
    created: moment(created).format('h:mm a'),
    message
  })
  messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

// listen for the position event emitted by the server
socket.on('position', ({ name, created, url }) => {
  const html = Mustache.render(positionTemplate, {
    name,
    created: moment(created).format('h:mm a'),
    url
  })
  messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
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
chatForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const message = event.target.message.value
  if (!message.length) { return null }
  // disable message sending until server responds
  chatButton.setAttribute('disabled', 'disabled')
  socket.emit('clientMessage', message, (ack) => {
    // re-enable send button, blank input anf focus the message input
    chatButton.removeAttribute('disabled')
    chatInput.value = ''
    chatInput.focus()
    if (ack.error) {
      alert(ack.error)
    } else {
      console.log(`Server says: ${ack}`)
    }
  })
})

locationButton.addEventListener('click', (event) => {
  event.preventDefault()
  if (!navigator.geolocation) { return alert('Geolocation is not available in your browser') }
  // disable location button to prevent sending multiple times if delayed
  locationButton.setAttribute('disabled', 'disabled')
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude: lat, longitude: long } = position.coords
    socket.emit('position', { lat, long }, (ack) => {
      // re-enable location button
      locationButton.removeAttribute('disabled')
      if (ack.error) {
        alert(ack.error)
      } else {
        console.log(`Server says: ${ack}`)
      }
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
