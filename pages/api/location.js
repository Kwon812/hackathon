import {supabase} from "@/lib/db/supabase";


export default async function handler(req,res){

    const method={

        GET:async ()=>{
            let data,state
            if(req.query.multi==='false') {
                ({data} = await supabase.from('locations').select('*').eq('course_id', req.query.courseId))
                const {data: state} = await supabase.from('courses').select('state').eq('id', req.query.courseId).single()
                // console.log(state)
                return res.status(200).send({data, ...state})

            }else if(req.query.multi==='all'){
                ({data} = await supabase.from('locations').select('lo_kr,check_status'))
                return res.status(200).send(data)
            }
            else {
                ({data} = await supabase.from('locations').select('*').in('course_id', req.query.courseId.split(',')))
                return res.status(200).send(data)
            }
        },
        POST: async ()=>{

        },
        PUT: async ()=>{

        },
    }

    try{
        if(method[req.method]){
            return method[req.method]()
        }
        else  new Error('ERRO')
    }catch (e){
        res.status(400).send(e)
    }
}