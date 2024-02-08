import { auth } from '@/auth'
import { getUsersForSidebar } from '@/lib/data'
import Chat from './chat'
import { IUserDocument } from '@/models/userModel'

interface IChatProps {
  chats: {
    _id: string
    participants: IUserDocument[]
    lastMessage: {
      sender: string
      receiver: string
    } | null
  }[]
}

// 2:37:10
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const Chats: React.FC<IChatProps> = async ({ chats }) => {
  // const session = await auth()
  await sleep(10000)
  // console.log('Chats session', session)
  // const chats = session?.user ? await getUsersForSidebar(session.user._id) : []
  // console.log('Chats chats', chats)
  return (
    <nav className="flex-1 overflow-y-auto">
      <ul>
        {chats.map((chat) => (
          <Chat key={chat._id} chat={chat} />
        ))}
      </ul>
    </nav>
  )
}
export default Chats
// import { auth } from '@/auth'
// import { getUsersForSidebar } from '@/lib/data'
// import Chat from './chat'

// const Chats = async () => {
//   const session = await auth()
//   const chats = session?.user ? await getUsersForSidebar(session.user._id) : []
//   return (
//     <nav className="flex-1 overflow-y-auto">
//       <ul>
//         {chats.map((chat) => (
//           <Chat key={chat._id} chat={chat} />
//         ))}
//       </ul>
//     </nav>
//   )
// }
// export default Chats
