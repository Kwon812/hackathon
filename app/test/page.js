'use client'
import axios from "axios";
import {
    getPlaceId,
    getPlacesResult
} from "@/service/googlePlace";
import {useEffect, useState} from "react";
import {getPlaceResultUsingAi} from "@/service/openAi";

const category=['restaurant','cafe','book_store']
export default  function TestPage(){


    const [placeData,setPlaceData]=useState([])
    // let resultData=[]

    // async function getPlaceData(){
    //     try{
    //
    //         const re= await getPlaceId(36.350538899283, 127.38483484675,2000,['restaurant','cafe'])
    //         const raw=re.flatMap(x=>x.data)
    //         const {data}= await getPlacesResult(raw)
    //         const result=await getPlaceResultUsingAi(data)
    //         // console.log(result)
    //         // console.log(re.flatMap(x=>x.data))
    //         setPlaceData(JSON.parse(result.data.result))
    //         // console.log(data)
    //         // setPlaceData(data)
    //     }catch (e){
    //         console.log(e)
    //     }
    // }
    console.log(placeData)
    // console.log(resultData)
    useEffect(() => {
        getPlaceData()
    }, []);

    // axios.post('/api/openai',{resultData}).then(res=>console.log(res.data))
    return (
        <>
        </>
    )
}