// Global Variables
//================================
//index of current show in each section
var showIndex = [];
//url of json structure
let url = "../assets/jsonFiles/";
// let baseInfoURL = "../assets/jsonFiles/prologue/shrineOfSin/info.json";
// let episodesURL = "../assets/jsonFiles/prologue/shrineOfSin/episodes.json";
let baseInfoURL;
let episodesURL;

//json files that need to be loaded
let files = 2;
//container of all info for the campaigns 
let campaignInfo = new Array(files);


window.onload = function(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    baseInfoURL = url+urlParams.get('chapter')+"/"+urlParams.get('campaign')+"/info.json"
    episodesURL = url+urlParams.get('chapter')+"/"+urlParams.get('campaign')+"/episodes.json"

    loadJsonInfo(baseInfoURL, campaignInfo, 0);
    loadJsonInfo(episodesURL, campaignInfo, 1);
    testFiles(50);
}

function loadJsonInfo(url, campaignInfo, index){
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function(){
        let info = request.response;
        campaignInfo[index] = info;
        files--;
    }
}



//Runs generatePage when all json files are loaded.
//======================================
//Parameters
//+delay = time between recursive calls
function testFiles(delay){
    if(files === 0){
        generatePage();
        setupNavbar();
    }
    else{
        console.log("files remaining to load: " + files);
        setTimeout(() =>{
            testFiles();
        }, delay);
    }
}

function generatePage(){
    let body = document.querySelector('body');
    body.style.backgroundImage = "url(../assets/imgs/backgrounds/bg-"+campaignInfo[0].name+".png)";
    
    document.title = campaignInfo[1].name;

    let container = document.querySelectorAll(".container")[1];
    document.documentElement.style.setProperty('--color700', campaignInfo[0].color700);
    document.documentElement.style.setProperty('--color400', campaignInfo[0].color400);
    
    //create header section and then append
    let header = createHeader(campaignInfo[0]);
    container.appendChild(header);

    //create episodes section
    let episodeSection = createEpisodeSection(campaignInfo[1]);
    container.appendChild(episodeSection);
}

function createHeader(headerInfo){
    let section = document.createElement('div');
    section.classList.add('section');

    let flexCol = document.createElement('div');
    flexCol.classList.add('flexColToRow');
    section.appendChild(flexCol);

    let imgCol = document.createElement('div');
    imgCol.classList.add('imgCol');
    flexCol.appendChild(imgCol);

    let img = document.createElement('img');
    img.src = headerInfo.showImage;
    imgCol.appendChild(img);

    let infoCol = document.createElement('div');
    infoCol.classList.add('infoCol');
    infoCol.style.backgroundImage = "url("+headerInfo.iconImage+")";
    flexCol.appendChild(infoCol);

    let p = document.createElement('p');
    p.innerHTML = headerInfo.description;
    infoCol.appendChild(p);

    return section;
}

function createEpisodeSection(episodeInfo){
    let section = document.createElement('div');
    section.classList.add('section');

    let flexCol = document.createElement('div');
    flexCol.classList.add('flexColToRow');
    section.appendChild(flexCol);

    let h1 = document.createElement('h1');
    h1.innerHTML = "Episodes";
    flexCol.appendChild(h1);

    let fullCollection = document.createElement('div');
    fullCollection.classList.add('fullCollection');
    flexCol.appendChild(fullCollection);

    let h2 = document.createElement('h2');
    h2.innerHTML = "Full Collections";
    fullCollection.appendChild(h2);

    let subSection = document.createElement('div');
    subSection.classList.add('subSection');
    fullCollection.appendChild(subSection);

    let a1 = createLink(['icon-youtube'], ['fab','fa-youtube','fa-2x'], episodeInfo.youtubeCollection);
    subSection.appendChild(a1);

    let a2 = createLink(['icon-twitch'], ['fab','fa-twitch','fa-2x'], episodeInfo.twitchCollection);
    subSection.appendChild(a2);

    let a3 = createLink(['icon-mp4'], ['fas','fa-music','fa-2x'], episodeInfo.mp4Collection);
    subSection.appendChild(a3);

    for(let x = 1; x < episodeInfo.episodeInfo.length; x++){
        let episode = createEpisode(episodeInfo.episodeInfo[x], x-1);
        section.appendChild(episode);
    }

    return section;
}

function createEpisode(episodeInfo, episodeNum){
    let episode = document.createElement('div');
    episode.classList.add('episode');

    let h1 = document.createElement('h1');
    h1.innerHTML = episodeNum;
    episode.appendChild(h1);

    let flexCol = document.createElement('div');
    flexCol.classList.add('flexColToRow');
    episode.appendChild(flexCol);

    let episodeImg = document.createElement('div');
    episodeImg.classList.add('episodeImg');
    flexCol.appendChild(episodeImg);

    //Kinda messy, clean up later
    let aCredit = document.createElement('a');
    if(episodeInfo.imgArtist === ""){
        aCredit.classList.add('disable-select');
    }
    else{
        aCredit.href = episodeInfo.imgArtist;
    }
    aCredit.setAttribute('target', '_blank');
    aCredit.setAttribute("rel", "noopener noreferrer");
    episodeImg.appendChild(aCredit);

    //this too?
    let img = document.createElement('img');
    img.src = "../"+campaignInfo[1].episodeImageFolder+"/"+episodeNum+".png";
    img.onerror = function () {
        this.src = campaignInfo[0].showImage;
    };
    aCredit.appendChild(img);

    let episodeBtns = document.createElement('div');
    episodeBtns.classList.add('episodeBtns');
    flexCol.appendChild(episodeBtns);

    let detailsGroup = document.createElement('div');
    detailsGroup.classList.add('detailsGroup');
    episodeBtns.appendChild(detailsGroup);

    let detailsText = document.createElement('div');
    detailsText.classList.add('detailsText');
    detailsGroup.appendChild(detailsText);

    let details1 = document.createElement('div');
    details1.classList.add('details');
    details1.innerHTML = "Air Date: " + episodeInfo.airDate;
    detailsText.appendChild(details1);

    let details2 = document.createElement('div');
    details2.classList.add('details');
    details2.innerHTML = "Duration: " + episodeInfo.duration;
    detailsText.appendChild(details2);
    
    if(episodeInfo.summary !== ""){
        let tldwA = document.createElement('a');
        detailsGroup.appendChild(tldwA);

        let tldwImg = document.createElement('img');
        tldwImg.classList.add('tldwImg');
        tldwImg.src = "../assets/imgs/icons/TLDW(sad2).png";
        tldwA.href = episodeInfo.summary;
        tldwImg.classList.add('tldwGif');
        tldwA.setAttribute('target', '_blank');
        tldwA.setAttribute("rel", "noopener noreferrer");
        tldwA.appendChild(tldwImg);
    }
   

    let episodeVids = document.createElement('div');
    episodeVids.classList.add('episodeVids', 'subSection');
    episodeBtns.appendChild(episodeVids);

    let h2 = document.createElement('h2');
    h2.innerHTML = "Videos";
    episodeVids.appendChild(h2);

    let a1 = createLink(['icon-youtube'], ['fab','fa-youtube','fa-lg'], episodeInfo.youtube);
    episodeVids.appendChild(a1);

    let a2 = createLink(['icon-twitch'], ['fab','fa-twitch','fa-lg'], episodeInfo.twitch);
    episodeVids.appendChild(a2);

    let episodeArt = document.createElement('div');
    episodeArt.classList.add('episodeVids', 'subSection');
    episodeBtns.appendChild(episodeArt);

    let h2_2 = document.createElement('h2');
    h2_2.innerHTML = "Fan Art";
    episodeArt.appendChild(h2_2);

    let a3 = createLink(['icon-discord'], ['fab','fa-discord','fa-lg'], episodeInfo.fanArtDiscord);
    episodeArt.appendChild(a3);

    let a4 = createLink(['icon-twitch'], ['fab','fa-twitch','fa-lg'], episodeInfo.fanArtTwitch);
    episodeArt.appendChild(a4);

    return episode;
}

function createLink(aClasses, iClasses, link){
    let a = document.createElement('a');
    a.classList.add(aClasses[0]);
    a.setAttribute('target', '_blank');
    a.setAttribute("rel", "noopener noreferrer");
    

    if(link === ""){
        a.classList.add('unavailable', 'disable-select');
    }
    else{
        a.href = link;
    }

    let i = document.createElement('i');
    for(let x = 0; x < iClasses.length; x++){
        i.classList.add(iClasses[x]);
    }
    
    a.appendChild(i);

    return a;
}


// NAVBAR FUNCTIONS
function setupNavbar(){
    console.log("setup navbar");
    //dropdown-name
    //dropdown-group-name
    let navbarDropdowns = document.querySelectorAll(".nav__dropdown-name");
    for(let x = 0; x < navbarDropdowns.length; x++){
        navbarDropdowns[x].addEventListener('click', event => {
            toggleClass(navbarDropdowns[x],"nav__active_visible");
            toggleClass(navbarDropdowns[x],"nav__active_block");
          }
        );
    }

    let navbarGroups = document.querySelectorAll(".nav__dropdown-group-name");
    for(let x = 0; x < navbarGroups.length; x++){
        navbarGroups[x].addEventListener('click', event => {
            toggleClass(navbarGroups[x],"nav__active_block");
          }
        );
    }

    let navbarBtn = document.querySelector(".navBtn");
    let home = document.querySelector(".nav_homeBtn");
    navbarBtn.addEventListener('click', event => {
        toggleClass(home,"nav__active_block");
        }
    );
    
}

function toggleClass(object, className){
    if(object.classList.contains(className)){
        object.classList.remove(className);
    }
    else{
        object.classList.add(className);
    }
}