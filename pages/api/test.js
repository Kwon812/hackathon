import axios from "axios";

export default async function handler(req,res){



    if(req.method==='GET') {
        const {data} = await axios.get(
            "https://maps.apigw.ntruss.com/map-static/v2/raster",
            {
                headers: {
                    "X-NCP-APIGW-API-KEY-ID": process.env.MAP_API_ID,
                    "X-NCP-APIGW-API-KEY": process.env.MAP_API_SECRET,
                },
                params: {
                    w: 600,
                    h: 300,
                    center: `${req.query.lng},${req.query.lat}`,
                    level: 15,
                    scale:2,
                    markers: `type:d|size:mid|pos:${req.query.lng} ${req.query.lat}|viewSizeRatio:0.8`,
                },
                responseType: "arraybuffer", // 이미지니까 버퍼로 받아야 함
            }
        )
        res.setHeader("Content-Type", "image/png");
        res.send(data);
        // return res.status(200).send(a)

    }
}