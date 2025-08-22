'use client'

import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {

    const [show, setShow] = useState(true);
    const pathName=usePathname()
    const [scroll,setScroll] = useState(0);
    function scrollHandler(){
        const currentScrollY = window.scrollY;

        if (currentScrollY > scroll) {
            setShow(false);
        } else {
            setShow(true);
        }

    }
    useEffect(() => {
        window.addEventListener('scroll', scrollHandler);
        return () => window.removeEventListener('scroll', scrollHandler);
    }, [scroll]);
    if(!(pathName==='/' || pathName.startsWith('/course/') || pathName.startsWith('/map'))) {
        return (
            <div className={'flex justify-center  '}>
                <div className={`grid grid-cols-4 w-full mx-10  bottom-0  bg-white/80  backdrop-blur-lg fixed max-w-[500px] ${show?'translate-y-0':'translate-y-full'} duration-200  px-10 gap-10 py-2 bg-opacity-100 rounded-t-lg  bg-white`}>
                    <Link href={'/home'} className={'flex justify-center'}>
                    <Image width={24} height={48} src={'/imgs/navBar/home.svg'} alt={'e'}/>
                    </Link>
                    <Link href={'/course'} className={'flex justify-center'}>
                    <Image  width={24} height={48} className={''} src={'/imgs/navBar/course.svg'} alt={'e'}/>
                    </Link>
                    <Link href={'/map'} className={'flex justify-center'}>
                    <Image width={24} height={48} src={'/imgs/navBar/map.svg'} alt={'e'}/>
                    </Link>
                    {/*<Image width={24} height={48} src={'/imgs/navBar/community.svg'} alt={'e'}/>*/}
                    <Link href={'/my-page'} className={'flex justify-center'}>
                    <Image width={24} height={48} src={'/imgs/navBar/myPage.svg'} alt={'e'}/>
                    </Link>
                </div>
            </div>
        )
    }
    else return null
}