const generateMessage = (name, message) => ({
  name,
  created: new Date().getTime(),
  message
})

const generatePositionMessage = (name, location) => {
  const { lat, long } = location
  const url = `https://google.com/maps?=${lat},${long}`
  return {
    name,
    created: new Date().getTime(),
    url
  }
}

module.exports = {
  generateMessage,
  generatePositionMessage
}
