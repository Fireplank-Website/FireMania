import Image from "next/image"
import { FC, useState } from "react"
import SidebarLink from "./SidebarLink"
import { LinkItems } from "../constants/constants";
import { useRouter } from 'next/router';
import { BsDoorOpen, BsThreeDots } from 'react-icons/bs';
import { signOut, useSession } from "next-auth/react";

import { modalState, postIdState } from "../state";
const Sidebar: FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
      <div className="flex items-center justify-center w-30 h-14 hoverAnimation p-0 xl:ml-[6.8rem]">
        <a href="/"><Image
            src="/images/firemania_white.png"
            width={170}
            height={50}
            objectFit="contain"
        /></a>
      </div>
      <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-15">
        {LinkItems.map((item, index) => (
          <SidebarLink key={index} {...item} active={router.pathname === item.path ? true : false}/>
        ))}
      </div>
      <button className="hidden select-none xl:inline ml-auto bg-[#1d9bf0] text-white rounded-full w-56
      h-[52px] text-lg font-bold shadow-md hover:bg-[#1a8cd8]">
        Tweet
      </button>

      {showMenu && (
        <div className="hidden xl:inline select-none">
          <div className="absolute bottom-0 right-0 py-2 mb-[5rem] rounded-md w-44 mr-8">
            <div className="absolute inset-0 bg-neutral-50 blur-sm h-[60%] mt-2.5"/>
            <button className="block bg-black rounded-lg relative h-full w-full px-4 py-2
            text-sm text-gray-300 hover:bg-[#1a1a1a] hover:text-white" onClick={() => signOut()}>
              Sign Out
            </button>
          </div>
        </div>
      )}
      {showMenu && (
        <div className="sm:inline xl:hidden select-none">
          <div className="absolute bottom-0 right-0 py-2 mb-[5rem] rounded-md mr-2">
            <div className="absolute inset-0 bg-neutral-50 blur-sm h-[60%] mt-2.5"/>
            <button className="block bg-black rounded-lg relative h-full px-4 py-2
            text-sm text-gray-300 hover:bg-[#1a1a1a] hover:text-white" onClick={() => signOut()}>
              <BsDoorOpen/>
            </button>
          </div>
        </div>
      )}
      <div className="text-[#d9d9d9] flex items-center justify-center m-auto hoverAnimation xl:ml-24 fixed bottom-0 mb-4"
      onClick={() => setShowMenu(!showMenu)}>
        <img src={session?.user?.image ?? "/images/avatar-placeholder.png"} alt="avatar"
        className="h-10 w-10 rounded-full xl:mr-2.5"/>
        <div className="hidden xl:inline leading-5">
          <h4 className="font-bold">{session?.user?.name}</h4>
          <p className="text-[#6e767d]">@{session?.user?.tag}</p>
        </div>
        <BsThreeDots className="h-5 hidden xl:inline ml-10"/>
      </div>

    </div>
  )
}
export default Sidebar