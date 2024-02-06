import mongoose, { Connection } from 'mongoose'

let cachedConnection: Connection | null = null

export async function connectToMongoDB() {
  if (cachedConnection) {
    console.log('Использование кэшированного соединения MONGODB')
    return cachedConnection
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO as string)
    cachedConnection = conn.connection

    console.log('Установлено новое соединение с mongodb')
    return cachedConnection
  } catch (error) {
    console.log('ЖУТКАЯ ошибка', error)

    throw error
  }
}
