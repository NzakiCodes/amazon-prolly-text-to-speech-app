import React, { useEffect, useState, useRef } from 'react';
function App() {
    var [voiceList, setVoiceList] = useState([]);
    var [textAudio, setTextAudio] = useState(null);
 
    var AUDIO_FORMATS = {
        'mp3': 'audio/mpeg',
        'ogg_vorbis': 'audio/ogg',
        'pcm': 'audio/wave; codecs=1'
    };
     var getSupportedAudioFormats = (audioPlayer) => {
        return Object.keys(AUDIO_FORMATS)
            .filter((audioFormats) => {
                var isSupported = audioPlayer?.canPlayType(AUDIO_FORMATS[audioFormats]);
                return isSupported === 'probaly' || isSupported === 'maybe'
            });
    }
    var voiceIdRef = useRef(null);
    var textRef = useRef(null);
    var audioRef = useRef(null);
    var audioElement = audioRef.current;


    useEffect(async () => {
        var res = await fetch("/voices");
        var data = await res.json();
        setVoiceList(data.data);
    }, []);

     const GenerateAudio = async (options, cb) => {
        var res = await fetch("/listen", options);
        var audioFetched = await res.json();
        setTextAudio(audioFetched);
        cb(audioFetched);
    }

    const OnSubmit = (e) => {
        e.preventDefault();
        var text = textRef.current.value;
        var voiceId = voiceIdRef.current.options[voiceIdRef.current.selectedIndex].value;
        var OutputFormat = getSupportedAudioFormats(audioElement);
        var options = {
            method: "post",
            body: JSON.stringify({ voiceId, text, OutputFormat }),
            headers: { 'Content-Type': 'application/json' },
        }

        GenerateAudio(options, (audioFetched) => {
            audioElement.src = audioFetched.data;
            audioElement.play();
            console.log(audioFetched.data);
        });

    }
    return (
        <div className="App">
            <header className="Header">
                <h1>Play.Voice</h1> 
                <p>Text to Speech converting App.</p>
            </header>
            <form className="Form" onSubmit={(e) => OnSubmit(e)}>
                <label className="Label Voice" htmlFor="voice">
                    Voice:
                </label>
                <select ref={voiceIdRef} id="voice" className="SelectBox" >
                    <option disabled value="m">Select a Voice</option>
                    {
                        voiceList && voiceList.map((voice) => (
                            <option key={voice.Id} value={voice.Id}>{voice.Name}</option>
                        ))
                    }
                </select>
                <label className="Label Text" htmlFor="text">
                    Text:
                </label>
                <textarea maxLength="100" ref={textRef} id="text" className="Text" cols="30" rows="10" placeholder="Enter Text or word to be converted here...">

                </textarea>
                <button type="submit" className="Generate Button">Convert</button>

            </form>
            <audio ref={audioRef} ></audio>
        </div>
    )
};



export default App;