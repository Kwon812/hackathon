import axios from "axios";


export async function getPlaceId(lat, lng, radius, type) {

    return await Promise.all(type.map(x => axios.post('/api/googlePlace?placeId=true', {
        location: `${lat},${lng}`,
        radius,
        type: x
    })))

}

export async function getPlacesResult(placeData) {

    return await axios.post('/api/googlePlace', {
        place: placeData
    })
}

export async function getPlaceImg(placeId) {

    return await axios.get(`/api/googlePlace?maxwidth=500&photo_reference:${placeId}`, {
        params: {

            ...req.body.query,
            photo_reference: placeId
        }
    })
}