import axios from "axios";
import {info} from "next/dist/build/output/log";


export async function getPlaceResultUsingAi(info){

    // const {members,place}=info
    // return await axios.post('http://13.125.151.212:8080/ai/recommend-places', {
    //         latitude: 36.33177800000001,
    //         longitude: 127.3405821,
    //         radius: 1500,
    //         members: "개인",
    //         place: ["식당"]
    //     }
    // )

    console.log(info)
    // if(info.plae.length > 1){
    //
    // }
    return Promise.all(info.place.map(x=>axios.post('/api/openai?type=courseList',{
        ...info,
        place:[`${x}`]
    })))
    // return await axios.post('/api/openai?type=courseList',info)
}

export async function getTitleInfoUsingAi(info){

    return await axios.post('/api/openai',info)
}