import {panToLocation} from "@/lib/utils/map/panToLocation";

export function markClickHandler(map, e) {
    const clickedLatLng = e.coord;


    panToLocation(map,clickedLatLng.lat(), clickedLatLng.lng())
    // const newCenter = new naver.maps.LatLng(clickedLatLng.lat(), clickedLatLng.lng());
    // map.panTo(newCenter, {
    //     duration: 700,
    // });

}

export function markHandler(init, map, showHandler, markerRefs, clearPrevMarks = false) {
    if (clearPrevMarks) {
        markerRefs.current.forEach(marker => marker.setMap(null));
    }
    markerRefs.current = init.map((x, i) => {
        const mark = new naver.maps.Marker({
            position: new naver.maps.LatLng(x.latitude, x.longitude),
            title: "fdsji",
            map: map,
            icon: {
                content: `<span class="material-symbols-outlined text-4xl text-blue-600"
      style="font-variation-settings: 'FILL' 1;">
  location_on
</span>`,
                anchor: new naver.maps.Point(18, 34)
            }


        })
        naver.maps.Event.addListener(mark, "click", (e) => {
            markClickHandler(map, e)
            showHandler(i, true)
        })
        return mark
    })


}
