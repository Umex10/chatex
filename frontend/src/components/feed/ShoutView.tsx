"use client"

import { CldImage } from "next-cloudinary"
import { BadgeCheck } from "lucide-react"
import { Badge } from "../ui/badge"
import Avatar from "../profile/Avatar"
import { joinedShoutDate } from "@/utils/joinedDate"
import { ShoutQuote } from "@/types/Shout"
import { useRouter } from "next/navigation"

/**
 * Read-only preview of a quoted shout.
 * Renders with the exact same layout as OneShout — avatar, author info, text and images — 
 * but without engagement stats or action buttons.
 * Used inside the ShoutComposer when variant is QUOTE.
 */
export function ShoutView({quotedShoutId, name, username, avatar, text, images, createdAt }: ShoutQuote) {

  const router = useRouter();

  return (
    <div className="w-full mt-2 select-none border border-border rounded-xl p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
    onClick={(e) => {
      router.push(`/${username}/${quotedShoutId}`);
      e.stopPropagation();
    }}>
      {/* row layout: avatar column + content column */}
      <div className='flex flex-row gap-2 pt-1'>
        {/* left column: account avatar */}
        <Avatar avatar={avatar} />
        
        {/* right column: meta info, text, media */}
        <div className='flex flex-col flex-1 gap-0 items-start'>
          {/* meta row: name, verified badge, username and time */}
          <div className='w-full flex flex-row'>
            <div className='flex flex-row flex-1 gap-1 items-center text-base'>
              <span className='font-bold max-w-[80px] truncate 
                md:max-w-none md:whitespace-normal'>{name}</span>

              {/* Verified Badge */}
              <Badge
                variant="secondary"
                className="p-0 bg-transparent border-none shadow-none hover:bg-transparent"
              >
                <BadgeCheck className="w-5 h-5 text-white" />
              </Badge>

              <span className='max-w-[80px] truncate 
                md:max-w-none md:whitespace-normal'>@{username}</span>

              <span>·</span>

              <span>{joinedShoutDate(createdAt)}</span>
            </div>
          </div>

          {/* body section: shout text and media */}
          <div className='flex flex-col gap-2 items-start w-full'>
            {/* post text content */}
            <p className='text-lg'>{text}</p>

            {/* post image/media preview — X-style adaptive grid, same as OneShout */}
            {images.length > 0 && (
              <div className="w-full mt-1">
                {/* Single Image Layout */}
                {images.length === 1 && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                    <CldImage
                      fill src={images[0]} alt="Quoted image" crop="fill" format="auto"
                      quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                      blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${images[0]}`}
                    />
                  </div>
                )}

                {/* Two Images Grid */}
                {images.length === 2 && (
                  <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
                    {images.map((img, i) => (
                      <div key={img} className="relative aspect-square">
                        <CldImage
                          fill src={img} alt={`Quoted image ${i + 1}`} crop="fill" format="auto"
                          quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                          blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Three Images Grid */}
                {images.length === 3 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-72 rounded-2xl overflow-hidden">
                    <div className="relative row-span-2">
                      <CldImage
                        fill src={images[0]} alt="Quoted image 1" crop="fill" format="auto"
                        quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                        blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${images[0]}`}
                      />
                    </div>
                    {images.slice(1).map((img, i) => (
                      <div key={img} className="relative">
                        <CldImage
                          fill src={img} alt={`Quoted image ${i + 2}`} crop="fill" format="auto"
                          quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                          blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Four Images Grid */}
                {images.length === 4 && (
                  <div className="grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
                    {images.map((img, i) => (
                      <div key={img} className="relative aspect-square">
                        <CldImage
                          fill src={img} alt={`Quoted image ${i + 1}`} crop="fill" format="auto"
                          quality="auto" sizes="300px" className="object-cover" placeholder="blur"
                          blurDataURL={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_10,q_30,e_blur:1000/${img}`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
