import axios from "axios";


export async function receiptAuth(formData) {

    // console.log(formData.get('file'))
    return axios.post('/api/receipt', formData)
}