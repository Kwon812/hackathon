
import {Swiper, SwiperSlide} from "swiper/react";
import {panToLocation} from "@/lib/utils/map/panToLocation";
import {updateCourseById} from "@/service/supabaseCourse";
import {useRouter} from "next/navigation";
import {message} from "antd";

export default function SlideCardView({lo, tMap, showHandler, progress}) {
    const router=useRouter();

    console.log(lo)
    async function selectCourseHandler(){
        message.loading({content:'코스를 저장하고 있습니다!',key:1},)
        try {
            const result=await updateCourseById(lo[0].course_id, true)
            message.success({content:'코스 선택 완료!',key:1},1.5).then(()=> {

                router.push('/course')
                router.refresh()
            })

        }catch (e){
            message.error({content:'에러! 코스를 저장할 수 없습니다!',key:1})
            console.log(e)
        }
        // console.log(lo[0].course_id)
    }
    return (
        <>

            <div className={'flex justify-end z-10 '}>
                {
                    progress === 'planned' ?
                        <button
                        onClick={selectCourseHandler}
                        className={' text-[14px] px-5 py-1 font-medium mx-9 text-white  rounded-md bg-blue-400 z-20'}>코스선택
                    </button>
                        :null
                }

            </div>
            <Swiper
                spaceBetween={10}
                slidesPerView={1.2}
                centeredSlides={true}
                onSlideChange={(swiper) => {
                    console.log("dsddsa")
                    const x = lo[swiper.activeIndex]
                    panToLocation(tMap,x.latitude,x.longitude)
                    showHandler(swiper.activeIndex, false)
                }}
                className="w-[400px] "
            >
                {lo.map((x, i) => (
                    <SwiperSlide key={i}>
                        <div key={i} onClick={() => showHandler(i, true)}
                             className="bg-white/30 backdrop-blur-lg p-4 rounded-lg border-black/30 border-[0.5px]  ">
                            <p className="font-bold">
                                {x.name}{' '}
                                <span className="text-[12px] font-medium text-gray-600">{x.type}</span>
                            </p>
                            <p className="text-gray-600 text-[13px] leading-tight">{x.lo_kr}</p>
                            <p className="text-[14px] mt-1 text-gray-800 break-words line-clamp-1">{x.info}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}

