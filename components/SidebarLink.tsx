import { FC } from "react"
import { IconType } from "react-icons";
import React from "react";


interface Props {
  name: string;
  path: string;
  active?: boolean;
  icon: IconType;
}

const SidebarLink: FC<Props> = (props) => {
  return (
    <a href={props.path}>
      <div className={`text-[#d9d9d9] xl:ml-24 flex items-center justify-center
      xl:justify-start text-xl space-x-3 hoverAnimation ${props.active && "font-bold"}`}>
          <props.icon className="h-7"/>
          <div className="hidden xl:inline">{props.name}</div>
      </div>
    </a>
  )
}
export default SidebarLink