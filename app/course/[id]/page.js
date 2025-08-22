import axios from "axios";
import NaverMap from "@/components/Map";
import {getLocationsByCourseId} from "@/service/supabaseLocation";
import Link from "next/link";



export const revalidate=0
export async function generateStaticParams(){
    const {data} = await axios.get('https://galaemalae.vercel.app/api/courses')
    const ids = data.map(x => x.id)

    return (
        ids.map(x=>({
            id:x.toString()
        }))
    )

}
export default  async function CourseDetailPage({params,searchParams}) {

    const {data}=await axios.get('https://galaemalae.vercel.app/api/location', {
        params: {
            courseId:params.id,
            multi: false
        },

    })

    const init =data.data
    const progressState=data.state

    return (

        <div className={'flex flex-col h-[100dvh] relative'}>
            <div className={'flex absolute z-10  items-center   justify-center h-12  font-bold'}>
                <Link href={'/course'}>
                <div
                     className={'flex gap-3 bg-white/30 backdrop-blur-lg ml-5 border p-2 px-4 rounded-lg mt-5'}>
                    <span className="material-symbols-outlined">arrow_left_alt</span>
                    <p>{searchParams.courseName} </p>
                </div>
                </Link>
            </div>
            <div className={'flex-1 '}>
                {
                    init.length === 0 ? null :
                        <NaverMap init={init} check={progressState} userLo={[init.latitude, init.longitude]}/>
                }


            </div>
        </div>
    )

}