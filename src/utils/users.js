const users = []

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase()
  room = room.trim().toLowerCase()
  const existingUser = users.find(user => user.name === name && user.room === room)
  if (existingUser) {
    return ({ error: 'Names must be unique inside a room' })
  }
  const user = { id, name, room }
  users.push(user)
}

const getUser = id => users.find(user => user.id === id)

const getUsersInRoom = room => users.filter(user => user.room === room.trim().toLowerCase())

const removeUser = id => {
  const index = users.findIndex(user => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser
}
