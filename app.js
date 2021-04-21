const express = require("express");
const cors = require('cors');
const AWS = require("aws-sdk");
const app = express();
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Initializing AWS Polly 
const Polly = new AWS.Polly({
    region: "us-west-2"
});

// 
app.get("/",(req,res)=>{
    res.status(200).json({"message":"Success"});
});


// Haddling a GET Request for '/voices'
app.get("/voices", (req, res) => {
    var params = {
        LanguageCode: "en-GB"
    };

    Polly.describeVoices(params,
        function (err, data) {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(data);
                // return res.json({ message: 'success', data: Voices });
            }
        });
});

// Haddling a POST Request for '/listen'
// To synhesize Speech Request
app.post("/listen", (req, res) => {
    // Parameter from Body
    const { voiceId, OutputFormat, text } = req.body;

    // Parameters for sending a synthesize Speech Request
    var parameters = {
        "Engine": "standard",
        "LanguageCode": "en-US",
        "OutputFormat": OutputFormat[0],
        "SampleRate": "22050",
        "Text": text,
        "TextType": "text",
        "VoiceId": voiceId
    };
    // Synthesize the Text to Speech using Polly 
    Polly.synthesizeSpeech(parameters,
        function (err, { AudioStream }) {
            if (err) {
                console.log(err, err.stack);
            } else {
                // File name and directory for synthesized Audio 
                var file_name = '/' + text.slice(0, 15) + '-TTS-sound.' + OutputFormat[0];
                var file_dir = path.join(__dirname + '/public/', file_name);
                // Write the Syntheside audio to file 
                fs.writeFile(file_dir, AudioStream, (err) => {
                    if (err) throw err;
                    console.log('The file has been saved!');
                    // Send back the Synthesized Audio
                    return res.json({ message: 'success', data: file_name });
                });

            }
        });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/public')))// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/public/index.html'))
});

module.exports = {app, port}