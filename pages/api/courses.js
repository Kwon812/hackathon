import {supabase} from "@/lib/db/supabase";


const TABLE = 'courses'

export default async function handler(req, res) {

    const method = {

        GET: async () => {
            const {data} = await supabase.from(TABLE).select('id,state,progress,start_date,course_name,sub_title,default_place_id').order('created_at', { ascending: false })
            // console.log(data)
            return res.status(200).send(data)
        },
        PUT: async () => {
            let data, error
            if (req.body.select == true) {
                ({data, error} = await supabase.from(TABLE).update({
                    state: 'progress',
                    progress: 0,
                    start_date: new Date()
                }).eq('id', req.body.id))
                return res.status(200).send(data)
            } else {
                let isFinished = false
                const updateData = {}

                const updateUser={}
                const currentProgress = Number(req.body.currentProgress)
                updateData.progress = currentProgress + 1

                const {data}=await supabase.from('user_preference').select('stamps_done,course_done,id').single()

                if (currentProgress + 1 === Number(req.body.courseLength)) {
                    updateData.state = 'done'
                    updateUser.course_done=Number(data.course_done)+1

                    isFinished = true
                }
                updateUser.stamps_done=Number(data.stamps_done)+1
                const a=await supabase.from('user_preference').update(updateUser).eq('id',data.id)
                await supabase.from(TABLE).update(updateData).eq('id', req.body.id)
                await supabase.from('locations').update({
                    check_status: 1,
                }).eq('id', req.body.authLocationId)

                return res.status(200).send({finished: isFinished})
            }


        },
        POST: async () => {
            const body = req.body
            const courseId=Math.floor(Math.random() * 900) + 100;
            const placeLocations = body.courseList.sort(((a,b)=>Number(a.distance_from_user)-Number(b.distance_from_user))).map(x => {
                return (
                    {
                        name:x.name,
                        type:x.type,
                        latitude:x.latitude,
                        longitude:x.longitude,
                        lo_kr:x.kr_lo,
                        info:x.info,
                        course_id:courseId,
                        place_id:x.place_id,
                        check_status:0
                    }
                )
            })

            const {data,error}=await supabase.from(TABLE).insert({
                id: courseId,
                state: 'planned',
                start_date: null,
                progress:0,
                course_name: body.course_name,
                sub_title: body.course_info,
                default_place_id:body.courseList[0].place_id

            })
            // console.log(data, error)
            await supabase.from('locations').insert(placeLocations)
            return res.status(200).send('success')
        },
    }

    try {
        if (method[req.method]) {
            return method[req.method]()
        } else new Error('ERRO')
    } catch (e) {
        res.status(400).send(e)
    }
}