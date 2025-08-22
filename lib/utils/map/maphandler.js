import {markHandler} from "@/lib/utils/map/markhandler";



export function mapInitByCourse(def, line, setShowType, showType, course, lo, showCourseIndex, handler, tMap) {
    let t
    if(course){
       t = lo.filter(x => x.type === showType[0])
    }else{
        let type='식당'
        switch (showType[0]){
            case '카페':
                type='cafe'
                break;
            case '은행':
                type='bank'
                break;
            case '서점':
                type='book_store'
                break;
            case '식당':
                type='restaurant'
                break;
        }
        t= lo.filter(x => x.type === type)
    }
    const temp=handler()
    if (t.length === 0) {

        if (course) {
            t = lo.find(x => x.type === def).location
        } else t = lo.filter(x => x.type === def)

        setShowType([def, t])
        return mapInit(t, line, 0.005, true, handler())
    } else if (course) {
        setShowType([showType[0], t[showCourseIndex].location])
        if (tMap) {
            polyLineHandler(temp.polyLineRef, t[showCourseIndex].location, tMap)
            return markHandler(t[showCourseIndex].location, tMap, temp.showHandler, temp.markerRefs, true)
        }
        return mapInit(t[showCourseIndex].location, line, 0.005, true, handler())
    } else {

        setShowType([showType[0], t])
        // console.log(tMap)
        if (tMap) {

            return markHandler(t, tMap, temp.showHandler, temp.markerRefs, true)
        }
        // markHandler(t,)
        return mapInit(t, line, 0.005, true, handler())
    }
}

export function mapInit(init, line = false, num, search = false, {
    mapRef,
    location,
    setLocation,
    setTMap,
    showHandler,
    markerRefs,
    polyLineRef,
    setSearchByLocation
}) {
    let x = init[0].latitude
    let y = init[0].longitude

    if (search) {
        x = location[0]
        y = location[1]
    }
    const mapOptions = {
        center: new naver.maps.LatLng(x, y),

        disableDoubleClickZoom: true,
        mapDataControl: false,
        zoom: 15,

    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    setTMap(map);
    if (!search) {
        naver.maps.Event.addListener(map, "click", (e) => {
            showHandler(0, false)
            map.panTo(mapOptions.center);
        });
    }
    markHandler(init, map, showHandler, markerRefs);
    if (line) {
        polyLineHandler(polyLineRef, init, map)

    }

    if (search) {
        naver.maps.Event.addListener(map, 'dragend', function () {
            const center = map.getCenter();
            const lat = center.lat();
            const lng = center.lng();

            setSearchByLocation(true)
            setLocation([lat, lng])
        });
    }
}

function polyLineHandler(polyLineRef, init, map) {
    console.log(polyLineRef)
    if (polyLineRef.current) {
        polyLineRef.current.setMap(null)
    }

    polyLineRef.current = new naver.maps.Polyline({
        path: init.map(x => new naver.maps.LatLng(x.latitude, x.longitude)),
        strokeColor: '#e67129',
        strokeWeight: 3,
        strokeStyle: 'shortdash',
        strokeLineCap: 'round',
        map: map
    });

}
