import { collection, deleteDoc, doc, DocumentData, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
import { BsChat, BsHeart, BsHeartFill, BsShare, BsTrash } from "react-icons/bs";
import { HiChartBar, HiDotsHorizontal } from "react-icons/hi";
import { db } from "../firebase";
import { modalState, postIdState } from "../state";

interface Props {
    id: string;
    post: DocumentData;
    postPage: boolean;
}



const Post: React.FC<Props> = ({ id, post, postPage }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { isOpen, setIsOpen } = modalState();
    const { postId, setPostId } = postIdState();
    const [comments, setComments] = useState<DocumentData[]>([]);
    const [likes, setLikes] = useState<DocumentData[]>([]);
    const [liked, setLiked] = useState<boolean>(false);

    useEffect(() => 
        onSnapshot(
            query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
            (snapshot) => setComments(snapshot.docs)
        ),
        [db, id]
    );
    
    useEffect(() => 
        onSnapshot(collection(db, "posts", id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
        ), [db, id]
    );

    useEffect(() => setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1), [likes]);

    const likePost = async () => {
        if (liked) {
            await deleteDoc(doc(db, "posts", id, "likes", session?.user?.uid));
        } else {
            await setDoc(doc(db, "posts", id, "likes", session?.user?.uid), {
                id: session?.user?.uid,
            });
        }
    }

    const units = [
        ['year', 31536000000],
        ['month', 2628000000],
        ['day', 86400000],
        ['hour', 3600000],
        ['minute', 60000],
        ['second', 1000]
    ];

    const postTime = post?.timestamp?.toDate();
    const rtf = new Intl.RelativeTimeFormat('en', { style: postPage ? 'long' : 'narrow'})
    const relatime = (elapsed: number) => {
        if (postTime === undefined) return postPage ? "0 seconds ago" : "0 sec. ago";
        for (const [unit, amount] of units) {
            if (Math.abs(elapsed) > amount || unit === 'second') {
                return rtf.format(Math.round(elapsed/amount), unit);
            }
        }
    }

    return (
        <div className="p-3 flex cursor-pointer border-b border-gray-700"
        onClick={() => router.push(`/${id}`)}>
            {!postPage && (
                <img src={post?.userImg} alt="avatar" className="h-11 w-11 rounded-full mr-4"/>
            )}
            <div className="flex flex-col space-y-2 w-full">
                <div className={`flex ${!postPage && "justify-between"}`}>
                    {postPage && (
                        <img src={post?.userImg} alt="avatar" className="h-11 w-11 rounded-full mr-4"/>
                    )}
                    <div className="text-[#6e767d]">
                        <div className="inline-block group">
                            <h4 className={`font-bold text-[15px] sm:text-base 
                            text-[#d9d9d9] group-hover:underline ${!postPage && "inline-block"}`}>
                                {post?.username}
                            </h4>
                            <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>@{post?.tag}</span>
                        </div>
                        {" "}·{" "}
                        <span className="hover:underline text-sm sm:text-[15px]">
                            {relatime(postTime - new Date())}
                        </span>
                        {!postPage && <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                            {post?.text}
                        </p>}
                    </div>
                    <div className="icon group flex-shrink-0 ml-auto">
                        <HiDotsHorizontal className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]"/>
                    </div>
                </div>
                {postPage && (
                    <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                        {post?.text}
                    </p>
                )}
                <img src={post?.image} alt="" className="select-none rounded-2xl object-contain max-h-[500px]"/>
                <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && "mx-auto"}`}>
                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                        e.stopPropagation();
                        setPostId(id);
                        setIsOpen(true);
                        }}
                    >
                        <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                            <BsChat className="h-5 group-hover:text-[#1d9bf0]" />
                        </div>
                        {comments.length > 0 && (
                        <span className="group-hover:text-[#1d9bf0] text-sm select-none">
                            {comments.length}
                        </span>
                        )}
                    </div>

                    {session.user.uid === post?.id ? (
                        <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteDoc(doc(db, "posts", id));
                            router.push("/");
                        }}
                        >
                            <div className="icon group-hover:bg-red-600/10">
                                <BsTrash className="h-5 group-hover:text-red-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1 group">
                            <div className="icon group-hover:bg-green-500/10">
                                <AiOutlineRetweet className="h-5 group-hover:text-green-500" />
                            </div>
                        </div>
                    )}

                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            likePost();
                        }}
                    >
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

export default Post;