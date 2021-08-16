//------------//------------//------------//------------//------------
//      TABLE OF CONTENTS
//------------//------------//------------//------------//------------
//      1. Initialization
//          1.1 Global Data Structures
//          1.2 Intialize Components
//      2. Features
//          2.1 Time Conversion
//          2.2 Type Conversion
//          2.3 Next Show
//          2.4 Dynamic Styling
//      3. Html Generators
//      4. Helper Functions
//------------//------------//------------//------------//------------


//------------//------------//------------//------------
//      1. Initialization
//------------//------------//------------//------------


//------------//------------//------------ 
//  1.1 Global Data Structures 
//------------//------------//------------
// var utcTimes = [
//     [[1380, "Update Stream!!"]],
//     [[1020, "Ink And Blood"],[1320, "The Final Toll"]],
//     [[1260, "A Storm Approaches"]],
//     [[1440, "Servants Of The Spire"]], 
//     [[1080, "The Divine Wind"]], 
//     [[1260, "Otikata's Curse"]],
//     []];  

// Global Data Structures
//================================
var utcTimes = [
    [[1380, "Update Stream!!"]],
    [[1020, "Ink And Blood"],[1320, "The Final Toll"]],
    [[1260, "A Storm Approaches"]],
    [[1440, "Servants Of The Spire"]], 
    [[1080, "The Divine Wind"]], 
    [[1260, "Otikata's Curse"]],
    []];   

var convertedTimes = [
[],
[],
[],
[],
[],
[],
[]];

var showColors = {
    scrollsOfNotChek: "#cc6133",
    lostAtSea: "#28383e",
    prideOfTheNightwolf: "#673234",
    shrineOfSin: "#1a1a1a",
    callousRow: "#000",
    inkAndBlood: "#670000",
    amongTheReeds: "#38762c",
    otikatasCurse: "#28273f",
    aStormApproaches: "#46375b",
    theFinalToll: "#3c595c",
    theDivineWind: "#cc6133",
    servantsOfTheSpire: "#1a1a1a"
};

//------------//------------//------------
//  1.2 Intialize Components
//------------//------------//------------


//Convert utcTimes to local times 
//for loop for each day
for(let x = 0; x < utcTimes.length; x++){
    let utcDay = utcTimes[x];

    //for loop for each show of day x
    for(let y = 0; y < utcDay.length; y++){
        let utcShow = utcDay[y];

        //show name
        let showName = utcShow[1];

        //local show time and day difference
        let timeArray = localConvert(utcShow[0]);
        let showTime = timeArray[0];
        let showDay = timeArray[1] + x;

        //accounts for timezones day before or after utc
        if(showDay > 6){
            showDay = 0;
        }
        else if(showDay < 0){
            showDay = 6;
        }
        
        //go through the shows already placed on this day and determines if
        //the show being added is before or after
        let inserted = false;
        for(let z = 0; z < convertedTimes[showDay].length; z++){
            let arrayElementShowTime = convertedTimes[showDay][z][0];
            
            // Checks if currentShow being inserted is before existing show time
            if(showTime < arrayElementShowTime){
                convertedTimes[showDay].splice(z, 0, [showTime, showName]);
                inserted = true;
                break;   
            }
        }

        //check if show is last show of the day
        if(inserted === false){
            convertedTimes[showDay].push([showTime, showName]);
        }
    }
}

//create show schedule with local times
createSchedule();

//start countdown till next show
let countdownData = nextShow();
window.setInterval(
    function(){
        if(displayShow(countdownData) == "00s"){
            countdownData = nextShow();
        }
    } , 1000);

window.addEventListener('focus', () => countdownData = nextShow());

//------------//------------//------------//------------
//      2. Features
//------------//------------//------------//------------

//------------//------------//------------
//  2.1 Time Conversion
//------------//------------//------------

// Functions
//================================

//Info: Converts shows into local timezone(in minutes)
//------------
//Parameters:
//  +index = represents day of show 
//  +utcTime = utc time in minutes being converted
//Return:
//  +an array with:
//      +index 0: local time in minutes;
//      +index 1: day offset of converted time;
function localConvert(utcTime){
    var date = new Date();
    var offset = date.getTimezoneOffset();
    offset = offset * -1;

    var localTime = utcTime + offset;

    var dayOffset = 0;
    
    if(localTime < 0){
        localTime = 60*24 + localTime;
        dayOffset = -1;
    }
    else if(localTime > 1440){
        localTime = localTime - 1440;
        dayOffset = 1;
    }

    var convertedTime = [localTime, dayOffset];
    return convertedTime;
}

//------------//------------//------------
//  2.2 Type Conversion
//------------//------------//------------

//Info: Converts minutes into am/pm format
//------------
//Parameters:
//  +minutes = int representing minutes
//Return:
//  +converts minutes to am/pm
function convertToTime(minutes){
    var hours = Math.floor(minutes/60);
    var min = minutes - hours*60;

    if(min<10){
        min = "0"+min;
    }

    var ampm = 'am';
    if(hours>12){
        hours = hours - 12;
        ampm = 'pm';
    }
    else if(hours == 12){
        ampm = 'pm';
    }

    if(hours == 0){
        hours = 12;
    }

    var time;
    if(min == "00"){
        time = hours+ampm;
    }
    else{
        time = hours+":"+min+ampm;
    }
    return time;
}

//Info: Converts int of day into string
//------------//------------
//Parameters:
//  +index = int representing day
//------------
//Return:
//  +day in string format
function convertToDay(index){
    var day;

    if(index == 0){
        day = "Sun";
    }
    else if(index == 1){
        day = "Mon";
    }
    else if(index == 2){
        day = "Tues";
    }
    else if(index == 3){
        day = "Wed";
    }
    else if(index == 4){
        day = "Thurs";
    }
    else if(index == 5){
        day = "Fri";
    }
    else if(index == 6){
        day = "Sat";
    }
    else{
        day = "HOW";
    }

    return day; 
}

//Info: Converts minutes into countdown display
//------------//------------
//Parameters:
//  +minutes = int representing minutes
//------------
//Return:
//  +display as a string value
function convertToCount(minutes){
    let curSec = new Date().getSeconds();
    let hours = Math.floor(minutes/60);
    let min = minutes - hours*60;
    min = min - 1;

    if(min == -1){
        hours = hours -1;
        min = 59;
    }
    
    let sec = 59 - curSec;

    //format hours, min, and sec values
    if(min<10){
        if(hours != "0"){
            min = "0"+min;
        }
    }

    if(sec<10){
        sec = "0"+sec;
    }

    //create display string
    let display;
    if(hours < 1){
        if(min == "00"){
            display = sec+"s";
        }
        else{
            display = min+":"+sec;
        }
    }
    else{
        display = hours+":"+min+":"+sec;
    }
    return display;
}

//------------//------------//------------
//  2.3 Next Show
//------------//------------//------------

//Info: determines the next show on the schedule
//------------
//Return:
//  +an array with:
//      +index 0: int value of the day of the show;
//      +index 1: index of show that day;
function nextShow(){
    let found = false;
    let nextName = document.getElementById('showName');
    let showName;
    let showInfo = [0,0];

    let time = new Date();
    let day = time.getDay();
    let minutes = time.getMinutes() + time.getHours() * 60;

    let loopNum = 0;
    let showDay = 0;
    let showInstance = 0;
    while(found !== true){
        let curDay = day + loopNum;
        
        //accounts for being greater than sun === 6
        if(curDay > 6) curDay = curDay - 7;
        
        //have to check all shows of current day
        if(loopNum === 0){
            for(let x = 0; x < convertedTimes[curDay].length; x++){
                //+1 ensures that next show runs at 0
                if(minutes + 1 < convertedTimes[curDay][x][0]){
                    showDay = curDay;
                    showInstance = x;

                    found = true;
                    break;
                }
            }
        }
        else{
            //if next show is on another day it will be the first show of that day
            if(convertedTimes[curDay].length > 0){
                showDay = curDay;
                showInstance = 0;

                found = true;
                break;
            }
        }

        loopNum++;
        if(loopNum >= 7) break;
    }

    //found no shows, only happens when there is only one show and it already occured today
    if(found === false){
        showDay = day;
        showInstance = 0;
    }
    
    //adjust html values and styling
    //this should probably not be in this function
    showInfo[0] = showDay;
    showInfo[1] = showInstance;
    showName = convertedTimes[showDay][showInstance][1];
    nextName.innerHTML = showName;


    let showNameFormatted = showName.replace(/\s/g, '');
    showNameFormatted = showNameFormatted.replace('\'', '');
    showNameFormatted = showNameFormatted[0].toLowerCase() + showNameFormatted.substring(1);
    changeBackground(showNameFormatted);
    changeNavColor(showNameFormatted);
    
    return showInfo;
}

//Info: Determines the number of minutes till next show
//------------//------------
//Parameters:
//  +an array with:
//      +index 0: int value of the day of the show;
//      +index 1: index of show that day;
//------------
//Return:
//  +display value that countdown has been set to
function displayShow(showInfo){
    let minutes = mintuesTill(showInfo);
    let countdown = document.getElementById('cdDisplay');
    let countdownMinutes = convertToCount(minutes);
    countdown.innerHTML = countdownMinutes;
    return countdownMinutes;
}

//Info: Determines the number of minutes till next show
//------------//------------
//Parameters:
//  +an array with:
//      +index 0: int value of the day of the show;
//      +index 1: index of show that day;
//------------
//Return:
//  +minutes till show on schedule as an int
function mintuesTill(showInfo){
    let mintuesTill = 0;
    let showDay = showInfo[0];
    let showInstance = showInfo[1];

    var time = new Date();
    var day = time.getDay();

    //minutes in this day
    var minutes = time.getMinutes() + time.getHours() * 60;

    if(day === showInfo[0]){
        //check if next show has already happened today
        //edge case for only have one show in the schedule
        if(minutes > convertedTimes[day][showInstance][0]){
            //minutes remaining in day
            mintuesTill = 1440 - minutes;

            for(let x = 0; x < 6; x++){
                mintuesTill = mintuesTill + 1440;
            }

            //minutes of day show airs
            mintuesTill = mintuesTill + convertedTimes[showDay][showInstance][0];
        }
        else{
            console.log(`minutes: ${minutes}, showInMins: ${convertedTimes[day][showInstance][0]}`);
            mintuesTill = convertedTimes[day][showInstance][0] - minutes;
        }
    }
    else{
        //minutes remaining in day
        mintuesTill = 1440 - minutes;

        //days between now and next show
        let daysBetween = 0;
        if(day>showDay){
            daysBetween = (7 - day) + showDay - 1; 
        }
        else{
            daysBetween = showDay - day - 1;
        }
        
        for(let x = 0; x < daysBetween; x++){
            mintuesTill = mintuesTill + 1440;
        }

        //minutes of day show airs
        mintuesTill = mintuesTill + convertedTimes[showDay][showInstance][0];
    }

    return mintuesTill;
}


//------------//------------//------------
//  2.4 Dynamic Styling
//------------//------------//------------

//Info: Changes background image of the body element
//------------
//Parameters:
//  +showName = name of show for the background
function changeBackground(showName){
    let body = document.querySelector('body');
    let newBackground = "url(../../assets/imgs/backgrounds/bg-"+showName+".png)"; 
    body.style.backgroundImage = newBackground;
}

//Info: Changes navbar styling values
//------------
//Parameters:
//  +showName = name of show for the background
function changeNavColor(showName){
    var root = document.querySelector(":root");
    
    //Check if showColors has a color or not. 
    //Default to black if there it is undefined. 
    if(typeof showColors[showName] !== 'undefined'){
        root.style.setProperty('--color700', showColors[showName]);
    }
    else{
        root.style.setProperty('--color700', '#0b0211');
    }
    
    if(showName === "callousRow"){
        root.style.setProperty('--textColor', "#e416fb");
    }
    else{
        root.style.setProperty('--textColor', "#fff");
    }
}

// ======================================
//     3. Html Generators
// ======================================

//Info: Dynamically creates html for the show schedule
function createSchedule(){
    var container = document.getElementById("schedule");
    var header = document.createElement('h1');
    header.innerHTML = 'Schedule';
    container.appendChild(header);

    for(var x = 0; x < convertedTimes.length; x++){
        if(convertedTimes[x].length>=1){
            var dayHTML = createDay(x, convertedTimes[x]);
            container.appendChild(dayHTML);
        }
    }
}

//Info: Creates html element of individual day
//------------//------------
//Parameters:
//  +day = int representing day created
//  +games = array of games for that day
//------------
//Return:
//  +html element of day created
function createDay(day, games){
    var row = document.createElement('div');
    row.classList.add("row");
    var label = document.createElement('div');
    label.classList.add("label");
    label.innerHTML = convertToDay(day);
    var data = document.createElement('div');
    data.classList.add("data");
    row.appendChild(label);
    row.appendChild(data);

    
    for(var x = 0; x < games.length; x++){
        var game = document.createElement('div');
        game.classList.add('gameInfo');
        let gameName = document.createElement('div');
        gameName.innerHTML = games[x][1];
        let gameTime = document.createElement('div');
        gameTime.innerHTML = convertToTime(games[x][0]);
        game.appendChild(gameName);
        game.appendChild(gameTime);
        data.appendChild(game);
    }

    return row;
}