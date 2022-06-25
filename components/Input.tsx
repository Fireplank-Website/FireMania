import { useEffect, useRef, useState } from 'react';
import { BsXCircle } from 'react-icons/bs';
import { HiOutlineCalendar, HiOutlineChartBar, HiOutlineEmojiHappy, HiOutlinePhotograph } from 'react-icons/hi';
// import 'emoji-mart/css/emoji-mart.css';
import React from "react"
import dynamic from "next/dynamic"
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useSession } from 'next-auth/react';

const Picker = dynamic(() => import("./EmojiPicker"), {
  ssr: false,
});

const Input = () => {
    const [input, setInput] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [showEmojis, setShowEmojis] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const filePickRef = useRef<HTMLInputElement>(null);
    const emojiPickRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    const addImageToPost = (e: any) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target) {
                setSelectedFile(readerEvent.target.result as string);
            }
        }
    }

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, 'posts'), {
            id: session?.user?.uid, 
            username: session?.user?.name,
            userImg: session?.user?.image,
            tag: session?.user?.tag,
            text: input,
            timestamp: serverTimestamp(),
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "posts", docRef.id), { image: downloadURL });
            });
        }

        setLoading(false);
        setInput('');
        setSelectedFile(null);
        setShowEmojis(false);
    }

    useEffect(() => {
        /**
         * Check if clicked on outside of element
         */
        function handleClickOutside(event: any) {
          if (emojiPickRef.current && !emojiPickRef.current.contains(event.target)) {
              setShowEmojis(false);
          }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickRef]);

    return (
        <div className={`scrollBar border-b border-gray-700 p-3 flex max-h-[40rem] space-x-3 overflow-y-scroll ${loading && "opacity-60"}`}>
            <img
                src={session?.user?.image ?? "/images/avatar-placeholder.png"}
                alt="avatar"
                className="h-10 w-10 rounded-full cursor-pointer"
            />
            <div className="w-full divide-y divide-gray-700">
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea value={input} placeholder="What's happening?" onChange={(e)=>{setInput(e.target.value)}} rows={2} className='
                    min-h-[50px] pl-1 bg-transparent scrollBar outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full'/>
                    
                    {selectedFile && (
                        <div className='relative'>
                            <div className='absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full
                            flex items-center justify-center top-1 left-1 cursor-pointer' onClick={() => setSelectedFile(null)}>
                                <BsXCircle className='text-white h-5'/>
                            </div>
                            <img src={selectedFile} alt="" className='rounded-2xl max-h-80 object-contain'/>
                        </div> 
                    )}
                </div>

                {!loading && (
                    <div className='flex items-center justify-between pt-2.5'>
                        <div className='flex items-center'>
                            <div className='icon cursor-pointer' onClick={() => filePickRef.current!.click()}>
                                <HiOutlinePhotograph className=' h-[22px] text-[#1d9bf0]'/>
                                <input onChange={addImageToPost} ref={filePickRef} hidden type="file" accept="image/png, image/gif, image/jpeg"/>
                            </div>

                            <div className='icon cursor-pointer'>
                                <HiOutlineChartBar className=' h-[22px] text-[#1d9bf0]'/>
                            </div>

                            <div className='icon cursor-pointer' onClick={() => setShowEmojis(!showEmojis)}>
                                <HiOutlineEmojiHappy className=' h-[22px] text-[#1d9bf0]'/>
                            </div>

                            <div className='icon cursor-pointer'>
                                <HiOutlineCalendar className=' h-[22px] text-[#1d9bf0]'/>
                            </div>

                            {showEmojis && (
                                <div ref={emojiPickRef} className='select-none absolute mt-[465px] ml-[-40] max-w-[320px] border-r-[20px]'>
                                    <Picker
                                        onEmojiSelect={(emoji: { native: string; }) => { setInput(input + emoji.native); setShowEmojis(false); }}
                                        theme="dark"                                
                                    />
                                </div>
                            )}
                        </div>
                        <button className='bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold
                        shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default'
                        disabled={!(input.trim().length > 1) && !selectedFile}
                        onClick={sendPost}>
                            Tweet
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Input;