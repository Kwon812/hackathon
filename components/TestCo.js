

'use client'

import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import CameraView from "@/components/CameraView";
import {authHandler} from "@/lib/utils/auth/authHandler";
import {getAllCourse} from "@/service/supabaseCourse";
import { getLocationsByCourseId} from "@/service/supabaseLocation";
import {ImageView} from "@/components/ImageView";
import {useRouter} from "next/navigation";

export default function TestCo({init,progressCourse}) {

    const [clicked, setClicked] = useState(0)
    // const [init, setInit] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [authData, setAuthData] = useState({
        courseId: '',
        location: [],
        locationId: '',
        placeName:'',
        currentProgress: 0,
    })

    // const [progressCourse, setProgressCourse] = useState([])

    // async function fetchingInit() {
    //
    //     try {
    //         const {data} = await getAllCourse()
    //
    //         // console.log(data)
    //         const ids = data.filter(x => x.state === 'progress').map(x => x.id)
    //         await getLocationsByCourseId(ids.join(','), true).then(res => {
    //             setProgressCourse(res.data)
    //         })
    //         setLoading(false)
    //         setInit(data)
    //     } catch (err) {
    //     }
    //
    // }

    function stampClickHandler(e, x, courseLength, totalProgress) {
        e.stopPropagation()
        console.log(x)
        setAuthData({
            courseId: x.course_id,
            location: [x.latitude, x.longitude],
            locationId: x.id,
            placeName: x.name,
            currentProgress: totalProgress,
            courseLength
        })

        setShowModal(true)
    }

    function filterCourseByCourseId(courseId) {
        return progressCourse.filter(course => course.course_id === courseId)
    }


    useEffect(() => {
        console.log("refetching")
        // fetchingInit()
    }, [])

    return (
        <div className={'flex flex-col gap-6 m-3 mb-20'}>
            <div
                className={'grid grid-cols-2 text-center  h-12   items-center  font-medium text-[15px] text-gray-600 bg-blue-100 rounded-md  '}>

                <p onClick={() => setClicked(0)}
                   className={` rounded-md  ${clicked === 0 && 'm-1 p-2 text-black bg-white  '} `}>코스목록</p>
                <p onClick={() => setClicked(1)}
                   className={` rounded-md  ${clicked === 1 && ' m-1 p-2 text-black bg-white '} `}>진행도</p>
            </div>
            {
                clicked === 0 ?
                    <div className={'flex flex-col gap-8'}>
                        <div className={'flex flex-col gap-3 '}>
                            <div className={'flex  gap-2'}>
                                <span className="material-symbols-outlined">circle</span>
                                <p className={'text-[16px] font-bold '}>진행예정</p>
                            </div>
                            <div className={'flex flex-col gap-4'}>
                                {
                                    loading ?
                                        <div className={'flex flex-col gap-3'}>

                                            <div className="w-full h-44 bg-gray-200 rounded-md animate-pulse "></div>
                                        </div>
                                        :
                                        init?.filter(x => x.state === 'planned').map((x, i) => <Link
                                            key={i}
                                            href={`/course/${x.id}?courseName=${x.course_name}`}><CardView
                                            init={x}/></Link>)

                                }
                            </div>
                        </div>

                        <div className={'flex flex-col gap-3'}>
                            <div className={'flex  gap-2'}>
                                <span className="material-symbols-outlined text-md">
check_circle
</span>
                                <p className={'text-[16px] font-bold '}>진행완료</p>
                            </div>
                            <div className={'flex flex-col gap-2'}>
                                {
                                    loading
                                        ?
                                        <div className={'flex flex-col gap-3'}>

                                            <div className="w-full h-20 bg-gray-200 rounded-md animate-pulse"></div>
                                        </div>
                                        :
                                        init.filter(x => x.state === 'done').map((x, i) => <Link
                                            key={i}
                                            href={`/course/${x.id}?courseName=${x.course_name}`}><CardView
                                            showImg={false} init={x}/></Link>)
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <div className={'flex flex-col gap-8 '}>

                            {
                                loading ?
                                    <div className={'flex flex-col gap-5'}>

                                        <div className="w-full h-40 bg-gray-200 rounded-md animate-pulse"></div>
                                        <div className="w-full h-20 bg-gray-200 rounded-md animate-pulse"></div>
                                    </div>
                                    :
                                    progressCourse.length === 0 ?
                                        <div className={'flex justify-center '}>
                                            <p className={'text-xl'}>진행중인 코스가 없습니다!</p>
                                        </div>
                                        :
                                        init.filter(x => x.state === 'progress').map((x, i) => {
                                            const courseLength = filterCourseByCourseId(x.id).length
                                            return (
                                                <>
                                                    <Link key={i} href={`/course/${x.id}?courseName=${x.course_name}`}>
                                                        <div className={'border  rounded-md p-5 flex flex-col  gap-4'}>

                                                            <div className={'flex flex-col gap-1'}>
                                                                <p className={'font-bold text-lg '}>{x.course_name}</p>

                                                                <div
                                                                    className={'flex justify-between text-[14px]  font-medium'}>
                                                                    <p className={''}>진행도</p>
                                                                    <p>{Math.floor((100 / courseLength) * x.progress)}%</p>
                                                                </div>
                                                                <div
                                                                    style={{
                                                                        display: 'grid',
                                                                        gridTemplateColumns: `repeat(${courseLength}, 1fr)`,

                                                                    }}
                                                                    className={` h-3 overflow-hidden  rounded-full bg-gray-200  `}>
                                                                    {
                                                                        Array.from({length: x.progress}, (_, i) => {
                                                                            return (
                                                                                <>
                                                                                    <div key={i}
                                                                                         className={'bg-blue-500'}>

                                                                                    </div>
                                                                                </>
                                                                            )
                                                                        })
                                                                    }

                                                                </div>
                                                            </div>

                                                            <div className={'text-sm '}>
                                                                <p>시작일 <span
                                                                    className={'text-gray-600 '}>{x.start_date}</span>
                                                                </p>
                                                                <p>방문현황 <span
                                                                    className={'text-gray-600'}>{x.progress}/{courseLength}</span>
                                                                </p>
                                                            </div>

                                                        </div>
                                                    </Link>
                                                    <div className={'flex flex-col gap-3'}>
                                                        {
                                                            filterCourseByCourseId(x.id).map((location, i) =>
                                                                <div
                                                                    key={i}
                                                                    onClick={() => window.open(`https://map.naver.com/p/search/${location.name}/address/isCorrectAnswer=true`)}
                                                                    className={'flex border  rounded-md p-5 gap-5 relative overflow-hidden'}>
                                                                    <Image src={'/imgs/naverMapLogo.webp'}
                                                                           width={20}
                                                                           height={20}
                                                                           className={' right-0 bottom-1 absolute  -z-10'}
                                                                           alt={'ds'}/>
                                                                    <div
                                                                        className={' flex  w-full justify-between items-center '}>
                                                                        <div className={'flex flex-col'}>
                                                                            <p className={'text-[15px] font-bold'}>{location.name}</p>
                                                                            <p className={'text-sm text-gray-600'}>{location.lo_kr}</p>
                                                                        </div>
                                                                        <Image
                                                                            onClick={e => location.check_status != 1 && stampClickHandler(e, location, courseLength, x.progress)}
                                                                            className={`flex items-end  ${location.check_status == 1 ? 'pointer-events-none' : ''}`}
                                                                            src={location.check_status == 1 ? '/imgs/doneStamp.svg' : '/imgs/stamp.svg'}
                                                                            alt={'e'}
                                                                            width={35} height={35}/>


                                                                    </div>

                                                                </div>
                                                            )
                                                        }


                                                    </div>
                                                </>
                                            )
                                        })
                            }


                        </div>

                        {/*<StampModal  {...{setShowModal, showModal, authLocation, fetchingInit,authCourseId,currentProgress,authLocationId}}/>*/}
                        <StampModal  {...{setShowModal, showModal, authData}}/>
                        {/*{ showModal && <StampModal {...{setShowModal}}/>}*/}
                    </>
            }
        </div>
    )
}


function CardView({showImg = true, init}) {

    return (
        <div className={' flex  flex-col rounded-md overflow-hidden'}>
            {
                showImg ? <div className={'h-40 bg-blue-50 relative overflow-hidden'}>

                    <ImageView placeId={init.default_place_id}/>
                </div> : null
            }

            <div className={'flex justify-between items-end p-3 border rounded-b-md border-t-0 '}>
                <div className={' flex flex-col '}>
                    <p className={'font-bold text-lg'}>{init.course_name}</p>
                    <p className={'text-sm text-gray-500 '}>{init.sub_title}</p>
                </div>
                <span className="material-symbols-outlined  ">arrow_forward</span>
            </div>
        </div>

    )
}

function StampModal({setShowModal, showModal, authData, fetchingInit}) {

    const router=useRouter()
    const [showCamera, setShowCamera] = useState(false);
    useEffect(() => {
        setShowCamera(false)
        router.refresh()
        // router.push('/course')
    }, [showModal])
    return (
        <>
            <div onClick={e => {
                setShowModal(false)
            }}
                 className={`fixed inset-0 bg-black/30 ${showModal ? 'opacity-100 ' : ' opacity-0 pointer-events-none '} duration-100 ease-in-out   flex  items-center  justify-center z-20`}>
                <div className={' flex flex-col gap-5 '}>
                    {
                        ['영수증인증', '위치인증'].map((x, i) => {
                            return (
                                <button
                                    key={i}
                                    onClick={e => {
                                        authHandler(e, setShowCamera, i, authData, setShowModal)

                                        // setShowCamera(true)
                                    }}
                                    className={'w-44 py-5 text-black  shadow bg-blue-50    font-bold   rounded-lg flex flex-col items-center justify-center gap-3'}><span
                                    className="material-symbols-outlined  ">{i === 0 ? 'receipt' : 'location_on'}</span>{x}
                                </button>
                            )
                        })
                    }


                </div>
                {
                    showCamera &&
                    <div onClick={e => {
                        setShowModal(false)
                    }} className={'fixed flex bg-black/20 inset-0 justify-center items-center '}>

                        <CameraView {...{setShowModal,authData}}/>
                        {/*<h1>dsadasdasdas</h1>*/}
                    </div>

                }
            </div>

        </>
    )
}