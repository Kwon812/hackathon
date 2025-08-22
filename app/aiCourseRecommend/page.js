'use client'
import {AutoComplete, message, Slider, Spin} from "antd";
import {useEffect, useState} from "react";
import {postNewCourse} from "@/service/supabaseCourse";
import {useRouter} from "next/navigation";
import {getCurrentPosition} from "@/service/getCurrentLocation";
import {getReverseGeoLocation} from "@/service/locationService";
import {ImageView} from "@/components/ImageView";
import {getPlaceResultUsingAi, getTitleInfoUsingAi} from "@/service/openAi";


const icon = ['group', 'person_heart', 'person_add', 'person']
const icon2 = ['sports_score', 'local_cafe', 'restaurant', 'book_ribbon']

export default function AiCourseRecommendPage(props) {


    const [showModal, setShowModal] = useState(false);
    const [location, setLocation] = useState('현재위치 받아오기')
    const [courseList, setCourseList] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [recommendInfo, setRecommendInfo] = useState({
        longitude : 127.3849134048222,
        latitude: 36.35065579901012,
        radius: 1500,
        members: '',
        place: []
    });

    async function fetchPlaceListByUserInfo({longitude, latitude, radius, members: a, place: b}) {

        const members = ['가족', '커플', '친구', '개인'][a]

        const place = b.map(x => ['백화점', '카페', '식당', '서점'][x])
        try {
            const data = await getPlaceResultUsingAi({latitude, longitude, radius, members, place})
            // console.log(data)
            const result=data.flatMap(x=>x?.data?.recommendations || [])
            // console.log(result)
            // console.log(data.recommendations)
            // console.log(result)
            setCourseList(result)
            setLoading(false)
            setShowModal(true)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }


    const makeCourseHandler = (recommendUserInfo) => {
       if(Object.values(recommendUserInfo).some(x=>x.length===0)){
           return alert('폼을 모두 채워주세요!')
       }
        // console.log(recommendUserInfo)

        setLoading(true)
        fetchPlaceListByUserInfo(recommendUserInfo)
    }

    function selectHandler(title, contents) {

        setRecommendInfo(x => {

            if (title === 'place') {
                let temp = [...x.place]
                if (temp.includes(contents)) {
                    const index = temp.indexOf(contents)
                    temp.splice(index, 1)
                } else {
                    temp = [...temp, contents]
                }

                return ({
                    ...x,
                    [title]: temp
                })
            }
            return ({
                ...x,
                [title]: contents
            })
        })
    }


    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);
    return (
        <div className={`  bg-gray-50 flex flex-col items-center p-5  gap-5 relative`}>
            {
                isLoading ? <div className={'absolute bg-black/20  inset-0 z-30 pointer-events-non  flex  items-center justify-center  '}><Spin  size="large" className={'z-50 '} /></div> :null
            }

            <div className={'rounded-lg p-5  w-full bg-white flex flex-col  gap-5'}>
                <div className={'flex items-center gap-2'}>
                    <span className="material-symbols-outlined text-blue-500">
location_on
</span>
                    <p className={' font-bold text-md'}>추천받고 싶은 위치</p>
                </div>
                <div>
                    {
                        // <button onClick={()=>getCurrentPosition().then}
                    }
                    <button onClick={(e) => {
                        e.preventDefault()
                        getCurrentPosition().then(res => {
                            const latitude = res.lat
                            const longitude = res.lng
                            setRecommendInfo(e => {
                                return {
                                    ...e,
                                    latitude,
                                    longitude,
                                }
                            })
                            getReverseGeoLocation(latitude, longitude).then(res => setLocation(res.documents[0].address_name))
                        }).catch(e => {
                            console.log(e)
                            setLocation('위치정보 에러!')
                        })
                    }}
                            className={'text-stone-500 text-sm '}
                    >{location}</button>


                </div>
            </div>

            <div className={'rounded-lg p-5  w-full bg-white flex flex-col  gap-5'}>
                <div className={'flex items-center gap-2'}>
                    <span className="material-symbols-outlined text-blue-500">
360
</span>
                    <p className={' font-bold text-md'}>추천반경</p>
                </div>
                <div>
                    {/*<p>내용정보들</p>*/}
                    <Slider
                        onChange={(e) => selectHandler('radius', e === 1 ? 500 : e === 25 ? 1000 : e === 50 ? 1500 : e === 75 ? 2000 : 3000)}
                        marks={{
                            1: '500m',
                            25: ' ',
                            50: '1.5km',
                            75: ' ',
                            100: '3km'

                        }} step={null} tooltip={false} defaultValue={50}/>
                    <input type="hidden" name="한적도"/>
                </div>
            </div>
            <div className={'rounded-lg p-5  w-full bg-white flex flex-col  gap-5'}>
                <div className={'flex items-center gap-2'}>
                    <span className="material-symbols-outlined text-blue-500">
trip
</span>
                    <p className={' font-bold text-md'}>여행유형</p>
                </div>
                <div className={'grid grid-cols-2  gap-4'}>
                    {
                        ['가족', '커플', '친구', '개인'].map((x, i) => {
                            return (
                                <div
                                    onClick={() => selectHandler('members', i)}
                                    className={`p-5 w-full flex-col  justify-items-center rounded-xl  border-[1.5px] ${recommendInfo.members === i ? 'bg-blue-200/20 border-blue-500' : ''} `}>
                                    <div>
                                        <span className="material-symbols-outlined text-blue-400 ">{icon[i]}</span>
                                    </div>
                                    <p className={'font-medium'}>{x}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className={'rounded-lg p-5  w-full bg-white flex flex-col  gap-5'}>
                <div className={'flex justify-between'}>
                    <div className={'flex items-center gap-2'}>
                        <span className="material-symbols-outlined text-blue-500">approval</span>
                        <p className={' font-bold text-md'}>장소유형</p>
                    </div>
                    <div>
                        <p className={'text-gray-500 text-sm'}>{recommendInfo.place.length}개 선택</p>
                    </div>
                </div>
                <div className={'grid grid-cols-2  gap-4'}>
                    {
                        ['백화점', '카페', '식당', '서점'].map((x, i) => {
                            return (
                                <div
                                    onClick={e => selectHandler('place', i)}
                                    className={`p-5 w-full flex-col  justify-items-center rounded-xl  border-[1.5px]  ${recommendInfo.place.includes(i) ? ' bg-blue-200/20 border-blue-500' : ' '} `}>
                                    <div>
                                        <span className="material-symbols-outlined text-blue-400 ">{icon2[i]}</span>
                                    </div>
                                    <p className={'font-medium'}>{x}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <button
                onClick={() => makeCourseHandler(recommendInfo)}
                disabled={isLoading}
                className={`${isLoading ? 'pointer-events-none ' : 'pointer-events-auto'} my-5 mb-10 bg-blue-400 w-full py-2 rounded-lg bg-gradient-to-r from-blue-400  via-purple-400 to-red-400 text-white font-bold text-lg `}>{isLoading ? '코스 생성중' : 'AI코스생성하기'}
            </button>
            {
                showModal && <CourseModal {...{setShowModal, courseList, recommendInfo, isLoading}}/>
            }
        </div>
    )

}

function CourseModal({setShowModal, courseList, recommendInfo, isLoading}) {
    const [clickedPlaceIndex, setClickedPlaceIndex] = useState([])
    const router = useRouter()

    function clickedPlaceHandler(i) {
        setClickedPlaceIndex(x => {
            const temp = [...x]
            const prev = temp.indexOf(i)
            if (prev !== -1) {
                temp.splice(prev, 1)
                return temp
            }
            return [...temp, i]
        })
    }

    async function courseConfirmHandler() {

        const confirmCourse = courseList.filter((x, i) => clickedPlaceIndex.includes(i))
        if(confirmCourse.length===0){
            return alert('장소를 1개 이상 선택해주세요!')
        }
        message.loading({content: '코스 저장중', key: 11},10)
        const confirmCourseName=confirmCourse.map((x)=>x.name)
       const {data}=await getTitleInfoUsingAi({
           places_name:confirmCourseName
        })
        const courseInfo = {
            course_id: Math.floor(Math.random() * 100),
            course_name: data.data.course_name,
            course_info: data.data.course_summary

        }
        try {

            await postNewCourse(confirmCourse, courseInfo)
            message.success({content: '코스 저장완료!', key: 11}, 1).then(() => router.push('/course'))

        } catch (e) {
            console.log(e)
            message.error({content: '코스를 저장 할 수 없습니다!', key: 11})
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-start  ">
            <div className="bg-white max-w-[500px] w-full h-[100dvh] overflow-y-auto  flex flex-col  relative  ">
                <div
                    onClick={() => setShowModal(false)}
                    className="flex py-2  border-b items-center cursor-pointer"
                >
                    <span className="material-symbols-outlined text-[18px] p-4">arrow_back</span>
                    <div>
                        <p className="font-medium">AI 추천코스</p>
                        <p className="text-gray-400 text-sm">코스이름</p>
                    </div>
                    <div>
                        {/*<p className="text-gray-400 text-sm">{recommendInfo.radius}</p>*/}
                        {/*{*/}
                        {/*    recommendInfo.place.map(x=>{*/}
                        {/*        return (*/}
                        {/*            <p className="text-gray-400 text-sm">{x}</p>*/}
                        {/*        )*/}
                        {/*    })*/}
                        {/*}*/}
                        {/*<p className="text-gray-400 text-sm">{recommendInfo.members}</p>*/}
                        {/*<p className="text-gray-400 text-sm">코스이름</p>*/}
                    </div>
                </div>
                {/*{*/}
                {/*    courseList.sort((a,b)=>Number(a.distance_from_user)-Number(b.distance_from_user))*/}
                {/*}*/}
                <div className="flex flex-col gap-8 p-5  bg-blue-50 ">
                    {
                        courseList.sort((a,b)=>Number(a.distance_from_user)-Number(b.distance_from_user)).map((x, i) => {
                            return (
                                <div
                                    onClick={() => clickedPlaceHandler(i)}
                                    className={`rounded-xl ${clickedPlaceIndex.includes(i) ? ' outline  outline-blue-600' : ''}`}>
                                    <CourseCardView init={x}/>
                                </div>
                            )

                        })
                    }
                    <div className={' w-full  flex justify-between  gap-3 '}>
                        {/*<img src={`/api/test`} className="w-full h-full object-cover"/>*/}
                        <button
                            onClick={courseConfirmHandler}
                            className={' w-full bg-blue-500 text-white  py-2  rounded-lg'}>코스확정
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function CourseCardView({init}) {


    return (
        <div className="bg-white rounded-xl shadow overflow-hidden min-h-[200px]">
            <div className="h-52 bg-blue-100 overflow-hidden relative">

                {/*{*/}
                {/*    isLoading ?*/}
                {/*        <div className={'absolute inset-0 flex justify-center items-center'}>*/}
                {/*            <Spin className={''} size={'default'}></Spin>*/}
                {/*        </div>*/}
                {/*        : <img alt={'can"t load image'} src={imgs}/>*/}
                {/*}*/}
                <ImageView placeId={init.place_id} />
            </div>
            <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-col gap-1 ">
                    <div className="flex gap-3  items-center ">
                        <div className={'flex gap-1'}>
                            <p className="font-medium  text-white text-sm bg-blue-400 px-3 py-0.5 rounded-full">{init['혼잡도']}</p>
                            <p className="font-medium  text-white text-sm bg-blue-400 px-3 py-0.5 rounded-full">{init['구성원']}</p>
                        </div>
                        <div className={'flex gap-1 items-center '}>

                            <p className="text-lg font-medium">{init.name}</p>
                            <p className="text-gray-400 text-sm">{init.type}</p>
                        </div>

                    </div>
                    <p className="text-gray-400">{init.info}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end ">
                        <p className="flex items-center text-sm font-medium">
                            <span className="material-symbols-outlined text-blue-700 text-[21px]">location_on</span>
                            위치
                        </p>
                        <div className={'flex gap-3'}>
                        <p className="text-gray-400 text-sm">{init.kr_lo}</p>
                        <p className="text-gray-400 text-sm">{init.distance_from_user}m</p>
                        </div>
                    </div>
                    <div className="w-full h-40  rounded-md overflow-hidden">
                        <img src={`/api/test?lat=${init.latitude}&lng=${init.longitude}`}
                             className="w-full h-full object-cover"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

