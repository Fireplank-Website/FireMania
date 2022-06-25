import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsChat, BsHeart, BsHeartFill, BsShare, BsTrash } from "react-icons/bs";
import { HiChartBar, HiDotsHorizontal } from "react-icons/hi";
import { db } from "../firebase";

interface Props {
    id: string;
    comment: DocumentData;
    postId: string;
}

const Comment: React.FC<Props> = ({ id, comment, postId }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [likes, setLikes] = useState<DocumentData[]>([]);
    const [liked, setLiked] = useState<boolean>(false);

    const units = [
        ['year', 31536000000],
        ['month', 2628000000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
        ['second', 1000]
    ];

    const postTime = comment?.timestamp?.toDate();
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
        onSnapshot(collection(db, "posts", postId, "comments", id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
        ), [db, id]
    );

    useEffect(() => setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1), [likes]);

    const likeComment = async () => {
        if (liked) {
            await deleteDoc(doc(db, "posts", postId, "comments", id, "likes", session?.user?.uid));
        } else {
            await setDoc(doc(db, "posts", postId, "comments", id, "likes", session?.user?.uid), {
                id: session?.user?.uid,
            });
        }
    }

    return (
        <div className="p-3 flex border-b border-gray-700">
            <img src={comment?.userImg} alt="" className="h-11 w-11 rounded-full mr-4"/>
            <div className="flex flex-col space-y-2 w-full">
                <div className="flex justify-between">
                    <div className="text-[#6e767d]">
                        <div className="inline-block group">
                            <h4 className={`font-bold text-[15px] sm:text-base 
                            text-[#d9d9d9] group-hover:underline inline-block cursor-pointer`}>
                                {comment?.username}
                            </h4>
                            <span className={`text-sm sm:text-[15px] ml-1.5`}>@{comment?.tag}</span>
                        </div>
                        {" "}·{" "}
                        <span className="hover:underline text-sm sm:text-[15px] cursor-pointer">
                            {relatime(postTime - new Date())}
                        </span>
                        <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                            {comment?.comment}
                        </p>
                    </div>
                    <div className="icon group flex-shrink-0 ml-auto">
                        <HiDotsHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]"/>
                    </div>
                </div>
                <div className="text-[#6e767d] flex justify-between w-10/12">
                    <div className="icon group">
                        <BsChat className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>

                    {session?.user?.uid === comment?.id && (
                        <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteDoc(doc(db, "posts", postId, "comments", id));
                        }}
                        >
                            <div className="icon group-hover:bg-red-600/10">
                                <BsTrash className="h-5 group-hover:text-red-600" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center space-x-1 group"
                    onClick={(e) => {
                        e.stopPropagation();
                        likeComment();
                    }}>
                        <div className="icon group-hover:bg-pink-600/10">
                            {liked ? (
                                <BsHeartFill className="h-5 text-pink-600" />
                            ) : (
                                <BsHeart className="h-5 group-hover:text-pink-600" />
                            )}
                        </div>
                        {likes.length > 0 && (
                        <span
                            className={`group-hover:text-pink-600 text-sm select-none ${
                            liked && "text-pink-600"
                            }`}
                        >
                            {likes.length}
                        </span>
                        )}
                        <span className="group-hover:text-pink-600 text-sm"></span>
                    </div>

                    <div className="icon group">
                        <BsShare className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>
                    <div className="icon group">
                        <HiChartBar className="h-5 group-hover:text-[#1d9bf0]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment;