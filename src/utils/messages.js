const generateMessage = message => ({
  created: new Date().getTime(),
  message
})

const generatePositionMessage = location => {
  const { lat, long } = location
  const url = `https://google.com/maps?=${lat},${long}`
  return {
    created: new Date().getTime(),
    url
  }
}

module.exports = {
  generateMessage,
  generatePositionMessage
}
