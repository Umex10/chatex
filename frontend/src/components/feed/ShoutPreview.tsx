"use client"

import { CldImage } from "next-cloudinary"
import { BadgeCheck } from "lucide-react"
import { Badge } from "../ui/badge"
import Avatar from "../profile/Avatar"
import { joinedShoutDate } from "@/utils/joinedDate"
import { ShoutQuote } from "@/types/Shout"

/**
 * Read-only preview of a quoted shout.
 * Renders avatar, author info, text and images — no engagement stats or action buttons.
 * Used inside the ShoutComposer when variant is QUOTE.
 */
export function ShoutPreview({ name, username, avatar, text, images, createdAt }: ShoutQuote) {
  return (
    <div className="w-full rounded-xl border border-border p-3 mt-1 pointer-events-none select-none">
      {/* Author row */}
      <div className="flex flex-row gap-2 items-center mb-1">
        <Avatar avatar={avatar} />
        <div className="flex flex-row gap-1 items-center text-sm">
          <span className="font-bold">{name}</span>
          <Badge
            variant="secondary"
            className="p-0 bg-transparent border-none shadow-none hover:bg-transparent"
          >
            <BadgeCheck className="w-4 h-4 text-white" />
          </Badge>
          <span className="text-zinc-500">@{username}</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-500">{joinedShoutDate(createdAt)}</span>
        </div>
      </div>

      {/* Shout text */}
      {text && <p className="text-base mb-2">{text}</p>}

      {/* Images — same adaptive grid as OneShout */}
      {images.length > 0 && (
        <div className="w-full">
          {/* Single image */}
          {images.length === 1 && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <CldImage
                fill src={images[0]} alt="Quoted image" crop="fill" format="auto"
                quality="auto" sizes="500px" className="object-cover"
                placeholder="blur"
                blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${images[0]}`}
              />
            </div>
          )}

          {/* Two images */}
          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden">
              {images.map((img, i) => (
                <div key={img} className="relative aspect-square">
                  <CldImage
                    fill src={img} alt={`Quoted image ${i + 1}`} crop="fill" format="auto"
                    quality="auto" sizes="250px" className="object-cover"
                    placeholder="blur"
                    blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Three images */}
          {images.length === 3 && (
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-48 rounded-xl overflow-hidden">
              <div className="relative row-span-2">
                <CldImage
                  fill src={images[0]} alt="Quoted image 1" crop="fill" format="auto"
                  quality="auto" sizes="250px" className="object-cover"
                  placeholder="blur"
                  blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${images[0]}`}
                />
              </div>
              {images.slice(1).map((img, i) => (
                <div key={img} className="relative">
                  <CldImage
                    fill src={img} alt={`Quoted image ${i + 2}`} crop="fill" format="auto"
                    quality="auto" sizes="250px" className="object-cover"
                    placeholder="blur"
                    blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Four images */}
          {images.length >= 4 && (
            <div className="grid grid-cols-2 gap-0.5 rounded-xl overflow-hidden">
              {images.slice(0, 4).map((img, i) => (
                <div key={img} className="relative aspect-square">
                  <CldImage
                    fill src={img} alt={`Quoted image ${i + 1}`} crop="fill" format="auto"
                    quality="auto" sizes="250px" className="object-cover"
                    placeholder="blur"
                    blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
