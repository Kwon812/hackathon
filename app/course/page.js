import axios from "axios";
import TestCo from "@/components/TestCo";

export const revalidate=0
export default async function CoursePage() {


    const {data} = await axios.get('https://galaemalae.vercel.app/api/courses')
    const ids = data.filter(x => x.state === 'progress').map(x => x.id)
   const {data:progressCourse} = await axios.get('https://galaemalae.vercel.app/api/location', {
        params: {
            courseId:ids.join(','),
            multi: true
        },

    })
    return (
        <>
            <TestCo init={data} progressCourse={progressCourse}/>
        </>
    )
}