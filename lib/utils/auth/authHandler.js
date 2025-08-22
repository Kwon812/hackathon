import {authGPS} from "@/lib/utils/auth/authGPS";
import {updateCourseById} from "@/service/supabaseCourse";


export  function authHandler(e,setShowCamera,i,authData,setShowModal){
    e.stopPropagation();

    if(i===0){
        setShowCamera(true)
    }
    else{
        authGPS(authData.location).then(res=>{
            if(res.status===true){
                const {courseId, currentProgress,locationId,courseLength}=authData
                console.log(courseLength)
                    updateCourseById(courseId, false, currentProgress,locationId,courseLength).then(res=>{
                        setShowModal(false)
                        // console.log(res)
                    })

            }
            else{
                console.log("dsandjsdnasjdsandjsa")
            }
        })

    }
}