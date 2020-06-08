const socket = io()

// listen for the incoming event emitted by the server
socket.on('countUpdated', count => {
  console.log(`The count is now: ${count}.`)
  document.querySelector('#socket').textContent = count
})

// Add event listener on the id and emit the name to the server
document.querySelector('#increment').addEventListener('click', () => {
  socket.emit('increment')
})