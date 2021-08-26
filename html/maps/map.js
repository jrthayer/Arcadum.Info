//------------//------------//------------//------------//------------
//      TABLE OF CONTENTS
//------------//------------//------------//------------//------------
//      1. Initialization
//          1.1 Global Data Structures
//          1.2 Initialize Components
//      2. Features
//          2.1 Map Scale
//          2.2 Map Drag & Move
//          2.3 Side Panel
//          2.4 Resize Container
//          2.5 Night Mode
//      3. Html Generators
//      4. Helper Functions
//------------//------------//------------//------------//------------
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let mapName = urlParams.get('map');
if(mapName === null){
    mapName = "glies";
}

//retrieve json file directory from html script
let path = '../../assets/jsonFiles/maps/';
let jsonFile = `${path + mapName}.json`;
console.log(jsonFile);

//------------//------------//------------//------------
//      1. Initialization
//------------//------------//------------//------------


//------------//------------//------------ 
//  1.1 Global Data Structures 
//------------//------------//------------

//map dimensions and moving variables
const mapInfo = {
    scale: 1,
    translate: {x: 0, y: 0},
    prevMouse: {x: 0, y: 0},
    edges: {top: 0, bottom: 0 , left: 0, right: 0},
    map: {baseHeight:0, baseWidth:0, height: 0, width: 0, maxHeight:0},
    larger: {height: false, width: false},
    container: {height: 0, width: 0},
    maxZoomLevel: 0,
    scaleIncrement: 0,
    scaleMax: 0,
    scaleMin: 1,
    timeout: function(){
        return setTimeout(function(){
            htmlElements.map.classList.remove('transition');
            htmlElements.map.addEventListener('pointerdown', mouseDownHandler);
            console.log("this ran");
        }, 500);
    },
    timeoutID: 0
}

//html elements
const htmlElements = {
    container: document.querySelector('.mapContainer'),
    map: document.querySelector('.map'),
    mapImage: document.querySelector('.map img'),
    pointsContainer: "",
    settingsBar: document.querySelector('#settingsBar'),
    sidePanel: document.querySelector('#sidePanel'),
    sidePanelBtn: document.querySelector('#sidePanelBtn'),
    bottomBtn: document.querySelector('#bottomBtn'),
    panelInfo: document.querySelector("#panelInfo")
}
 

//------------//------------//------------
//  1.2 Initialize Components
//------------//------------//------------

//after html page is loaded retrieve json file and generate page
//------------
//+used axios for get request
//+generates map on success
//+console error on failure
window.addEventListener('load', async function(){
    //load info
    axios.get(jsonFile)
        .then(function (response) {
            let navBar = document.querySelector('header');
            let navHeight = parseInt(window.getComputedStyle(navBar).getPropertyValue('height'));
            navHeight += 7;
            
            htmlElements.container.style.setProperty('--navHeight', `${navHeight}px`);

            let data = response.data;

            //init zoom values
            mapInfo.map.maxHeight = data.maxHeight;
            mapInfo.map.minHeight = data.minHeight;
            mapInfo.scaleIncrement = data.scaleIncrement;
            htmlElements.map.style.setProperty('--mapScale', mapInfo.scale);

            //load map image triggering onload function below
            htmlElements.mapImage.src = data.mapSrc;
            htmlElements.mapImage.style.height = mapInfo.map.minHeight+"px";
            htmlElements.mapImage.classList.add('transition');

            let pointsData = data.points;
            let pointTypes = data.pointTypes;

            //create legend feature
            let legendBtn = document.querySelector('#legend');
            let legendHtml = createLegend(pointTypes);
            legendBtn.addEventListener('click', () => populatePanel(legendBtn, legendHtml));

            //generate map points
            let pointsContainer = document.createElement('div');
            pointsContainer.id = 'pointsContainer';
            pointsContainer.classList.add('transition');

            generatePoints(pointsContainer, pointsData, pointTypes);

            htmlElements.pointsContainer = pointsContainer;
            htmlElements.pointsContainer.style.setProperty('--pointHeight',  mapInfo.map.minHeight/100 * 3);
            htmlElements.map.appendChild(pointsContainer);

            //click first point, should be continent
            pointsContainer.querySelector('.point').click();
        })
        .catch(function (error) {
            console.log(error);
        });
});

function generatePoints(parent, points, pointTypes){
    for(let x = 0; x < points.length; x++){
        let newPoint = createPoint(points[x], pointTypes);
        let pointInfo = createPanel(points[x]);
        newPoint.addEventListener('click', () => populatePanel(newPoint, pointInfo));
        parent.appendChild(newPoint);
        if('points' in points[x]){
            generatePoints(parent, points[x].points, pointTypes);
        }
    }
}

//set necessary variables after map img has loaded
//------------
htmlElements.mapImage.onload = function(){
    initialMapDimensions();
    calcMapDimensions();
}

//------------//------------//------------//------------
//      2. Features
//------------//------------//------------//------------


//------------//------------//------------
//  2.1 Map Scale
//------------//------------//------------

//functions
//------------//------------

//scales map
//------------
//+updates scale
//+checks for max and min map height
//+scales img and updates map variables
//+checks if image is out of bounds
function zoom(increment = 0){
    let prevScale = mapInfo.scale;
    //increment scale
    mapInfo.scale += increment;
    calcMapDimensions();

    //check for max and min height
    if(mapInfo.map.height < mapInfo.map.minHeight){
        mapInfo.scale = mapInfo.scaleMin;
        calcMapDimensions();
    }

    if(mapInfo.map.height > mapInfo.map.maxHeight){
        mapInfo.scale -= increment;
        calcMapDimensions();
    }

    if(prevScale != mapInfo.scale){
        //scale map img & map containers
        htmlElements.map.style.setProperty('--mapScale', mapInfo.scale);
        checkBoundries();

        //moveMap 
        clearTimeout(mapInfo.timeoutID);
        htmlElements.map.classList.add('transition');
        htmlElements.map.removeEventListener('pointerdown', mouseDownHandler);
        mapInfo.timeoutID = mapInfo.timeout();
        
        //move map to be in bounds, moves it to the same spot if not changed
        htmlElements.map.style.transform = `translate(${mapInfo.translate.x+"px"}, ${mapInfo.translate.y+"px"})`;
    }
}

//eventListeners
//------------//------------
htmlElements.container.addEventListener('wheel', function(event){
    let scrollScale = mapInfo.scaleIncrement/5;
    if(event.deltaY > 0){
        zoom(scrollScale * -1);
    }
    else{
        zoom(scrollScale);
    }
});

htmlElements.settingsBar.querySelector('button:nth-last-child(2)').addEventListener('click', function(){
    zoom(mapInfo.scaleIncrement);
});

htmlElements.settingsBar.querySelector('button:nth-last-child(1)').addEventListener('click', function(){
    zoom(mapInfo.scaleIncrement * -1);
});


//------------//------------//------------
//  2.2 Map Drag & Move 
//------------//------------//------------

// functions
//------------//------------
const mouseDownHandler = function(e) {
    // change cursor when dragging map
    htmlElements.map.classList.add('grabbing');
    htmlElements.map.style.userSelect = 'none';

    //x and y of mouse on click
    mapInfo.prevMouse.x = e.clientX;
    mapInfo.prevMouse.y = e.clientY;

    // add move and up listeners
    document.addEventListener('pointermove', mouseMoveHandler);
    document.addEventListener('pointerup', mouseUpHandler);
}

const mouseMoveHandler = function(e){
    // How far the mouse has been moved
    const dx = e.clientX - mapInfo.prevMouse.x;
    const dy = e.clientY - mapInfo.prevMouse.y;

    mapInfo.translate.y += dy;
    mapInfo.translate.x += dx;
    
    checkBoundries();
    htmlElements.map.style.transform = `translate(${mapInfo.translate.x+"px"}, ${mapInfo.translate.y+"px"})`;

    //update prevMouse to currentMouse
    mapInfo.prevMouse.x = e.clientX;
    mapInfo.prevMouse.y = e.clientY;
}

const mouseUpHandler = function() {
    // cursor is no longer grabbing
    htmlElements.map.classList.remove('grabbing');
    htmlElements.map.style.removeProperty('user-select');

    // remove moving and mouse up listeners
    document.removeEventListener('pointermove', mouseMoveHandler);
    document.removeEventListener('pointerup', mouseUpHandler);
}

// eventListeners
//------------//------------
htmlElements.map.addEventListener('pointerdown', mouseDownHandler);


//------------//------------//------------
//  2.3 Side Panel
//------------//------------//------------

//sets panel color based on colors of element passed in and replaces the innerHtml with the info html object
//------------
//element: html element with properties --color700 and --color400
//info: html element being placed inside the side pannel
function populatePanel(element, info){
    htmlElements.sidePanel.classList.add('active');
    htmlElements.sidePanel.style.setProperty("--color700", element.style.getPropertyValue("--color700"));
    htmlElements.sidePanel.style.setProperty("--color400", element.style.getPropertyValue("--color400"));
    document.querySelector('html').style.setProperty("--color400", element.style.getPropertyValue("--color400"));
    document.querySelector('html').style.setProperty("--color700", element.style.getPropertyValue("--color400"));
    //populate sidepanel
    htmlElements.panelInfo.scrollTo(0,0);
    htmlElements.panelInfo.innerHTML = "";
    htmlElements.panelInfo.appendChild(info);
}

// eventListeners
//------------//------------
//close side panel with button 
htmlElements.sidePanelBtn.addEventListener('click', ()=> htmlElements.sidePanel.classList.toggle('active'));
htmlElements.bottomBtn.addEventListener('click', ()=> htmlElements.sidePanel.classList.remove('active'));

htmlElements.sidePanel.addEventListener('pointerdown', (e) => e.stopPropagation());
htmlElements.sidePanel.addEventListener('wheel', (e) => e.stopPropagation());


//------------//------------//------------
//  2.4 Resize Container
//------------//------------//------------

//intialize and adjust map variables when screen is resized 
window.addEventListener('resize', function(){
    initialMapDimensions();
    calcMapDimensions();
    checkBoundries();
});


//------------//------------//------------
//  2.5 Night Mode
//------------//------------//------------

htmlElements.settingsBar.querySelector('button:nth-last-child(3)').addEventListener('click', function(){;
    htmlElements.container.classList.toggle("darkMode");
});

// ======================================
//     3. Html Generators
// ======================================

//assemble map point and returns it
//------------
// info: 
function createPoint(info, types){
    let point = document.createElement('div');
    point.classList.add('point');
    point.style.top = info.coordinates.top;
    point.style.left = info.coordinates.left;

    let tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.textContent = info.name;
    point.appendChild(tooltip);
    point.setAttribute("data-tooltip", info.name);

    //does not error check, each point needs to have proper type
    let color700 = types[info.type].color700;
    let color400 = types[info.type].color400;
    
    point.style.setProperty("--color700", color700);
    point.style.setProperty("--color400", color400);
    point.style.setProperty("--pointScale", types[info.type].scale);
    point.classList.add(`point-${info.type}`);

    return point;
}

//assemble side panel inner content and returns it
//------------
// info:
function createPanel(info){
    let panel = document.createElement('div');
    panel.id = "pointPanel";

    //add special classes to panel html object
    if("features" in info){
        for(let key in info.features){
            panel.classList.add(`panel-${info.features[key]}`);
        }
    }
    
    let topCategory = document.createElement('div');
    topCategory.classList.add('category');
    
    let header = document.createElement('h2');
    header.textContent = info.name;
    topCategory.appendChild(header);

    if(info.motto !== ""){
        let motto = document.createElement('h4');
        motto.textContent = info.motto;
        topCategory.appendChild(motto);
    }

    let desc = document.createElement('p');
    desc.textContent = info.desc;
    topCategory.appendChild(desc);
    panel.appendChild(topCategory);

    //currently requires a category array
    for(let x = 0; x < info.categories.length; x++){
        let divider = document.createElement('div');
        divider.classList.add('divider');
        let left = document.createElement('div');
        let right = document.createElement('div');
        let middle = document.createElement('div');
        divider.append(left, right, middle);


        let category = document.createElement('div');
        category.classList.add('category');

        let categoryHeader = document.createElement('h3');
        categoryHeader.textContent = info.categories[x].title;
        category.appendChild(categoryHeader);

        let categoryBody = document.createElement('p');
        categoryBody.textContent = info.categories[x].info;
        category.appendChild(categoryBody);

        panel.appendChild(divider);
        panel.appendChild(category);
    }

    return panel;
}

function createLegend(info){
    let legend = document.createElement('div');
    legend.id = "legendPanel";
    let topCategory = document.createElement('div');
    topCategory.classList.add('category');

    let header = document.createElement('h2');
    header.textContent = "Legend";
    let note = document.createElement('h4');
    note.textContent = "click groups to toggle on/off";
    topCategory.appendChild(header);
    topCategory.appendChild(note);

    legend.appendChild(topCategory);
    
    for (let key in info) {
        if (info.hasOwnProperty(key) && key !== "") {
            let category = document.createElement('button');
            category.classList.add('category');

            let point = document.createElement('div');
            point.classList.add('point');

            let color700 = info[key].color700;
            let color400 = info[key].color400;
            
            point.style.setProperty("--color700", color700);
            point.style.setProperty("--color400", color400);

            let categoryHeader = document.createElement('h3');
            categoryHeader.textContent = key;

            category.appendChild(point);
            category.appendChild(categoryHeader);

            category.style.setProperty('--type', `point-${key}`);
            category.addEventListener('click', () => togglePoints(category,`.point-${key}`));
            legend.appendChild(category);
        }
    }

    return legend;
}

function togglePoints(button, type){
    let points = htmlElements.pointsContainer.querySelectorAll(type);
    button.classList.toggle('disabled');
    for(point of [...points]){
        point.classList.toggle('hidden');
    }
}

// ======================================
//     4. Helper Functions
// ======================================

//update mapInfo values, presumably after width, height, or scale has changed
function calcMapDimensions(){
    //calculate img dimensions for moving boundaries
    mapInfo.map.width = mapInfo.map.baseWidth * mapInfo.scale;
    mapInfo.map.height = mapInfo.map.baseHeight * mapInfo.scale;

    //determine if map is currently larger than it's container
    mapInfo.larger.width = mapInfo.container.width < mapInfo.map.width;
    mapInfo.larger.height = mapInfo.container.height < mapInfo.map.height;
    
    //set edges
    mapInfo.edges.top = (mapInfo.container.height - mapInfo.map.height)/2 * -1;
    mapInfo.edges.bottom = (mapInfo.container.height - mapInfo.map.height)/2;
    mapInfo.edges.left = (mapInfo.container.width - mapInfo.map.width)/2 * -1;
    mapInfo.edges.right = (mapInfo.container.width - mapInfo.map.width)/2;
}

function initialMapDimensions(){
    //set map container height and width
    let mapContainer = window.getComputedStyle(htmlElements.container);
    mapInfo.container.height = parseInt(mapContainer.getPropertyValue('height'));
    mapInfo.container.width = parseInt(mapContainer.getPropertyValue('width'));
    
    //set map height and width
    let compStyles = window.getComputedStyle(htmlElements.map);
    mapInfo.map.baseHeight = parseInt(compStyles.getPropertyValue('height'));
    mapInfo.map.baseWidth = parseInt(compStyles.getPropertyValue('width'));

    //center map + set origin to center
    htmlElements.map.style.left = `${mapInfo.container.width/2 - mapInfo.map.baseWidth/2}px`;
    htmlElements.map.style.top = `${mapInfo.container.height/2 - mapInfo.map.baseHeight/2}px`;
}

function checkBoundries(){
    let inBoundries = true;

    if(mapInfo.larger.height){
        if(mapInfo.translate.y > mapInfo.edges.top){
            mapInfo.translate.y = mapInfo.edges.top;
            inBoundries = false;
        } 
        if(mapInfo.translate.y  < mapInfo.edges.bottom){
            mapInfo.translate.y = mapInfo.edges.bottom;
            inBoundries = false; 
        }
    }
    else{
        if(mapInfo.translate.y < mapInfo.edges.top){
            mapInfo.translate.y = mapInfo.edges.top;
            inBoundries = false;
        } 
        if(mapInfo.translate.y > mapInfo.edges.bottom){
            mapInfo.translate.y = mapInfo.edges.bottom; 
            inBoundries = false;
        } 
    }

    if(mapInfo.larger.width){
        if(mapInfo.translate.x > mapInfo.edges.left){
            mapInfo.translate.x = mapInfo.edges.left;
            inBoundries = false;
        }
        if(mapInfo.translate.x < mapInfo.edges.right){
            mapInfo.translate.x = mapInfo.edges.right;
            inBoundries = false;
        }
    }
    else{
        if(mapInfo.translate.x < mapInfo.edges.left){
            mapInfo.translate.x = mapInfo.edges.left;
            inBoundries = false;
        }
        if(mapInfo.translate.x > mapInfo.edges.right){
            mapInfo.translate.x = mapInfo.edges.right;
            inBoundries = false;
        }
    }

    return inBoundries;
}