import { addDoc, collection, deleteDoc, doc, DocumentData, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { HiOutlineCalendar, HiOutlineChartBar, HiOutlineEmojiHappy, HiOutlinePhotograph, HiX } from "react-icons/hi";
import { useStore } from "zustand";
import { db } from "../firebase";
import { modalState, postIdState } from "../state";


const Picker = dynamic(() => import("./EmojiPicker"), {
    ssr: false,
});
  


const Modal = () => {
    const { data: session } = useSession();
    const [showEmojis, setShowEmojis] = useState<boolean>(false);
    const [isOpen, setIsOpen] = modalState(state => [state.isOpen, state.setIsOpen])
    const { postId, setPostId } = postIdState();
    const [post, setPost] = useState<DocumentData>();
    const [comment, setComment] = useState("");
    const modalRef = useRef<HTMLDivElement>(null);
    const emojiPickRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const units = [
        ['year', 31536000000],
        ['month', 2628000000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
        ['second', 1000]
    ];

    const postTime = post?.timestamp?.toDate();
    const rtf = new Intl.RelativeTimeFormat('en', { style: 'long'})
    const relatime = (elapsed: number) => {
        if (postTime === undefined) return "0 seconds ago";
        for (const [unit, amount] of units) {
            if (Math.abs(elapsed) > amount || unit === 'second') {
                return rtf.format(Math.round(elapsed/amount), unit);
            }
        }
    }

    useEffect(() =>
          onSnapshot(doc(db, "posts", postId), (snapshot) => {
            setPost(snapshot.data());
          }),
        [db]
    );

    useEffect(() => {
        // check if modal is visible
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }

        /**
         * Check if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            if (modalRef.current && !modalRef.current.contains(event.target) && !emojiPickRef?.current?.contains(event.target)) {
                setIsOpen(false);
            } else if (emojiPickRef.current && !emojiPickRef.current.contains(event.target)) {
                setShowEmojis(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // make scrollable again
            document.body.style.overflow = "auto";
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalRef, emojiPickRef]);


    const sendComment = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        await addDoc(collection(db, "posts", postId, "comments"), {
            id: session?.user?.uid,
            comment: comment,
            username: session.user.name,
            tag: session.user.tag,
            userImg: session.user.image,
            timestamp: serverTimestamp(),
        });
    
        setIsOpen(false);
        setComment("");
    
        router.push(`/${postId}`);
    };
    

    return (
        <div className={`absolute z-50 w-screen h-[10000vh] bg-[#5b7083] bg-opacity-40 top-0 left-0`}>
            <div className="fixed inset-0 pt-8">
                <div className="text-white flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div ref={modalRef} className="inline-block align-bottom scrollBar bg-black rounded-2xl text-left overflow-hidden shadow-xl
                    transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                        <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                            <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0" onClick={() => setIsOpen(false)}>
                                <HiX className="h-[22px] text-white"/>
                            </div>
                        </div>
                        <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                            <div className="w-full">
                                <div className="text-[#6e767d] flex gap-x-3 relative">
                                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bgb-gray-600"/>
                                    <img src={post?.userImg} alt="" className="h-11 w-11 rounded-full"/>
                                    <div>
                                        <div className="inline-block group">
                                            <h4 className="font-bold text-[15px] sm:text-base 
                                            text-[#d9d9d9] inline-block">{post?.username}</h4>
                                            <span className="ml-1.5 text-sm sm:text-[15px]">
                                                @{post?.tag}
                                            </span>
                                        </div>
                                        {" "}·{" "}
                                        <span className="text-sm sm:text-[15px] hover:underline">
                                            {relatime(postTime - new Date())}
                                        </span>
                                        <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                                            {post?.text}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-7 flex space-x-3 w-full">
                                    <img src={session?.user?.image ?? "/images/avatar-placeholder.png"} alt="" className="h-11 w-11 rounded-full"/>
                                    <div className="flex-grow mt-2">
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Tweet your reply"
                                            rows={2}
                                            className="bg-transparent outline-none text-[#d9d9d9] max-h-[60vh] scrollBar text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                                        />
                                        <div className="flex items-center justify-between pt-2.5">
                                            <div className="flex items-center">
                                                <div className="icon">
                                                    <HiOutlinePhotograph className="text-[#1d9bf0] h-[22px]" />
                                                </div>
                                                
                                                <div className="icon rotate-90">
                                                    <HiOutlineChartBar className="text-[#1d9bf0] h-[22px]" />
                                                </div>

                                                <div className='icon' onClick={() => setShowEmojis(!showEmojis)}>
                                                    <HiOutlineEmojiHappy className="text-[#1d9bf0] h-[22px]" />
                                                </div>

                                                <div className="icon">
                                                    <HiOutlineCalendar className="text-[#1d9bf0] h-[22px]" />
                                                </div>
                                            </div>
                                            <button
                                                className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                                                type="submit"
                                                onClick={sendComment}
                                                disabled={!(comment.trim().length > 1)}
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showEmojis && (
                        <div className="flex items-center pt-2.5 justify-center ">
                            <div ref={emojiPickRef} className='select-none absolute mt-[21rem] mr-[6.5rem] max-w-[320px] border-r-[20px] min-h-[20rem] z-[100] hidden sm:inline'>
                                <Picker
                                    onEmojiSelect={(emoji: { native: string; }) => { setComment(comment + emoji.native); setShowEmojis(false); }}
                                    theme="dark"                                
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Modal;