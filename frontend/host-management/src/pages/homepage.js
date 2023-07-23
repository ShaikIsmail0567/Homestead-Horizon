import React from 'react'
import Footer from '../components/footer';
import Gowithapp from '../components/Gowithapp';



import style from "../components/styles/Home.module.css";

export default function Home() {



  return (
    <div className={style.home}>

      <div className={style.home_big_img_div}>
        <img src="https://a.travel-assets.com/travel-assets-manager/cmct-5255/POSa-HP-Hero-D-928x398.jpg" alt="" />
         </div>
      <Gowithapp />
      <Footer />
    </div>
  )
}

