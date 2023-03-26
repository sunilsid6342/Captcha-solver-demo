var Tesseract = require("tesseract.js")
// const tesseract = require("node-tesseract")not working in my laptop
// const ReadText = require('text-from-image')not working in my laptop
// var textract = require("textract") not working in my laptop
const { createWorker } = require('tesseract.js');
const fs = require('fs');
const Axios = require('axios')
//===============================using axios ------------------------

//downloadImage('https://i.ibb.co/R4BB4DW/Captcha-Bajaj.jpg',"lena.png")      // number image
//downloadImage('https://i.ibb.co/jTKYQqP/Captcha-United.png',"lena.png")     // alphabet image
// https://i.stack.imgur.com/Bptns.png

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


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


try {
    app.post("/url", async (req, res) => {
        const url = req.body.url

        await downloadImage(url,'lena.png')


        Tesseract.recognize(
            __dirname + '/lena.png',
            'eng',
            { logger: m => console.log(m) }
        ).then(({ data: { text } }) => {
            const filteredText = Array.from(text.matchAll(/\d/g)).join("")
            if(filteredText.length <=1){
                alpha()
                async function alpha(){
                    const worker = await createWorker();//alphabet
                    (async () => {
                        await worker.loadLanguage('eng+chi_tra');
                        await worker.initialize('eng+chi_tra');
                        const { data: { text } } = await worker.recognize('lena.png');
                        const tt = (text.trim()).split(" ").join("")
                        return res.send({
                            output:tt
                        })
                    })();
                }
            }else{
                return res.send({
                    output:filteredText
                })
            }
        })

    })
} catch (err) {
    console.log("error", err.message)
}



const PORT = 8000
app.listen(PORT, () => {
    console.log("Server started at Port :", PORT)
})


// res.send({
//     input:text
//   })


// number ---------------------------
// const { createWorker } = require('tesseract.js');

// const worker = await createWorker();

// (async () => {
//   await worker.loadLanguage('eng');
//   await worker.initialize('eng');
//   await worker.setParameters({
//     tessedit_char_whitelist: '0123456789',
//   });
//   const { data: { text } } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
//   console.log(text);
//   await worker.terminate();
// })();

// \n at last with alphabet ------
// const worker = await createWorker();

// (async () => {
//   await worker.loadLanguage('eng+chi_tra');
//   await worker.initialize('eng+chi_tra');
//   const { data: { text } } = await worker.recognize('./lena.png');
//   console.log(text);
//   res.send({
//     output : text
//   })
//   await worker.terminate();
// })();

//----- number for png  coorect
// Tesseract.recognize(
//     __dirname + '/lena.png',
//     'eng',
//     { logger: m => console.log(m) }
// ).then(({ data: { text } }) => {
//     const filteredText = Array.from(text.matchAll(/\d/g)).join("")
//     console.log(filteredText)
// })