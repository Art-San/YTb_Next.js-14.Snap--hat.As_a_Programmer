'use server'
import { auth, signIn, signOut } from '@/auth'
import { connectToMongoDB } from './db'
import { v2 as cloudinary } from 'cloudinary'
import Message, { IMessageDocument } from '@/models/messageModel'
import Chat, { IChatDocument } from '@/models/chatModel'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function authAction() {
  try {
    await signIn('github') // redirect()
  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') {
      throw error
    }
    return error.message
  }
}

export async function logoutAction() {
  'use server'
  await signOut({ redirectTo: '/' })
  // await signOut({ redirectTo: '/' })
  // await signOut() // так тоже можно
}

export const sendMessageAction = async (
  receiverId: string,
  content: string,
  messageType: 'image' | 'text'
) => {
  noStore()
  try {
    const session = await auth()
    if (!session) return
    await connectToMongoDB()
    const senderId = session.user._id

    let uploadedResponse
    if (messageType === 'image') {
      uploadedResponse = await cloudinary.uploader.upload(content)
    }

    const newMessage: IMessageDocument = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: uploadedResponse?.secure_url || content,
      messageType
    })

    let chat: IChatDocument | null = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id]
      })
    } else {
      chat.messages.push(newMessage._id)
      await chat.save()
    }

    revalidatePath(`/chat/${receiverId}`)

    // Альтернативное использование функции revalidatePath:
    // revalidatePath('/chat/[id]', 'page')

    return newMessage
  } catch (error: any) {
    console.error('Error in sendMessage:', error.message)
    throw error
  }
}

// 04:03:16
export const deleteChatAction = async (userId: string) => {
  try {
    await connectToMongoDB()
    const { user } = (await auth()) || {}
    if (!user) return
    const chat = await Chat.findOne({
      participants: { $all: [user._id, userId] }
    })
    if (!chat) return

    const messageIds = chat.messages.map((messageId) => messageId.toString())
    await Message.deleteMany({ _id: { $in: messageIds } })
    await Chat.deleteOne({ _id: chat._id })

    revalidatePath('/chat/[id]', 'page')
    //это выдаст ошибку, потому что это выдает внутреннюю ошибку
    // redirect("/chat");
  } catch (error: any) {
    console.error('Error in deleteChat:', error.message)
    throw error
  }
  redirect('/chat')
}
/*TODO:*/
// export const deleteMessageAction = async (messageId: string) => {
//   try {
//     await connectToMongoDB()
//     const { user } = (await auth()) || {}
//     if (!user) return

//     // Проверка, является ли пользователь отправителем или получателем сообщения
//     const message = await Message.findById(messageId)
//     if (!message) return
//     if (
//       message.sender.toString() !== user._id.toString() &&
//       message.receiver.toString() !== user._id.toString()
//     ) {
//       throw new Error('У вас нет прав на удаление этого сообщения')
//     }

//     // Удаление сообщения
//     await Message.deleteOne({ _id: messageId })

//     // Обновление кэша страницы чата, если это необходимо
//     // revalidatePath('/chat/[id]', 'page');
//   } catch (error: any) {
//     console.error('Error in deleteMessage:', error.message)
//     throw error
//   }
// }
