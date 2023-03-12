const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const sq = urlParams.get('channel')
console.log(sq);


let ins = urlParams.get('i')
console.log(ins);
if (ins == null) {
    ins = "pipedapi.kavin.rocks"
}
let pins = urlParams.get('p')
console.log(pins);
if (pins == null) {
    pins = "pipedproxy.kavin.rocks"
}
let yton = urlParams.get('y')
console.log(yton);
if (yton == null) {
    yton = "off"
}
if (sq.length > 0) {
    fetch('https://' + ins + '/channel/' + sq)
        .then((response) => response.json())
        .then((data) => handleTabs(data));

}
typ = "play";

function handleTabs(content) {
    console.log(content);
    document.getElementById("sTitle").innerText = content['name'];
    for (let i = 0; i < content['tabs'].length; i++) {
        if (content['tabs'][i]['name'] == "playlists") {
            fetch('https://' + ins + '/channels/tabs?data=' + content['tabs'][i]['data'])
        .then((response) => response.json())
        .then((data) => handleContent(data));

        }
    }
}

function handleContent(playlistInfo) {
    console.log(playlistInfo);
    

    let mainDiv = document.getElementById("mDiv");




    for (let i = 0; i < playlistInfo['content'].length; i++) {

        let raw = playlistInfo['content'][i]['url'];
        let final = "";
        if (typ != "songs") {
            final = raw.substring(15);
        }
        else {
            final = raw.substring(9);
        }




        let container = document.createElement("article");
        

        let p = document.createElement("p");
        let title = document.createElement("a");
        if (typ != "songs") {
            title.textContent = playlistInfo['content'][i]['name'];
            title.setAttribute("href", "/playr/player?playlist=" + final + "&i=" + ins+ "&y=" + yton);
        }
        else {
            title.textContent = playlistInfo['content'][i]['title'];
            title.setAttribute("href", "/playr/player?song=" + final + "&i=" + ins + "&y=" + yton);
        }
        title.setAttribute("class", "white");
        p.append(title)

        let title2 = document.createElement("p");
        title2.innerText = playlistInfo['content'][i]['uploaderName'];

        
        

        container.append(p);
        container.append(title2);

        let img = document.createElement("img");
        let r = playlistInfo['content'][i]['thumbnail'];


        let rr = r.substring("https://".length);
        let rrr = rr.substring(rr.indexOf("/"));

        let url = "https://" + pins + "" + rrr;
        img.src='/playr/images/arrow.png';
            setTimeout(function() {
                img.src = url;
            }, (i * 200));
        
        img.setAttribute("loading", "lazy");
        img.setAttribute("class", "thumbImg");
        img.onerror = (() => {
            img.onerror = (() => {img.src='/playr/images/arrow.png'; console.log("img loading error")});
            img.src='/playr/images/arrow.png';
            setTimeout(function() {
                img.src = url;
            }, 10000);
            
        });
        container.append(img);


        mainDiv.append(container);
    }



}
