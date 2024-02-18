// Footer.jsx

import React from 'react';
import style from './Footer.module.scss';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footerContainer}>
        <div className={`${style.allFooterContent} ${style.footerPart}`}>
          <div className={style.leftFooterContainer}>
            <div className={style.leftFirstRow}>
              <h6>TraveloHI</h6>
              <ul>
                <li>Jl. Jalur Sutera Barat No. 10, Alam Sutera, Tangerang</li>
              </ul>
            </div>
            <div className={style.leftSecondRow}>
              <h6 className={style.customerServiceText}>Customer Service</h6>
              <h5 className={style.phoneNumberFooter}>0813173717317</h5>
              <p className={style.emailContactFooter}>info.jakarta@vhotel.com</p>
            </div>
          </div>
          <div className={`${style.centerFooterContainer} ${style.footerPart}`}>
            <h6>Information</h6>
            <ul>
              <li><Link to={'/'}>Home</Link></li>
              <li><Link to={'/my-cards'}>My Cards</Link></li>
              <li><Link to={'/check-location'}>Check Location</Link></li>
              <li><Link to={'/personal-information'}>Profile</Link></li>
              <li><Link to={'/game'}>Game</Link></li>
            </ul>
          </div>
          <div className={`${style.rightFooterContainer} ${style.footerPart}`}>
            <h6>Sign up for offer, news, and travel inspiration</h6>
            <form action="">
              <div className={style.footerInputContainer}>
                <input type="email" className={style.footerInput} placeholder="email@example.com" />
                <img src="../assets/images/about-us/right-arrow.png" className={style.centerFooterInput} alt="" />
              </div>
            </form>
  
            <div className={style.socialMediaContainer}>
              <a href="https://facebook.com/" className={style.socialMedia}>
                <img src="../FooterImages/facebook-app-symbol.png" alt="facebook" />
              </a>
              <a href="https://linkedin.com/" className={style.socialMedia}>
                <img src="../FooterImages/linkedin.png" alt="linkedin" />
              </a>
              <a href="https://twitter.com/" className={style.socialMedia}>
                <img src="../FooterImages/twitter.png" alt="twitter" />
              </a>
              <a href="https://instagram.com/" className={style.socialMedia}>
                <img src="../FooterImages/instagram.png" alt="instagram.png" />
              </a>
              <a href="https://youtube.com/" className={style.socialMedia}>
                <img src="../FooterImages/youtube.png" alt="youtube" />
              </a>
            </div>
          </div>
        </div>
        <div className={style.copyRightFooter}>
          <h4>@Copyright Eldrian Daniswara Giovanni - DG23-2</h4>
        </div>
      </div>
    </footer>
  );
}
