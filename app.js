
const ReadText = require('text-from-image')
const fs = require('fs');
const Axios = require('axios')
//===============================using axios ------------------------



const express = require("express");
const app = express();


async function downloadImage(url, filepath) {
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath))
            .on('error', reject)
            .once('close', () => resolve(filepath));
    });
}



try{


app.get("/api/:url", async (req, res) => {

    console.log(req.params.url,"url,")
    console.log(req.url,"req")
    // downloadImage('https://i.ibb.co/R4BB4DW/Captcha-Bajaj.jpg',"lena.png")      // number image
    // downloadImage('https://i.ibb.co/jTKYQqP/Captcha-United.png',"lena.png")     // alphabet image
    await downloadImage(`${req.params.url}`, 'lena.png')
    ReadText('./lena.png').then(text => {
        res.send({
            input: text
        })
        console.log(res,"resss")
    }).catch(err => {
        console.log(err.message);
    })

})
}catch(err){
    console.log("errorr owheroheirhwoier",err.message)
}



const PORT = 8000
app.listen(PORT, () => {
    console.log("Server started at Port :", PORT)
})