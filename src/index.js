const { app, server } = require('./app')

const port = process.env.PORT

server.listen(port, () => {
  console.log(`Server up and running on port ${port}.`)
})