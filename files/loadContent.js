let streams = [];
let currSong = 0;
let currPlayer = null;
let currInterval = null;

let buttonState = "play";


const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
let playID = urlParams.get('playlist')
console.log(playID);

let songID = urlParams.get('song')
console.log(songID);

let ins = urlParams.get('i');
if (ins == null) {
    ins = "pipedapi.kavin.rocks";
}

let yton = urlParams.get('y');
if (yton == null) {
    yton = "off";
}
let aut = urlParams.get('a');
if (aut == null) {
    aut = "off";
}
if (playID != null) {
    fetch('https://' + ins + '/playlists/' + playID)
        .then((response) => response.json())
        .then((data) => handleContent(data, "play"));

}
else if (songID != null) {
    playID = songID;
    fetch('https://' + ins + '/streams/' + playID)
        .then((response) => response.json())
        .then((data) => handleContent(data, "stream"));

}


function handleContent(playlistInfo, typ) {
    let mainDiv = document.getElementById("mDiv");

    console.log(playlistInfo);
    document.getElementById("listID").innerText = playID;
    document.getElementById("albumThumb").setAttribute("src", playlistInfo['thumbnailUrl']);
    let offset = 0;
    if (typ == "play") {
        document.getElementById("playTitle").innerText = playlistInfo['name'];
    }
    else {
        document.getElementById("playTitle").innerText = playlistInfo['title'];
        addElement("/watch?v=" + playID, playlistInfo['title'], playlistInfo['uploader'], mainDiv, 0);
        offset = 1;
    }



    if (aut == "on" || typ == "play") {
        let counter = offset;
        for (let i = 0; i < playlistInfo['relatedStreams'].length; i++) {
            if (typ == "play") {
                addElement(playlistInfo['relatedStreams'][i]['url'], playlistInfo['relatedStreams'][i]['title'], playlistInfo['relatedStreams'][i]['uploaderName'], mainDiv, counter);
                counter++;
            }
            else {
                if (playlistInfo['relatedStreams'][i]['type'] == "stream") {
                    if (!(
                        playlistInfo['title'].toLowerCase().includes(playlistInfo['relatedStreams'][i]['title'].toLowerCase()) ||
                        playlistInfo['relatedStreams'][i]['title'].toLowerCase().includes(playlistInfo['title'].toLowerCase())
                    )) {
                        addElement(playlistInfo['relatedStreams'][i]['url'], playlistInfo['relatedStreams'][i]['title'], playlistInfo['relatedStreams'][i]['uploaderName'], mainDiv, counter);
                        counter++;
                    }
                }

            }

        }
    }


    createAudioSource(currSong);

}
function addElement(raw, titl, arti, mainDiv, i) {

    let final = raw.substring(9);

    streams[i] = final;

    let container = document.createElement("article");


    let img = document.createElement("img");
    if (yton == "on") {
        img.setAttribute("src", "https://img.youtube.com/vi/" + final + "/sddefault.jpg");
    }
    else {
        img.setAttribute("src", "https://pipedproxy.kavin.rocks/vi/" + final + "/sddefault.jpg?host=i.ytimg.com");
    }

    img.setAttribute("loading", "lazy");
    img.setAttribute("class", "mImg");
    container.setAttribute("class", "asideBox");
    container.append(img);


    let title = document.createElement("p");
    title.textContent = "Title: " + titl;
    container.append(title);


    let art = document.createElement("p");
    art.textContent = "Uploader: " + arti;
    container.append(art);

    let para = document.createElement("p");
    para.textContent = "Video ID: " + final;
    container.append(para);

    


    mainDiv.append(container);
}
function createAudioSource(no) {
    currPlayer = null;
    currInterval = null;
    let mainDiv = document.getElementById("mDiv");


    let stream = streams[no];
    let childs = mainDiv.children
    let container = childs.item(no + 5);


    fetch('https://' + ins + '/streams/' + stream)
        .then((response) => response.json())
        .then((data) => addAudioElement(data, container));

}
function addAudioElement(data, container) {
    let streamList = data['audioStreams'];
    let qualityList = [];

    let container2 = document.createElement("div");
    //container2.setAttribute("class", "panel-body")

    //let temptitle = document.createElement("span");
    //temptitle.innerText = "Streams: ";
    //container2.append(temptitle);
    for (let i = 0; i < streamList.length; i++) {
        //let para = document.createElement("span");
        let raw = streamList[i]['quality'];
        let no = raw.substring(0, raw.length - 5);


        //para.textContent = no + " ";

        //container2.append(para);
        qualityList[i] = no;

        qualityList = qualityList.sort(function (a, b) { return b - a; });

        console.log(qualityList);


    }
    let maxQual = qualityList[0];

    //let tempnote = document.createElement("p");
    //tempnote.innerText = "HTML Video Loaded... ";
    //container2.append(tempnote);


    for (let i = 0; i < streamList.length; i++) {
        if (streamList[i]['quality'] == maxQual + " kbps") {
            let audio = document.createElement("video");

            audio.setAttribute("controls", null);
            audio.setAttribute("width", "250");
            audio.setAttribute("height", "40");

            let source = document.createElement("source")

            source.setAttribute("src", streamList[i]['url'])
            source.setAttribute("type", streamList[i]['mimeType'])

            audio.append(source);

            container2.append(document.createElement("br"));
            container2.append(audio);

            container.append(container2);

            addEndingChecker(audio);
            audio.play();

            currPlayer = audio;
            break;
        }
    }
}

function addEndingChecker(element) {
    let int = setInterval(() => {
        UIProgressUpdate(100 * element.currentTime / element.duration + "%");
        if (Math.round(element.currentTime) == Math.round(element.duration)) {
            loadNextSong();
            clearInterval(int);
            element.remove();
        }
    }, 500);
    currInterval = int;
}
function loadNextSong() {
    currSong++;
    createAudioSource(currSong);
}
function loadPrevSong() {
    currSong--;
    createAudioSource(currSong);
}


document.getElementById("mplayButton").addEventListener("click", UIHandle);
document.getElementById("mforwardButton").addEventListener("click", next);
document.getElementById("mbackButton").addEventListener("click", back);


function play() {
    //alert("play");
    if (currPlayer != null) {
        currPlayer.play();
        UIUpdate();
    }
    else {
        alert("not initiaised");
    }
}
function pause() {
    //alert("play");
    if (currPlayer != null) {
        currPlayer.pause();
        UIUpdate();
    }
    else {
        alert("not initiaised");
    }
}
function UIUpdate() {
    buttonState = buttonState == "play" ? "pause" : "play";
    document.getElementById("mplayButton").innerText = buttonState;
}
function UIHandle() {
    if (buttonState == "play") {
        play();
    }
    else {
        pause();
    }
}
function UIProgressUpdate(progress) {
    document.getElementById("UIProgress").setAttribute("style", "width: " + progress);
}
function next() {
    //alert("next");
    if (currPlayer != null) {
        if (currInterval != null) {
            clearInterval(currInterval);
            currPlayer.remove();
            loadNextSong();
        }
        else {
            alert("err no checker");
        }
    }
    else {
        alert("not initiaised");
    }
}
function back() {
    //alert("prev");
    if (currPlayer != null) {
        if (currInterval != null) {
            clearInterval(currInterval);
            currPlayer.remove();
            loadPrevSong();
        }
        else {
            alert("err no checker");
        }
    }
    else {
        alert("not initiaised");
    }
}