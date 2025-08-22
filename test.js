'use client'

import {useRouter} from "next/navigation";
import NaverMap from "@/components/Map";
import {useEffect, useState} from "react";
import {getLocationsByCourseId} from "@/service/supabaseLocation";

export default function CourseDetailPage({params,searchParams}) {

    const [init,setInit] = useState([]);
    const [progressState,setProgressState]=useState('')
    const router = useRouter()
    async function fetchCourseById(){
        try{
            const {data}=await getLocationsByCourseId(params.id)

            setInit(data.data)
            setProgressState(data.state)
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        fetchCourseById()
    },[])

    return (
        <div className={'flex flex-col h-[100dvh] relative'}>
            <div className={'flex absolute z-10  items-center   justify-center h-12  font-bold'}>
                <div onClick={() => router.back()} className={'flex gap-3 bg-white/30 backdrop-blur-lg ml-5 border p-2 px-4 rounded-lg mt-5'}>
                    <span  className="material-symbols-outlined">arrow_left_alt</span>
                    <p>{searchParams.courseName} </p>
                </div>
            </div>
            <div className={'flex-1 '}>
                {
                    init.length===0? null:<NaverMap init={init} check={progressState} userLo={[init.latitude,init.longitude]}/>
                }


            </div>
        </div>
    )
}