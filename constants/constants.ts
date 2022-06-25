import { HiOutlineDotsCircleHorizontal, HiDotsCircleHorizontal } from 'react-icons/hi';
import { AiOutlineHome, AiFillHome, AiOutlineBell, AiFillBell } from 'react-icons/ai';
import { RiUser3Fill, RiUser3Line } from 'react-icons/ri';

export const LinkItems = [
    { name: 'Home', icon: AiOutlineHome, path: '/' },
    { name: 'Notifications', icon: AiOutlineBell, path: '/notifications' },
    { name: 'Profile', icon: RiUser3Line, path: '/profile' },
    { name: 'More', icon: HiOutlineDotsCircleHorizontal, path: '/more' },
  ];
