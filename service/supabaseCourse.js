import axios from "axios";


export function getCourseById(id){


}

export function getAllCourse(){

    return axios.get('/api/courses')
}

export function updateCourseById(id,select=false,currentProgress=0,authLocationId=0,courseLength=0){
    return axios.put('/api/courses',{id,select,currentProgress,authLocationId,courseLength})

}

export function postNewCourse(courseList,courseInfo){
    console.log(courseList)
    return axios.post('/api/courses', {...courseInfo,courseList})

}
