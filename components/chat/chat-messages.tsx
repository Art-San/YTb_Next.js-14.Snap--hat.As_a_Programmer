'use client'
import { IMessageDocument } from '@/models/messageModel'
import { PopulatedDoc } from 'mongoose'
import { Session } from 'next-auth'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'

type ChatMessagesProps = {
  messages: IMessageDocument[] | PopulatedDoc<IMessageDocument>[]
  session: Session | null
}

const ChatMessages = ({ messages, session }: ChatMessagesProps) => {
  const lastMsgRef = useRef<HTMLDivElement>(null)
  const [isPreviewingImage, setIsPreviewingImage] = useState({
    open: false,
    imgURL: ''
  })

  // Скролить вниз если сообщение за экраном
  useEffect(() => {
    lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className="flex flex-col space-y-4 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh -  200px)' }}
    >
      {messages.map((message, idx) => {
        const amISender = message.sender._id === session?.user?._id
        const senderFullName = message.sender.fullName.toUpperCase()
        const isMessageImage = message.messageType === 'image'
        const isPrevMessageFromSameSender =
          idx > 0 && messages[idx - 1].sender._id === message.sender._id
        // Скролить вниз если картинка за экраном
        const handleImageLoad = () => {
          lastMsgRef.current?.scrollIntoView({ behavior: 'smooth' })
        }

        return (
          <div key={message._id} className="w-full" ref={lastMsgRef}>
            {!isPrevMessageFromSameSender && (
              <p
                className={`font-bold mt-2 text-xs ${
                  amISender ? 'text-sigSnapImg' : 'text-sigSnapChat'
                }`}
              >
                {amISender ? 'ME' : senderFullName}
              </p>
            )}
            <div
              className={`border-l-2 ${
                amISender ? 'border-l-sigSnapImg' : 'border-l-sigSnapChat'
              }`}
            >
              <div className={`flex items-center w-1/2 p-2 rounded-sm `}>
                {isMessageImage ? (
                  <div className="relative">
                    <Image
                      src={message.content}
                      width={200}
                      height={200}
                      className="h-auto w-auto object-cover cursor-pointer"
                      alt="Image"
                      onLoad={handleImageLoad}
                      onClick={() =>
                        setIsPreviewingImage({
                          open: true,
                          imgURL: message.content
                        })
                      }
                    />
                  </div>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
              </div>
            </div>
          </div>
        )
      })}

      <Dialog
        open={isPreviewingImage.open}
        onOpenChange={() => setIsPreviewingImage({ open: false, imgURL: '' })}
      >
        <DialogContent
          className="max-w-4xl h-3/4 bg-sigMain border border-sigColorBgBorder outline-none"
          autoFocus={false}
        >
          <Image
            src={isPreviewingImage.imgURL}
            fill
            className="object-contain p-2"
            alt="image"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default ChatMessages
