import { FC } from "react";
import Feed from "./Feed";
import Sidebar from "./Sidebar";

const Layout: FC<any> = ({children}) => {
  return (
    <div className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar/>
        <Feed/>
        <div className="">
            <main className="">
                {children}
            </main>
        </div>
        
    </div>
  )
}
export default Layout;