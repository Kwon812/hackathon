import axios from "axios";


export default async function handler(req, res) {

    const method={
        POST: async  ()=>{
            if (req.query.placeId == 'true') {
                console.log("dnasjdnsjs")
                const {data} = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
                    params: {
                        location:req.body.location,
                        radius: req.body.radius,
                        type: req.body.type,
                        language: 'ko',
                        key: process.env.GOOGLE_PLACE_API
                    }
                })
                const result = data.results
                // console.log(result)
                const place = result.filter((x, i) => x.business_status === 'OPERATIONAL' ).map(data=>{
                    return ({
                        name:data.name,
                        latitude: data.geometry.location.lat,
                        longitude: data.geometry.location.lng,
                        photo:data.photos,
                        lo_kr:data.vicinity,
                        type:data.types[0],
                        info:'test'

                    })
                })

                return res.status(200).send(place)
            } else {

                async function getPlaceDetails(placeId) {
                    const {data} = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                        params: {
                            fields: 'rating,reviews,formatted_address,name,geometry',
                            place_id: placeId,
                            language: 'ko',
                            key: process.env.GOOGLE_PLACE_API
                        }
                    })
                    const textReviews = data.result.reviews.map((x, i) => x.text)
                    const name=data.result.name
                    const kr_lo=data.result.formatted_address
                    const geometry=data.result.geometry
                    // placeData[i].place_reviews=textReviews
                    return ({
                        place_id: placeId,
                        name,
                        kr_lo,
                        geometry,
                        type: req.body.type,
                        place_reviews: textReviews
                    })
                }

                const result = await Promise.all(
                    req.body.place.map((x, i) => getPlaceDetails(x))
                )
                return res.status(200).send(result)

            }
        },
        GET : async ()=>{
            console.log(req.query)
            const {data} = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
                params: {
                    fields: 'photos',
                    place_id: req.query.placeId,
                    language: 'ko',
                    key: process.env.GOOGLE_PLACE_API
                }
            })
                console.log(data.result.photos[1].photo_reference)
            // console.log(r)
            const {data:photo}=await axios.get('https://maps.googleapis.com/maps/api/place/photo',{
                params:{
                    maxwidth:500,
                    photo_reference:data.result.photos[1].photo_reference,
                    key: process.env.GOOGLE_PLACE_API
                },
                responseType: "arraybuffer",
            })
            res.setHeader("Content-Type", "image/jpeg");
            res.send(photo);

        }

    }

    try {
        if(method[req.method]) {
            return method[req.method]()
        }
        else new Error('ERRO')
    }catch(e){
        console.log(e)
        return res.status(400).send(e)
    }
}