import {useEffect, useState} from "react";
import axios from "axios";
import {Spin} from "antd";

const imageCache=new Map()
export  function ImageView({placeId}){
    const [isLoading, setIsLoading] = useState(false)
    const [imgs,setImgs] = useState(null);

    async function memoizeImage(placeId){
        // const id=placeId
        if(imageCache.has(placeId)){
            return imageCache.get(placeId)
        }
        const {data}=await axios.get(`/api/googlePlace?placeId=${placeId}`,{responseType:'blob'})
        const url=URL.createObjectURL(data)
        imageCache.set(placeId,url)
        return url

    }

    useEffect(() => {
        console.log("on NOw")
        setIsLoading(true)
        memoizeImage(placeId).then(res=>setImgs(res)).finally(() => setIsLoading(false))
    }, []);

    return (
        <>
            {
                isLoading ?
                    <div className={'absolute inset-0 flex justify-center items-center'}>
                        <Spin className={''} size={'default'}></Spin>
                    </div>
                    : <img alt={'can"t load image'} src={imgs}/>
            }
        </>
    )
}
