// Global Variables
//================================
//index of current show in each section
var showIndex = [];
//url of json structure
let requestURL = "../assets/jsonFiles/";
//container of all info for the campaigns 
let campaignInfo = [];
//json files that need to be loaded
let files = 1;
//section y offsets
let yOffsets = [];
let curSection = 0;

window.onload = function(){
    loadJsonFiles(requestURL, campaignInfo, 0);
    testFiles(50);
    scrollingBackground();
}



//function that loads all my json information
//Works recursively by:
//+parasing each line of every info.json
//+each folder level:
//  +represents a group of elements
//  +has an injo.json
//  +if a folder has a subfolder their name is listed under the "children" 
//    value of their info.json
//  +once a children value is found a subarray is created and loadJsonFiles
//      is ran on the next level of info.json
//======================================
//Parameters
//+path = the url path of the info.json being loaded
//+parent = the container holding the information being loaded
//+index = the index for child objects, needed to deal with asynchronous ordering
function loadJsonFiles(path, parent, index){
    let url = path + "info.json"
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.responseType = 'json';
    request.send();

    request.onload = function(){
        //container for current folder being parsed
        let curChild = {};
        parent.splice(index, 1, curChild);

        let info = request.response;
    
        for(key in info){
            if(key === "children"){
                files += info[key].length;
                let child = new Array(info[key].length);
                curChild[key] = child;

                //recursively running this function on each child 
                for(let x = 0; x < info[key].length; x++){
                    url = path + info[key][x] + "/";
                    loadJsonFiles(url, child, x);
                }
            }
            else{
                //loading information into container
                curChild[key] = info[key];
            }
        }
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
    }
    else{
        console.log("files remaining to load: " + files);
        setTimeout(() =>{
            testFiles();
        }, delay);
    }
}



//Adds eventListener to scrollbar
function scrollingBackground() {
    let lastKnownScrollPosition = 0;
    let ticking = false;

    document.addEventListener('scroll', function(e) {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(
                function() 
                {
                    checkBackground(lastKnownScrollPosition);
                    ticking = false;
                }
            );

            ticking = true;
        }
    });
}

//Checks if background needs to be changed based on scroll position
//======================================
//Parameters
//+scrollPosition = current scroll location
function checkBackground(scrollPosition){
    //scolled into next section
    if(scrollPosition > yOffsets[curSection]){
        //check to make sure this isn't the last section
        if(curSection+1 < yOffsets.length){
            curSection++;
            let sectionNum = curSection+1;
            let selector = ".section:nth-of-type("+sectionNum+")"+"> .show:not(.hide)";
            let curShow = document.querySelector(selector);
            changeBackground(curShow.style.getPropertyValue('--name'));
        }
         
    }//scrolled into previous section
    else if(scrollPosition < yOffsets[curSection-1]){
        //check to make sure this isn't the first section
        if(curSection-1 >= 0){
            curSection--;
            let sectionNum = curSection+1;
            let selector = ".section:nth-of-type("+sectionNum+")"+"> .show:not(.hide)";
            let curShow = document.querySelector(selector);
            changeBackground(curShow.style.getPropertyValue('--name'));
        }
    }
};



//creates the page
function generatePage(){
    let body = document.querySelector('body');
    let container = document.querySelectorAll('.container')[1];
    
    let chapters = campaignInfo[0].children;
    
    body.style.backgroundImage = "url(../assets/imgs/backgrounds/bg-"+chapters[0].children[0].name+".png)";
    
    //create chapters
    for(let x = 0; x < chapters.length; x++){
        let chapterInfo = chapters[x];

        let chapterContainer = createChapter(chapterInfo);
        container.appendChild(chapterContainer);

        //chapter y offset for scrolling background change
        yOffsets.push(chapterContainer.offsetTop + chapterContainer.offsetHeight);
        
        //create shows
        for(let y = 0; y < chapterInfo.children.length; y++){
            let showInfo = chapterInfo.children[y];

            let showContainer = createShow(showInfo, chapterInfo.name);
            chapterContainer.appendChild(showContainer);
            
            //create buttonBar
            let buttonBar = createButtonBar(chapterContainer, showContainer, y);
            showContainer.appendChild(buttonBar);
            if(y === 0){
                //make first show visible
                showContainer.classList.remove('hide');

                //hide first show's prev button since it is the first show
                let firstBtn = showContainer.querySelector('.buttonBar button');
                firstBtn.classList.add('unavailable');
            }
        }

        //hide last show's next button since it is the last show
        let lastBtn = chapterContainer.querySelector('.show:last-child .buttonBar button:last-child');
        lastBtn.classList.add('unavailable');
    }
}

//Create chapter element
//======================================
//Parameters
//+chapterInfo = array of chapter information(details in info.json of specific chapter folder)
function createChapter(chapterInfo){
    let chapter = document.createElement('div');
    chapter.classList.add('section');

    let header = document.createElement('h1');
    header.innerHTML = chapterInfo.name.charAt(0).toUpperCase() + chapterInfo.name.slice(1)
    chapter.appendChild(header);

    let descr = document.createElement('p');
    descr.innerHTML = chapterInfo.description;
    chapter.appendChild(descr);

    return chapter;
}

//Create show element
//======================================
//Parameters
//+parent = chapter element containing the show
//+showInfo = array of show information(details in info.json of specific show folder)
function createShow(showInfo, chapterName){
    let show = document.createElement('div');
    show.classList.add('show');
    show.classList.add('hide');
    show.style.setProperty('--color700', showInfo.color700);
    show.style.setProperty('--color400', showInfo.color400);
    show.style.setProperty('--name', showInfo.name);

    let card = document.createElement('a');
    card.href = "../show/show.html?"+"chapter="+chapterName+"&campaign="+showInfo.name;
    //show/show.html?chapter=prologue&campaign=shrineOfSin
    show.appendChild(card);

    let showCard = document.createElement('div');
    showCard.classList.add('showCard');
    card.appendChild(showCard);

    let imgCol = document.createElement('div');
    imgCol.classList.add('imgCol');
    showCard.appendChild(imgCol);

    let img = document.createElement('img');
    img.src = showInfo.showImage;
    imgCol.appendChild(img);

    let infoCol = document.createElement('div');
    infoCol.classList.add('infoCol');
    infoCol.style.backgroundImage = "url("+showInfo.iconImage+")";
    showCard.appendChild(infoCol);

    let infoP = document.createElement('p');
    infoP.innerHTML = showInfo.description;
    infoCol.appendChild(infoP);

    return show;
}

//Create buttonBar element
//======================================
//Parameters
//+grandParent = chapter element containing the buttonBar needed to change to next/prev shows
//+parent = show element containing the buttonBar
//+curShowIndex = index of this buttonBar needed to change to next/prev shows
function createButtonBar(grandParent, parent, curShowIndex){
    let buttonBar = document.createElement('div');
    buttonBar.classList.add('buttonBar');
    parent.appendChild(buttonBar);

    let prevButton = document.createElement('button');
    prevButton.addEventListener("click", function(){prevShow(grandParent, parent, curShowIndex);});
    buttonBar.appendChild(prevButton);

    let nextButton = document.createElement('button');
    nextButton.addEventListener("click", function(){nextShow(grandParent, parent, curShowIndex);});
    buttonBar.appendChild(nextButton);

    return buttonBar;
}



//Change show to next show
//======================================
//Parameters
//+showParent = chapter element containing the buttonBar needed to change to next/prev shows
//+curShow = current show element containing the buttonBar
//+curShowIndex = index of cur show needed to change to next/prev shows
function nextShow(showParent, curShow, curShowIndex){
    let allShows = showParent.querySelectorAll('.show');
    if(curShowIndex+1 < allShows.length){
        let nextShow = allShows[curShowIndex+1];

        hide(curShow);
        changeBackground(nextShow.style.getPropertyValue('--name')); 
        show(nextShow);
    }
}

//Change show to prev show
//======================================
//Parameters
//+showParent = chapter element containing the buttonBar needed to change to next/prev shows
//+curShow = current show element containing the buttonBar
//+curShowIndex = index of cur show needed to change to next/prev shows
function prevShow(showParent, curShow, curShowIndex){
    let allShows = showParent.querySelectorAll('.show');
    if(curShowIndex-1 >= 0){
        let prevShow = allShows[curShowIndex-1];

        hide(curShow);
        changeBackground(prevShow.style.getPropertyValue('--name'));
        show(prevShow);
    }
}

//Hides element
//======================================
//Parameters
//+element = adds hide class to the element
function hide(element){
    element.classList.add('hide');
}   

//Reveals element
//======================================
//Parameters
//+element = removes hide class to the element
function show(element){
    element.classList.remove('hide');
}

//Changes background image of the body element
//======================================
//Parameters
//+showName = name of show for the background
function changeBackground(showName){
    var body = document.querySelector('body');
    var newBackground = "url(../assets/imgs/backgrounds/bg-"+showName+".png)"; 
    body.style.backgroundImage = newBackground;
}



