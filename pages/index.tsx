import type { NextPage } from 'next';
import Head from 'next/head';
import { getProviders, getSession, GetSessionParams, useSession } from 'next-auth/react';
import Login from '../components/Login';
import Sidebar from '../components/Sidebar';
import Feed from '../components/Feed';
import Modal from '../components/Modal';
import { modalState } from '../state';
import Widgets from '../components/Widgets';

const Home: NextPage = ({trending, follow, providers}) => {
  const isOpen = modalState(state => state.isOpen);
  const { data: session } = useSession();

  if (!session) return <Login providers={providers}/>

  return (
    <div>
      <Head>
        <title>Social Mania</title>
        <link rel="icon" href="/favicon.ico" />
      </Head> 

      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar/>
        <Feed/>
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

export default Home;