'use client';
import 'swiper/css';
import {useEffect, useRef, useState} from 'react';
import MapBottomView from "@/components/map/MapBottomView";
import SlideCardView from "@/components/map/SlideCardView";
import MapCardView from "@/components/map/MapCardView";
import {mapInit, mapInitByCourse} from "@/lib/utils/map/maphandler";
import {getCurrentPosition} from "@/service/getCurrentLocation";
import {panToLocation} from "@/lib/utils/map/panToLocation";
import {markHandler} from "@/lib/utils/map/markhandler";
import {getPlaceId} from "@/service/googlePlace";
import {message} from "antd";

export default function NaverMap({init: lo, type = true, course, check: progress,userLo}) {
    const mapRef = useRef(null);
    const [tMap, setTMap] = useState(null);
    const [show, setShow] = useState([false, -1])
    const [prevMarker, setPrevMarker] = useState(0);
    const [showType, setShowType] = useState(['식당']);
    const [showCourseIndex, setShowCourseIndex] = useState(0);
    const [location, setLocation] = useState([userLo[0],userLo[1]]);
    const [searchByLocation, setSearchByLocation] = useState(false);
    const markerRefs = useRef([]);
    const polyLineRef = useRef(null);


    function showHandler(index, check) {
        setShow(e => {
                setPrevMarker(e[1])
                return ([check, index])
            }
        )
    }

    function mapParamsInit() {
        return {
            mapRef,
            location,
            setLocation,
            setTMap,
            showHandler,
            markerRefs,
            polyLineRef,
            setSearchByLocation,
            showType
        }
    }

    // useEffect(() => {
    //     setSearchByLocation(true)
    // },[location])
    // useEffect(() => {
    //     getCurrentPosition().then(res=>setLocation([res.lat,res.lng])).catch(e=>console.error(e));
    // }, []);
    useEffect(() => {
        setShow([false, -1])
        if (!mapRef.current) return ;
        if (type) {

            return mapInit(lo, true, 0.005, false, mapParamsInit())
        } else {

            let t = '카페'
            // let init
            if (course) {
                t = '도보'
                showHandler(0, false)
            }
            return mapInitByCourse(t, course, setShowType, showType, course, lo, showCourseIndex, mapParamsInit, tMap)
        }

    }, [showType[0], course, showCourseIndex]);

    useEffect(() => {

        function changeMarkerColor(i, color) {
            let c = color === 'blue' ? `text-blue-600` : 'text-red-600'
            markerRefs.current[i].setIcon({
                content: `<span class="material-symbols-outlined text-4xl ${c}" style="font-variation-settings: 'FILL' 1;">location_on</span>`,
                anchor: new naver.maps.Point(16, 34)
            })

        }

        try {

            changeMarkerColor(show[1], 'red')

            prevMarker === show[1] || changeMarkerColor(prevMarker, 'blue')

        } catch (e) {
            // showHandler(0, false)
            // changeMarkerColor(0,'red')
        }
    }, [show[1], showType[0], showCourseIndex]);

    if (!type) {
        let menu = course ? ['도보', '버스', '지하철', '자차'] : ['식당', '카페', '서점', '은행']
        return (
            <>

                <div
                    ref={mapRef}
                    className={'h-full  relative '}
                >
                    <FindMyLocationButton {...{tMap}}/>
                    {
                        (searchByLocation && !course ) && <ReSearchByLocationButton {...{tMap, mapParamsInit, setShowType,setSearchByLocation}}/>
                    }
                    <MapBottomView {...{
                        menu,
                        mapRef,
                        showType,
                        setShowType,
                        showHandler,
                        show,
                        tMap,
                        course,
                        setShowCourseIndex,
                        showCourseIndex,
                    }}/>
                </div>
            </>
        )
    }
    return (
        <>


            <div
                ref={mapRef}
                className={'h-full  flex flex-1  justify-center relative '}
            >

                <FindMyLocationButton {...{tMap,markerRefs}}/>
                {
                    show[0] ?
                        <MapCardView init={lo[show[1]]}/>
                        :
                        <div className={'absolute bottom-8 flex flex-col gap-2'}>
                            <SlideCardView {...{lo, tMap, showHandler, progress}} />
                        </div>


                }


            </div>
        </>
    );
};

function FindMyLocationButton({tMap}) {

    async function findMyLocation() {
        try {
            const {lat, lng} = await getCurrentPosition();
            new naver.maps.Marker({
                position: new naver.maps.LatLng(lat, lng),
                title: "fdsji",
                map: tMap,
                icon: {
                    content: `<span class="material-symbols-outlined text-4xl text-blue-600"
      style="font-variation-settings: 'FILL' 1;">assistant_navigation</span>`,
                    anchor: new naver.maps.Point(18, 34)
                }
            })
            // markHandler(tMap,location,showHandler,markerRefs,true)

            panToLocation(tMap, lat, lng)
        } catch (e) {
            console.log(e)
            alert('현재위치를 받아올 수 없습니다')
        }
    }

    return (
        <>
            <button onClick={findMyLocation}
                    className={'absolute top-0 z-30  right-0'}><span className="material-symbols-outlined p-5 ">
location_searching
</span></button>
        </>
    )
}

function ReSearchByLocationButton({tMap, mapParamsInit, setShowType,setSearchByLocation}) {

    const temp = mapParamsInit()
    const init = [{
        info: "분위기 맛집 가성비 맛집",
        latitude: 36.3503481,
        lo_kr: "대전 동구 홍도로33번길 81",
        longitude: 127.3824092,
        name: "dsnadjsdsds",
        type: "카페"
    }]

    async function ReSearchHandler() {
        // console.log(temp)
        let types=[]
        switch (temp.showType[0]){
            case '카페':
                types=['cafe']
                break;
            case '은행':
                types=['bank']
                break;
            case '서점':
                types=['book_store']
                break;
            case '식당':
                types=['restaurant']
                break;
        }

        try {
            message.loading({content:'검색중...',key:33})
            const re = await getPlaceId(temp.location[0],temp.location[1], 1000, types)
            // console.log(re)
            // console.log(re[0].data)
            if(re[0].data.length===0){
                message.loading({content:'현위치 근처의 장소를 찾을 수 없습니다!',key:33})
            }else message.success({content:'검색완료!',key:33})
            markHandler(re[0].data, tMap, temp.showHandler, temp.markerRefs, true)
            temp.showHandler(-1, false)
            setShowType(x => [x[0], re[0].data])
            setSearchByLocation(false)

            // message.loading({content:'검색완료...',key:33})
        }catch (e){
            message.error({content:'검색에러!',key:33})
            console.log(e)
        }
        // mapInit(init, false, 0.005, true, mapParamsInit())
    }


    return (
        <>
            <div className={'fixed z-20  left-1/2 -translate-x-1/2 top-16'} onClick={ReSearchHandler}>

                <button className={''}>
                <span className="material-symbols-outlined bg-white/10 backdrop-blur-lg text-blue-600 rounded-full p-1 text-[28px]">refresh</span>
                </button>
            </div>

        </>
    )
}