import {useEffect, useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import temp from "@/lib/data/course";
import {panToLocation} from "@/lib/utils/map/panToLocation";
import {useRouter} from "next/navigation";

export default function MapBottomView({
                                          menu,
                                          mapRef,
                                          showType,
                                          setShowType,
                                          showHandler,
                                          show,
                                          tMap,
                                          course = false,
                                          setShowCourseIndex,
                                          showCourseIndex,
                                          setLocation
                                      }) {

    const [visible, setVisible] = useState(false);
    const startY = useRef(0);
    const endY = useRef(0);
    const slideRef = useRef(null)
    const router=useRouter()
    const onTouchStart = (e) => {
        e.stopPropagation()
        startY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
        e.stopPropagation()
        endY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e) => {
        const diff = startY.current - endY.current;

        if (!endY.current) return null
        else {
            if (diff > 30) {
                setVisible(true);
            } else if (diff < -30) {
                setVisible(false);
            }

        }
        endY.current = 0
        startY.current = 0
    };
    const onClicked = (e) => {
        e.stopPropagation()
    }

    return (
        <>


            <div
                onClick={onClicked}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                className={`absolute h-[50vh]  shadow-xl bg-blue-200/15 backdrop-blur-lg bottom-0  flex flex-col gap-3 rounded-t-xl  items-center z-10 w-full pt-2  border-t border-white duration-200 ${visible ? 'translate-y-0' : 'translate-y-64'} `}>
                <div className={'   z-50 absolute left-1/2 -translate-x-1/2 -top-10 '}>
                    <button
                        onClick={() => router.push('/aiCourseRecommend')}
                        className={' z-50   bg-gradient-to-br  from-blue-400 via-purple-400 to-red-400   text-white px-3 py-1 rounded-full font-medium  flex items-center gap-1'}>
                        <span className="material-symbols-outlined text-[20px]">kid_star</span>
                        AI 코스생성
                    </button>
                </div>
                <div className={'bg-gray-400 w-32 h-1.5 rounded-full  '}></div>
                <div className={'flex gap-1 '}>
                    {
                        menu.map((x, i) => <button
                            onClick={e => {
                                setShowCourseIndex(0);
                                setShowType(e => {

                                    return ([x, e[1]])
                                })
                            }}
                            key={i}
                            className={`px-3  py-0.5 rounded-xl ${showType[0] === x ? 'border-blue-400 border' : 'border-blue-100 border-[1px]'} bg-white  text-[16px] `}>{x}</button>)
                    }

                </div>
                <div onClick={e => e.stopPropagation()} className={'  z-10 w-full flex-1 overflow-y-scroll pb-3'}>
                    <div className={`flex flex-col gap-2 `}>


                        {
                            course ?
                                <>

                                    <div className={'flex justify-center flex-col items-center   '}>

                                        <div className={'flex flex-col gap-5 '}>
                                            {
                                                temp.filter(x => x.type === showType[0]).map((x, i) => {
                                                    return (
                                                        <div
                                                            key={i}
                                                            className={'flex flex-col gap-1'}>
                                                            <div
                                                                className={'flex   justify-between rounded-full items-center z-10 mx-5   py-1 '}>
                                                                <p className={'text-[14px]  font-bold  text-black   rounded-full px-2 py-0.5 bg-white'}>{showType[0]} {i + 1}0분코스</p>
                                                                <button
                                                                    className={' text-[14px]  font-medium  text-white   rounded-full px-2  py-0.5  bg-blue-400'}>코스선택
                                                                </button>
                                                            </div>

                                                            <Swiper
                                                                key={i}
                                                                ref={slideRef}
                                                                spaceBetween={10}
                                                                slidesPerView={1.1}
                                                                centeredSlides={true}
                                                                onSlideChange={(swiper) => {
                                                                    const x = showType[1][swiper.activeIndex]
                                                                    panToLocation(tMap, x.latitude, x.longitude)
                                                                    setShowCourseIndex(i)
                                                                    showHandler(swiper.activeIndex, false)
                                                                }}
                                                                className="w-[355px] "
                                                            >
                                                                {x.location.map((x, ii) => (
                                                                    <SwiperSlide key={ii}>
                                                                        <div onClick={(e) => {
                                                                            setShowCourseIndex(i)
                                                                            if (showCourseIndex === i) {
                                                                                const x = showType[1][show[1]]
                                                                                panToLocation(tMap, x.latitude, x.longitude)


                                                                            }
                                                                            showHandler(ii, false)

                                                                        }}
                                                                             className={`bg-white p-4 rounded-lg  ${show[1] === ii && showCourseIndex === i ? 'border-blue-400' : 'border-blue-100'} border-[1px]   `}>
                                                                            <p className="font-bold">
                                                                                {x.name}{' '}
                                                                                <span
                                                                                    className="text-[12px] font-medium text-gray-600">{x.type}</span>
                                                                            </p>
                                                                            <p className="text-gray-600 text-[13px] leading-tight">{x.lo_kr}</p>
                                                                            <p className="text-[14px] mt-1 text-gray-800">{x.info}</p>
                                                                        </div>
                                                                    </SwiperSlide>
                                                                ))}
                                                            </Swiper>
                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>


                                    </div>
                                </>
                                :
                                showType[1]?.map((x, i) => {

                                    return (

                                        <div key={i} className={'flex flex-col px-2'}>
                                            <div onClick={() => {
                                                panToLocation(tMap, x.latitude, x.longitude)

                                                showHandler(i, false)
                                            }}
                                                 className={`bg-white p-4 rounded-lg  ${show[1] === i ? 'border-blue-400' : 'border-blue-100'} border-[1px] `}>
                                                <p className="font-bold">
                                                    {x.name}{' '}
                                                    <span
                                                        className="text-[12px] font-medium text-gray-600">{x.type}</span>
                                                </p>
                                                <p className="text-gray-600 text-[13px] leading-tight">{x.lo_kr}</p>
                                                {/*<p className="text-[14px] mt-1 text-gray-800">{x.info}</p>*/}
                                            </div>
                                        </div>
                                    )
                                })
                        }

                    </div>

                </div>
            </div>
        </>
    )
}