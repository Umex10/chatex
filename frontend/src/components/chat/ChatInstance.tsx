"use client"

import { joinedShoutDate } from '@/utils/joinedDate'
import { useDeleteChatMutation, useGetChatQuery } from '@redux/api/apis/chatApi'
import { CldImage } from 'next-cloudinary'
import { usePathname, useRouter } from 'next/navigation'
import TrashButton from '../shared/TrashButton'
import { Message } from '@/types/Message'
import { User } from '@/types/User'
import { Badge } from '../ui/badge'

interface MessageArgs {
  meUser: User,
  chatId: string,
  avatar: string,
  name: string,
  lastMessage: Message,
  unseenMessages: number
}

const ChatInstance = ({ meUser, chatId, avatar, name, lastMessage, unseenMessages }: MessageArgs) => {

  const avatarSrc = avatar ? avatar : "user-avatar_yr4qhg";

  const router = useRouter();
  const path = usePathname().split("/")
  const chatIdInURL = path[3]; // this will ensure that we don't fetch the chat unnecessarily
  const isSameChat = chatId === chatIdInURL;

  const [deleteChat, { isLoading }] = useDeleteChatMutation();

  const isLastMessageFromMe = meUser.username === lastMessage?.senderUsername;

  return (
    <div className={`px-3 py-5 w-full flex flex-row items-center gap-2 hover:bg-gray-800 
    ${isSameChat ? "bg-gray-800/50" : ""} transition ease-out duration-400`}
      onClick={() => {
        if (!isSameChat) {
          router.push(`/chat/messages/${chatId}`)
        }
      }}>

      <div className="relative w-15 h-15 rounded-full border-4 border-black 
      overflow-hidden bg-zinc-900">
        <CldImage
          width="56"
          height="56"
          src={avatarSrc}
          alt="User Avatar"
          crop="thumb"
          gravity="face"
          format="auto"
          quality="auto"
          className="w-full h-full object-cover"
        />
      </div>

      <div className='flex-1 w-full flex flex-col gap-1'>

        <div className='w-full flex flex-row items-start gap-2'>
          <p className='font-bold w-full flex-1 truncate md:whitespace-normal text-base'>
            {name}
          </p>

          <div className='flex flex-row gap-1 items-center'>
            {lastMessage?.createdAt && (
              <p className='text-base opacity-70'>
                {joinedShoutDate(lastMessage?.createdAt)}
              </p>
            )}
            <TrashButton deleteQuery={() => {
              deleteChat(chatId);
              router.back();
            }}></TrashButton>

            {unseenMessages >= 1 && !isLastMessageFromMe && (
              <Badge>{unseenMessages}</Badge>
            )}
          </div>

        </div>
        <div className='opacity-70 text-base flex flex-row gap-1 items-center'>
          {lastMessage?.senderUsername && (
            <>
              <span className='font-bold'>
                {isLastMessageFromMe ? "You" : lastMessage?.senderUsername}
              </span>

              <span className='opacity-70'>
                {lastMessage?.text}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatInstance
