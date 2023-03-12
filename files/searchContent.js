const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const sq = urlParams.get('q')
console.log(sq);

let typ = urlParams.get('type')
console.log(typ);
if (typ == null) {
    typ = "albums"
}

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
let aut = urlParams.get('a')
console.log(aut);
if (aut == null) {
    aut = "off"
}
if (sq.length > 0) {
    if (typ!="channels") {
        typ = "music_" + typ
    }
    fetch('https://' + ins + '/search?q=' + sq + '&filter=' + typ)
        .then((response) => response.json())
        .then((data) => handleContent(data));

}


function handleContent(playlistInfo) {
    console.log(playlistInfo);
    
    document.getElementById("sTitle").innerText = sq + " (in " + typ.replace("_", " ") + ")";

    let mainDiv = document.getElementById("mDiv");




    for (let i = 0; i < playlistInfo['items'].length; i++) {

        let raw = playlistInfo['items'][i]['url'];
        let final = "";
        if (typ != "music_songs" && typ != "channels") {
            final = raw.substring(15);
        }
        else {
            final = raw.substring(9);
        }




        let container = document.createElement("article");


        let p = document.createElement("p");
        let title = document.createElement("a");
        if (typ == "music_songs") {
            title.textContent = playlistInfo['items'][i]['title'];
            title.setAttribute("href", "/playr/player?song=" + final + "&i=" + ins + "&y=" + yton + "&a=" + aut);
        }
        else if (typ == "channels" ) {
            title.textContent = playlistInfo['items'][i]['name'];
            title.setAttribute("href", "/playr/channel?channel=" + final + "&i=" + ins+ "&p="+ pins+"&y=" + yton);
        }
        else{
            title.textContent = playlistInfo['items'][i]['name'];
            title.setAttribute("href", "/playr/player?playlist=" + final + "&i=" + ins+ "&y=" + yton);
            
        }
        title.setAttribute("class", "white");
        p.append(title)
        container.append(p);

        if (typ != "channels") {
            let title2 = document.createElement("p");
            title2.innerText = playlistInfo['items'][i]['uploaderName'];
            container.append(title2);
        }
        

        let img = document.createElement("img");
        let r = playlistInfo['items'][i]['thumbnail'];


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
            img.src='/images/arrow.png';
            setTimeout(function() {
                img.src = url;
            }, 10000);
            
        });
        container.append(img);


        mainDiv.append(container);
    }



}
