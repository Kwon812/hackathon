import fs from "fs";
import axios from "axios";
import {IncomingForm} from "formidable";
import FormData from "form-data";

export const config = {
    api: {
        bodyParser: false, // FormData 받으려면 반드시 false
    },
};

export default async function handler(req, res) {
    if (req.method === "POST") {
        const form = new IncomingForm();

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: "Form parsing failed"});
            }


            try {

            const fileKey = Object.keys(files)[0]; // 클라이언트에서 append한 'file'
            const file = files[fileKey][0];


                const formData = new FormData();
                const fileStream = fs.createReadStream(file.filepath);
                formData.append("file", fileStream, file.originalFilename);
                // formData.append("lang", fields.lang || "ko");

                const {data} = await axios.post(
                    "https://api.tabscanner.com/api/2/process",
                    formData,
                    {
                        headers: {
                            ...formData.getHeaders(),
                            apikey: process.env.RECEIPT_KEY,
                        },
                    }
                );
                const {token}=data
                console.log(token);
                await new Promise(resolve => setTimeout(resolve,1500))
                let result= await axios.get(
                        `https://api.tabscanner.com/api/result/${token}`,
                        {
                            headers: {
                                apikey: process.env.RECEIPT_KEY,
                            },
                        }
                    )

                console.log(result)
                res.status(200).send({place_name:result.data.result.establishment});
            } catch (error) {
                console.error(error.response?.data || error.message);
                res.status(500).json({error: "Tabscanner request failed"});
            }
        });
    } else {
        res.status(405).json({error: "Method not allowed"});
    }
}
