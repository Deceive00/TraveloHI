import { FaCreditCard, FaShoppingCart, FaHistory, FaBell, FaUser, FaGift, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import '../pages/ProfilePage/profilepage.module.scss'
import { LuSend } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";

export const PROFILE_MENU = [
  {
    icon: <FaStar className='profileMenuIcon'/>,
    text: 'My Points',
    onClick: '/points'
  },
  {
    icon: <FaCreditCard className='profileMenuIcon'/>,
    text: 'My Cards',
    onClick: '/my-cards'
  },
  {
    icon: <FaShoppingCart className='profileMenuIcon'/>,
    text: 'My Orders',
    onClick: '/my-orders'
  },
  {
    icon: <FaHistory className='profileMenuIcon'/>,
    text: 'Order History',
    onClick: '/order-history'
  },
  {
    icon: <FaBell className='profileMenuIcon'/>,
    text: 'Notification',
    onClick: '/notifications'
  },
  {
    icon: <FaUser className='profileMenuIcon'/>,
    text: 'Saved Passenger Detail',
    onClick: '/saved-passengers'
  },
  {
    icon: <FaGift className='profileMenuIcon'/>,
    text: 'Promo Information',
    onClick: '/promotions-detail'
  },
  {
    icon: <FaCog className='profileMenuIcon'/>,
    text: 'Personal Information',
    onClick: '/personal-information'
  },
  {
    icon: <FaSignOutAlt className='logoutMenuIcon'/>,
    text: 'Logout',
    onClick: 'logout'
  },
];

export const ADMIN_MENU = [
  {
    icon: <LuSend className='profileMenuIcon'/>,
    text: 'Send Newsletter',
    onClick: '/admin/send-newsletter'
  },
  {
    icon: <FaUsers className='profileMenuIcon'/>,
    text: 'Manage Users',
    onClick: '/admin/manage-users'
  },
]

export const BANK = [
  {
    image: '/images/bank/bca.png',
    name: 'BCA (Bank Central Asia)',
  },
  {
    image: '/images/bank/bri.png',
    name: 'BRI (Bank Republik Indonesia)',
  },
  {
    image: '/images/bank/mandiri.png',
    name: 'Mandiri Bank',
  },
]
export const getBankImage = (bankName : string) => {
  const bank = BANK.find((b) => b.name === bankName);
  return bank ? bank.image : '/images/default-bank.png'; 
};