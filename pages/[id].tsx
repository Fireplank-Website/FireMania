import { collection, doc, DocumentData, onSnapshot, orderBy, query } from "firebase/firestore";
import { getProviders, getSession, GetSessionParams, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import Comment from "../components/Comment";
import Login from "../components/Login";
import Modal from "../components/Modal";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { db } from "../firebase";
import { modalState } from "../state";

const PostPage: React.FC = ({trending, follow, providers}) => { 
    const { data: session } = useSession();
    const { isOpen, setIsOpen } = modalState();
    const [comments, setComments] = useState<DocumentData[]>([]);
    const [post, setPost] = useState<DocumentData>();
    const router = useRouter();
    const { id } = router.query;

    if (!session) return <Login providers={providers}/>

    useEffect(
        () =>
          onSnapshot(doc(db, "posts", id), (snapshot) => {
            setPost(snapshot.data());
          }),
        [db]
      );
    
    useEffect(
        () =>
        onSnapshot(
            query(
                collection(db, "posts", id, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        ),
        [db, id]
    );

    return (
        <div>
            <Head>
                <title>{post?.username} on FireMania: "{post?.text}"</title>
                <link rel="icon" href="/favicon.ico" />
            </Head> 

            <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
                <Sidebar/>
                <div className="flex-grow border-l border-r border-gray-700 max-w-2xl
                sm:ml-[73px] xl:ml-[370px]">
                    <div className="flex items-center px-1.5 py-2 border-b border-gray-700
                    text-[#d9d9d9] font-semibold text-xl sticky gap-x-4 bg-black z-50">
                        <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
                        onClick={() => router.push("/")}>
                            <BsArrowLeft className="h-5 text-white"/>
                        </div>
                        Tweet
                    </div>

                    <Post id={id as string} post={post!} postPage/>
                    {comments.length > 0 && (
                        <div className="pb-72">
                            {comments.map((comment) => (
                                <Comment key={comment.id} id={comment.id} postId={id as string} comment={comment.data()}/>
                            ))}
                        </div>
                    )}
                </div>

                <Widgets trending={trending} follow={follow}/>
                {isOpen && <Modal/>}
            </main>
        </div>
    )
}

export async function getServerSideProps(context: GetSessionParams | undefined) {
    const trending = await fetch("https://jsonkeeper.com/b/6N0K").then(res => res.json());
    const follow = await fetch("https://jsonkeeper.com/b/TO1B").then(res => res.json());
  
    const providers = await getProviders();
    const session = await getSession(context);
  
    return {
      props: {
        trending,
        follow,
        providers,
        session,
      },
    };
}

export default PostPage;
