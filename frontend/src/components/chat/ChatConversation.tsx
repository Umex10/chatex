"use client"

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Smile, BadgeCheck, SquareAsterisk, Check, ArrowLeft } from 'lucide-react'
import { useTheme } from "next-themes"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Button } from '@/components/ui/button'
import Avatar from '@/components/account/Avatar'
import { User } from '@/types/User'
import { useRouter } from 'next/navigation'
import { joinedAccountDate } from '@/utils/joinedDate'
import { Message } from '@/types/Message'
import { useWebSocket } from './WebSocketProvider'
import { Input } from '../ui/input'
import { SendHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@redux/store'
import { setInitialMessages } from '@redux/api/slices/chatSlice'
import { CheckCheck } from 'lucide-react';

/**
 * Props for the ChatConversation component.
 */
interface ChatConversationProps {
  /** The chat ID for this conversation */
  chatId: string,
  /** Initial messages for the chat */
  messages: Message[];
  /** The user you are chatting with */
  chatUser: {
    /** Display name of the chat user */
    name: string,
    /** Username of the chat user */
    username: string,
    /** Avatar image URL */
    avatar: string,
    /** ISO date string when the user was created */
    createdUserAt: string
  },
  /** The current logged-in user */
  meUser: User
}

/**
 * ChatConversation component displays a chat interface between two users.
 * Handles message sending, emoji picker, and message rendering.
 */
export default function ChatConversation({ chatId, messages, chatUser, meUser }: ChatConversationProps) {
  const [inputText, setInputText] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const client = useWebSocket();
  const dispatch = useDispatch<AppDispatch>();

  const { resolvedTheme } = useTheme()
  const emojiRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && buttonRef.current) {
      buttonRef.current.click();
    }
  };

  useEffect(() => {
    if (messages) {
      dispatch(setInitialMessages({ chatId: chatId, messages: messages }));
    }
  }, [messages, chatId, dispatch]);

  const messagesView = useSelector((state: RootState) =>
    state.chatState.messagesByChat[chatId] || []
  );

  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showEmojiPicker])

  const handleEmojiSelect = (emoji: { native: string }) => {
    setInputText((prev) => prev + emoji.native)
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const send = () => {
    if (!inputText) return;

    setInputText("");

    if (client && client.connected) {

      client?.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({
          text: inputText,
          receiverUsername: chatUser?.username,
          chatId: chatId
        })
      });
    } else {
      console.error("The connection was not ready yet.")
    }

    console.log("Message was sent.")
  }

  return (
    <div className='flex flex-col h-full w-full text-white'>
      {/* Header */}
      <div className='flex flex-row items-center  px-4 py-3'>
        <div className='flex items-center gap-3'>
          {/* Back Button */}
          <Button
            className="md:hidden bg-transparent [&_svg]:!size-6 px-0"
            onClick={() => router.back()}
            aria-label="Back"
            data-testid="return-btn"
          >
            <ArrowLeft />
          </Button>
          <div className='w-14 h-14 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center'>
            <Avatar avatar={chatUser?.avatar ? "" : ""} />
          </div>
          <div className='flex items-center gap-1 font-bold text-xl'>
            {chatUser?.name}
            <BadgeCheck className="w-5 h-5 text-yellow-500 fill-current" />
            <SquareAsterisk className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative'>

        {/* Account Info Center */}
        <div className='flex flex-col items-center justify-center mt-6 mb-8 gap-1'>
          <div className='w-14 h-14 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center mb-2'>
            <Avatar avatar={chatUser?.avatar ? "" : ""} />
          </div>
          <div className='flex items-center gap-1 font-bold text-xl'>
            {chatUser?.username}
            <BadgeCheck className="w-5 h-5 text-yellow-500 fill-current" />
            <SquareAsterisk className="w-4 h-4 text-gray-400" />
          </div>
          <span className='text-gray-500 text-base'>@{chatUser?.username}</span>
          <span className='text-gray-500 text-base'>{joinedAccountDate(chatUser?.createdUserAt ?? "")}</span>

          <Button variant="outline" className="mt-4 rounded-full bg-white text-black 
          font-bold px-6 py-2 border-none"
            onClick={() => router.push(`/${chatUser?.username}`)}>
            Account anzeigen
          </Button>
        </div>

        <div className="flex justify-center mb-4">
          <span className="text-gray-500 text-sm font-medium">Today</span>
        </div>

        {messagesView.map((msg, index) => {

          const isMe = msg.senderUsername === meUser.username;

          return (
            <div
              key={index}
              className={`flex flex-col w-full ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`px-4 py-2.5 max-w-[85%] sm:max-w-[60%] ${isMe
                  ? 'bg-violet-600 text-white rounded-t-3xl rounded-bl-3xl rounded-br-sm'
                  : 'bg-emerald-600 text-white rounded-t-3xl rounded-br-3xl rounded-bl-sm'
                  }`}
              >
                {/* {msg.image && (
                  <Image src={msg.image} alt="attached" className="max-w-full rounded-md mb-2 object-contain"
                    width={200}
                    height={200} />
                )} */}
                {msg.text && (
                  <div className="flex items-end gap-2 text-[15px]">
                    <span className="break-words whitespace-pre-wrap leading-tight">{msg.text}</span>
                    {/* Dazn style inline time on messages */}
                    {isMe && (
                      <span className="text-[11px] opacity-80 mb-[-2px] whitespace-nowrap ml-1 font-medium
                      flex items-center">
                        {formatTime(msg.createdAt)}
                        <span className="inline-flex items-center">
                          {!msg.seen ? (

                            <Check className="w-4 h-4" />
                          ) : (

                            <CheckCheck className="w-4 h-4 text-zinc-400 shadow-sm" />
                          )}
                        </span>

                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Toolbar / Input Area */}
      <div className='p-3 px-4 pb-4 border-t border-white/10 bg-gradient-to-b from-violet-600/50 to-slate-800'>
        <div className='flex items-center gap-2 w-full'>

          <div className="relative flex-shrink-0" ref={emojiRef}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 bg-zinc-800/80 hover:bg-zinc-700 text-gray-200"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
            >
              <Smile className="w-5 h-5" />
            </Button>
            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-3 z-50">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme={resolvedTheme === "dark" ? "dark" : "light"}
                  previewPosition="none"
                />
              </div>
            )}
          </div>

          <div className="flex-1 bg-zinc-800/80 rounded-full px-4 py-2.5 flex flex-row items-center border border-transparent focus-within:border-[#1d9bf0]">
            <Input
              type="text"
              className='w-full bg-transparent border-none outline-none focus:ring-0 text-[15px] text-white placeholder:text-gray-500'
              placeholder='Message'
              value={inputText}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-10 h-10 bg-zinc-800/80 hover:bg-zinc-700 
            text-gray-200 flex-shrink-0"
            ref={buttonRef}
            onClick={() => send()}
          >
            <SendHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
