import axios from "axios";
import {supabase} from "@/lib/db/supabase";

export default async function handler(req, res) {

    const method = {
        POST: async () => {
            const result=await  supabase.from('user_preference').insert(req.body)
            // console.log(data)
            // console.log(error)
            return res.status(200).send(result)
        },
        GET: async () => {
            const result=await  supabase.from('user_preference').select().single()
            return res.status(200).send(result)
        }
    }

    try {
        if (method[req.method]) {
            return method[req.method]()

        } else new Error('ERRO')
    } catch (e) {
        res.status(400).send(e)
    }
}