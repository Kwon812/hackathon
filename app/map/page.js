'use client'

import NaverMap from "@/components/Map";
import lo from "@/lib/data/lo";
import {useEffect, useState} from "react";
import course from "@/lib/data/course";
import {useRouter} from "next/navigation";
import {getUser} from "@/service/user";
import {getPlaceId} from "@/service/googlePlace";
import {message} from "antd";


const placeCache = new Map()
export default function MapPage() {

    const [type,setType] = useState(false);
    const [init,setInit]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [userLo,setUserLo]=useState([]);
    const router=useRouter();



    async function memoizedGetPlaceId(lat, lng, radius, types) {
        const key = `${lat}_${lng}_${radius}_${types.sort().join(',')}`

        if (placeCache.has(key)) {
            return placeCache.get(key)
        }

        const result = await getPlaceId(lat, lng, radius, types)
        placeCache.set(key, result)
        return result
    }
    async function memoizedUser() {
        const key = `user`

        if (placeCache.has(key)) {
            return placeCache.get(key)
        }

        const result =await getUser()
        placeCache.set(key, result)
        return result
    }
    async function fetchInitPlaceByLocation(){
        try{
            const {data}=await memoizedUser()
            // console.log(data)
            const {latitude,longitude} = data.data;
            // console.log(latitude)
           const result = await memoizedGetPlaceId(latitude, longitude, 1500, ['restaurant', 'cafe', 'book_store', 'bank']);
            const a=result.flatMap((x,i)=>x.data)
            //
            setInit(a)
            setUserLo([latitude,longitude]);
            setIsLoading(false)
            message.success({content:'로딩완료',key:33},1)
            // console.log(latitude,longitude)
        }catch (e){
            message.error({content:'에러!',key:33},1)
            console.log(e)
        }
    }
     function fetchInit(type){

        if(type){
            setInit(course)
            setIsLoading(false)
        }else{
            // setInit(lo)
            // setIsLoading(false)
            message.loading({content:'로딩중',key:33})
            fetchInitPlaceByLocation()
        }

        setType(type)
    }

    function changeMenuHandler(type){
        setIsLoading(true)
       fetchInit(type)
    }

    useEffect(()=>{
        fetchInit(type)
    },[])




    return (
        <div className={'h-[100dvh]  relative'}>

                        <span tabIndex={0} onClick={() => router.back()}
                              className=" absolute m-5  font-medium z-20 material-symbols-outlined">
arrow_back
</span>
            <div className={'absolute  z-10 w-full p-3 flex justify-center '}>

                <div className={'bg-blue-400/10 backdrop-blur-xl rounded-full p-1'}>
                    {
                        ['장소','코스'].map((x,i)=>{
                         return (
                             <button  key={i} onClick={e => changeMenuHandler(i)}
                                     className={`text-md  font-medium py-1 px-5   text-gray-700  rounded-full ${i?'rounded-l-none':'rounded-r-none'}  ${type == i ? 'bg-white/70' : ''}`}>{x}
                             </button>
                         )
                        })
                    }

                </div>
            </div>

            {
                // console.log(init)
                isLoading? null:<NaverMap {...{init}} type={false} course={type} userLo={userLo}/>
            }



        </div>
    )
}