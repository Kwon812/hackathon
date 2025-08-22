import axios from "axios";

export function getLocationsByCourseId(courseId,multi=false) {

    return axios.get('/api/location',{
        params:{
            courseId,
            multi:multi
        },

    })
}

export function getAllLocations(){

    return axios.get('/api/location?multi=all')
}

// export function getLocationsByCourseIdMulti(courseIds) {
//     // console.log(courseIds)
//     return axios.get('/api/location',{
//         params:{
//             courseId:courseIds.join(','),
//             multi:true
//         }
//     })
//
// }