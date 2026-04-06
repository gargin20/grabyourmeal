import User from "./models/user.model.js"

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // Identify user and store socket ID
    socket.on('identity', async ({ userId }) => {
      try {
        if (!userId) return
        await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
          isOnline: true
        }, { new: true })
      } catch (error) {
        console.log('identity error:', error)
      }
    })

    // Update delivery boy location
    socket.on('updateLocation', async ({ latitude, longitude, userId }) => {
      try {
        if (!userId) return
        const user = await User.findByIdAndUpdate(userId, {
          location: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
          isOnline: true,
          socketId: socket.id
        }, { new: true })

        if (user) {
          io.emit('updateDeliveryLocation', {
            deliveryBoyId: userId,
            latitude: Number(latitude),
            longitude: Number(longitude)
          })
        }
      } catch (error) {
        console.log('updateDeliveryLocation error:', error)
      }
    })

    // Handle disconnect
    socket.on('disconnect', async () => {
      try {
        await User.findOneAndUpdate({ socketId: socket.id }, {
          socketId: null,
          isOnline: false
        })
        console.log('Socket disconnected:', socket.id)
      } catch (error) {
        console.log('disconnect error:', error)
      }
    })
  })
}
