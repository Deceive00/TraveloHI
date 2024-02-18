import { FaCreditCard, FaShoppingCart, FaHistory, FaBell, FaUser, FaGift, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import '../pages/ProfilePage/profilepage.module.scss'
import { LuSend } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaHotel } from "react-icons/fa";
import { RiAdvertisementFill } from 'react-icons/ri';

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
  {
    icon: <MdAdminPanelSettings className='logoutMenuIcon'/>,
    text: 'Admin',
    onClick: '/admin'
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
  {
    icon: <FaHotel className='profileMenuIcon'/>,
    text: 'Manage Hotels',
    onClick: '/admin/manage-hotels'
  },
  {
    icon: <RiAdvertisementFill className='profileMenuIcon'/>,
    text: 'Insert Promos',
    onClick: '/admin/insert-promos'
  },
  {
    icon: <RiAdvertisementFill className='profileMenuIcon'/>,
    text: 'Manage Promos',
    onClick: '/admin/manage-promos'
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

export const TRAVEL_WITH_TRAVELOHI_REASONS : IReason[] = [
  {
    title: "All your needs in one place",
    description: "From plane tickets, accommodation, to activities, Traveloka has complete products and the right travel guides",
    image: "https://ik.imagekit.io/tvlk/image/imageResource/2023/06/14/1686718660877-9be996f016d2325a96f0dc96f2524e21.webp?tr=dpr-2,h-64,q-75,w-64"
  },
  {
    title: "Flexible booking options",
    description: "Need to be prepared for the unexpected? Don't worry, there is Easy Reschedule & Refund.",
    image: "https://ik.imagekit.io/tvlk/image/imageResource/2023/06/14/1686718664559-4c61b3ca4f7e0e017b0484a9fa75c1a9.webp?tr=dpr-2,h-64,q-75,w-64",
  },
  {
    title: "Secure and convenient payment",
    description: "Enjoy transactions with multiple layers of security, as well as a variety of global & national payment options.",
    image: "https://ik.imagekit.io/tvlk/image/imageResource/2023/06/14/1686718666471-4704fb071d5cf321cde9e417e5baee0f.webp?tr=dpr-2,h-64,q-75,w-64"
  }
]


export const getBankImage = (bankName : string) => {
  const bank = BANK.find((b) => b.name === bankName);
  return bank ? bank.image : '/images/default-bank.png'; 
};