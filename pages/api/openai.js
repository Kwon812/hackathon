import {openAiClient} from "@/lib/openAI/openAi";
import axios from "axios";


export default async function handler(req, res) {


    if (req.method === 'POST') {
        if(req.query.type=='courseList') {


            console.log("Ds")
            console.log(req.body)
            const result = await axios.post('http://13.125.151.212:8080/ai/recommend-places', req.body)

            return res.status(200).send(result.data.data.recommendations)
        }else{
            console.log(req.body)
            const result= await axios.post('http://13.125.151.212:8080/ai/recommend-course',req.body)
            return res.status(200).send(result.data)
        }

    }
    return res.status(500).send({result:'method_error'})
}