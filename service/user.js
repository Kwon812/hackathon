import axios from "axios";


export async function creatUser(userInfo){

    console.log(userInfo)
    return await axios.post('/api/user', {
        ...userInfo,
        course_done:0,
        stamps_done:0,
        total_course:0
    })

}


export async function getUser(){
    return await axios.get('/api/user')
}