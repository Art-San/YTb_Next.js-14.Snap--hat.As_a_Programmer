import ChatCamera from '@/components/chat/chat-camera'
import Image from 'next/image'
import { revalidatePath, unstable_noStore as noStore } from 'next/cache'

export default async function ChatRootPage() {
  // noStore()
  // const res = await fetch('http://worldtimeapi.org/api/timezone/Asia/Tomsk', {
  //   cache: 'no-store'
  // })
  // const data = await res.json()

  return (
    <main className="flex-grow bg-sigMain items-center flex px-2">
      <div
        className="bg-chat bg-right-bottom
				rounded-3xl w-full h-[96%] flex items-center justify-center px-6"
      >
        {/* {data.datetime} */}
        <ChatCamera />
        <div className="hidden lg:block">
          <Image
            src={'/snapemoji.png'}
            width={500}
            height={600}
            alt="Snap avatar"
          />
        </div>
      </div>
    </main>
  )
}

// STARTER CODE FOR THIS FILE. TimeStamp to paste this code => 01:40:30
// import ChatCamera from "@/components/chat/chat-camera";
// import Image from "next/image";

// export default function ChatRootPage() {
// 	return (
// 		<main className='flex-grow bg-sigMain items-center flex px-2'>
// 			<div
// 				className='bg-chat bg-right-bottom
// 				rounded-3xl w-full h-[96%] flex items-center justify-center px-6'
// 			>
// 				<ChatCamera />
// 				<div className='hidden lg:block'>
// 					<Image src={"/snapemoji.png"} width={500} height={600} alt='Snap avatar' />
// 				</div>
// 			</div>
// 		</main>
// 	);
// }
