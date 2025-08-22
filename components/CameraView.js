'use client'

import {useEffect, useRef, useState} from "react";
import {camera} from "@/lib/utils/camera/camera";
import {receiptAuth} from "@/service/receipt";
import {message, Spin} from "antd";
import {updateCourseById} from "@/service/supabaseCourse";
import {useRouter} from "next/navigation";

export default function CameraView({setShowModal, authData}) {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCaptured, setIsCaptured] = useState(false);
    const [loading, setLoading] = useState(false);
    const stream = useRef(null);
    const router = useRouter();

    async function compareName(formData) {
        try {
            message.loading({content: '영수증 인식중...', key: 22}, 10)
            const result = await receiptAuth(formData)
            const receiptPlaceName = result.data.place_name.replace(/\s+/g, "")
            const originPlaceName = authData.placeName.replace(/\s+/g, "")
            console.log(receiptPlaceName)
            console.log(originPlaceName)
            if (receiptPlaceName === originPlaceName) {

                message.success({content: '영수증 인식성공!...', key: 22}, 2)
                const {courseId, currentProgress, locationId, courseLength} = authData
                updateCourseById(courseId, false, currentProgress, locationId, courseLength).then(res => {
                    router.refresh()
                    setShowModal(false)

                })

            } else {
                message.error({content: '영수증 인식 실패!...', key: 22}, 2)
                setShowModal(false)
            }
            // console.log(placeName)
        } catch (e) {
            console.log(e)
            message.error({content: '영수증 인식 실패!...', key: 22}, 2)
            setShowModal(false)
        }
    }

    const handleCapture = (e) => {
        e.stopPropagation()

        const video = videoRef.current;
        const canvas = canvasRef.current;

        // 캔버스 크기를 비디오와 맞춤
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Base64 이미지로 변환
        const imageDataUrl = canvas.toDataURL("image/png");

        function base64ToBlob(base64) {
            const byteString = atob(base64.split(',')[1]); // "data:image/png;base64," 제거
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ab], {type: 'image/png'});
        }

        const blob = base64ToBlob(imageDataUrl)
        const formData = new FormData();
        formData.append('file', blob, 'receipt.png'); // Tabscanner가 인식할 파일 이름
        formData.append('lang', 'ko');

        setIsCaptured(true)
        compareName(formData)
    };

    useEffect(() => {
        let t
        if (videoRef.current) {
            camera(videoRef, setLoading).then(res => {
                stream.current = res
            })
        }


        return () => {
            if (stream.current) {
                stream.current.getTracks().forEach((track) => track.stop());
            }
        }
    }, []);


    return (
        <>

            <div
                onClick={e => e.stopPropagation()}
                className={`relative ${stream.current ? 'visible' : 'hidden'}  relative  flex flex-col items-center justify-center  `}>
                <div className={`${isCaptured ? 'visible' : 'hidden'}`}>
                    <Spin className={'absolute bottom-1/2  left-1/2 -translate-x-1/2 z-50'} tip={'loading'} spinning={true} size={'large'}/>
                    <div className={'absolute inset-0  rounded-2xl bg-black/80'}></div>
                </div>
                <canvas ref={canvasRef} className={` ${isCaptured ? 'visible' : 'hidden'}  rounded-2xl h-[80dvh] `}/>

                <video ref={videoRef} autoPlay playsInline
                       className={`rounded-2xl shadow   h-[80dvh]  ${!isCaptured ? 'visible' : 'hidden'}  `}>

                </video>


                {/*<canvas ref={canvasRef} className={' border-2 '}/>*/}
                <div className={`${isCaptured ? 'hidden' : 'visible'} `}>
                    <button onClick={e => setShowModal(false)} className={'absolute z-40 top-0 left-0 p-4'}><span
                        className="material-symbols-outlined text-white">close</span></button>

                    <button onClick={handleCapture}
                            className={`absolute  bottom-5 w-12 h-12 bg-white -translate-x-1/2 border  rounded-full text-white  `}>
                    </button>
                </div>
            </div>
            <div
                className={`${stream.current ? 'hidden' : 'visible'} bg-white  inset-0 fixed flex justify-center items-center`}>
                <p className={'text-2xl font-bold '}>CAMERA LOADING...</p>
            </div>

        </>
    )
}