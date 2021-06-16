// var utcTimes = [
//     [[180,"The Clash(Fighting Games)"]],
//     [[1140, "Scrolls Of Not'Chek"]],
//     [[60, "Lost At Sea"]],
//     [[0, "Pride Of The Nightwolf"]], 
//     [], 
//     [],
//     [[60, "Callous Row"], [1140, "Into The Mists"], [1380, "Shrine Of Sin"]]]; 
var utcTimes = [
    [],
    [[1020, "Ink And Blood"], [1320, "The Final Toll"]],
    [[1260, "A Storm Approaches"]],
    [[1380, "Among The Reeds"]], 
    [], 
    [[1260, "Otikata's Curse"]],
    [[60, "Callous Row"]]]; 


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
    inkAndBlood: "#650000",
    amongTheReeds: "#38762c"
};

for(var x = 0; x < utcTimes.length; x++){
    if(utcTimes[x].length >= 1){
        for(var y = 0; y < utcTimes[x].length; y++){
            var timeArray = localConvert(utcTimes[x][y][0]);
            var time = timeArray[0];
            var name = utcTimes[x][y][1];
            var day = timeArray[1] + x;

            if(day > 6){
                day = 0;
            }
            else if(day < 0){
                day = 6;
            }
            
            var inserted = false;
            for(var z = 0; z < convertedTimes[day].length; z++){
                var curTime = convertedTimes[day][z][0];

                if(time<curTime){
                    convertedTimes[day].splice(z, 0, [time, name]);
                    var inserted = true;
                    break;   
                }
            }

            if(inserted == false){
                convertedTimes[day].push([time, name]);
            }
        }
    }
}

createSchedule();
nextShowInit();
setupNavbar();

// var intervalId = window.setInterval(function(){ nextShow();} , 1000);

//Info: Converts shows into local timezone(in minutes)
//Parameters:
//  +index = represents day of show 
//  +utcTime = utc time in minutes being converted
//Return:
//  +an array with:
//      +index 0: local time in minutes;
//      +index 1: day of converted time;
function localConvert(utcTime){
    var date = new Date();
    var offset = date.getTimezoneOffset();
    offset = offset * -1;

    var localTime = utcTime + offset;

    var day = 0;
    
    if(localTime < 0){
        localTime = 60*24 + localTime;
        day = -1;
    }
    else if(localTime > 1440){
        localTime = localTime - 1440;
        day = 1;
    }

    var convertedTime = [localTime, day];
    return convertedTime;
}

//Info: Dynamically creates html for the show schedule
function createSchedule(){
    var container = document.getElementById("schedule");
    var header = document.createElement('h1');
    header.innerHTML = 'SCHEDULE';
    container.appendChild(header);

    for(var x = 0; x < convertedTimes.length; x++){
        if(convertedTimes[x].length>=1){
            var dayHTML = createDay(x, convertedTimes[x]);
            container.appendChild(dayHTML);
        }
    }
}

//Info: Creates html element of individual day
//Parameters:
//  +day = int representing day created
//  +games = array of games for that day
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

//Info: Converts minutes into am/pm format
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
//Parameters:
//  +index = int representing day
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

function nextShowInit(){
    let showInfo = nextShow();

    window.setInterval(
        function(){
            if(displayShow(showInfo) == "00:00:00"){
                showInfo = nextShow();
            }
        } , 1000);
}

function nextShow(){
    var found = false;
    var nextName = document.getElementById('showName');
    var showName;
    var showInfo = [0,0];

    var time = new Date();
    var day = time.getDay();
    var minutes = time.getMinutes() + time.getHours() * 60;

    //need to determine incase shows have already passed on this day
    for(var x = 0; x < convertedTimes[day].length; x++){
        //+1 ensures that next show runs at 0
        if(minutes+1 < convertedTimes[day][x][0]){
            showName = convertedTimes[day][x][1];
            nextName.innerHTML = "Next Show: "+showName;
            
            let showNameFormatted = showName.replace(/\s/g, '');
            showNameFormatted = showNameFormatted.replace('\'', '');
            showNameFormatted = showNameFormatted[0].toLowerCase() + showNameFormatted.substring(1);
            
            changeBackground(showNameFormatted);
            changeNavColor(showNameFormatted);

            found = true;
            showInfo[0] = day;
            showInfo[1] = x;
            break;
        }
    }

    //next show is on a different day
    if(found == false){
        // mintuesTill = 1440 - minutes;

        for(var x = 1; x < 7; x++){
            //check next day
            let curDay = day + x;
            
            if(curDay > 6){
                curDay = curDay - 7;
            }
            
            if(convertedTimes[curDay].length > 0){
                showName = convertedTimes[curDay][0][1];
                nextName.innerHTML = "Next Show: "+showName;

                let showNameFormatted = showName.replace(/\s/g, '');
                showNameFormatted = showNameFormatted.replace('\'', '');
                showNameFormatted = showNameFormatted[0].toLowerCase() + showNameFormatted.substring(1);
                changeBackground(showNameFormatted);
                changeNavColor(showNameFormatted);

                found = true;

                showInfo[0] = curDay;
                showInfo[1] = 0;
            }

            if(found){
                break;
            }
        }
    }

    if(found === false){
        showName = convertedTimes[day][0][1];
        nextName.innerHTML = "Next Show: "+showName;

        let showNameFormatted = showName.replace(/\s/g, '');
        showNameFormatted = showNameFormatted.replace('\'', '');
        showNameFormatted = showNameFormatted[0].toLowerCase() + showNameFormatted.substring(1);
        changeBackground(showNameFormatted);

        found = true;
        showInfo[0] = day;
        showInfo[1] = 0;
    }
    
    return showInfo;
}

function displayShow(showInfo){
    let minutes = mintuesTill(showInfo);
    var countdown = document.getElementById('cdDisplay');
    let countdownMinutes = convertToCount(minutes);
    countdown.innerHTML = countdownMinutes;
    return countdownMinutes;
}

function mintuesTill(showInfo){
    let mintuesTill = 0;
    let showDay = showInfo[0];
    let showInstance = showInfo[1];

    var time = new Date();
    var day = time.getDay();

    //minutes in this day
    var minutes = time.getMinutes() + time.getHours() * 60;

    if(day == showInfo[0]){
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

function convertToCount(minutes){
    var time = new Date();
    var hours = Math.floor(minutes/60);
    var min = minutes - hours*60;

    if(hours < 10){
        hours = "0"+hours;
    }

    min = min - 1;
    if(min == -1){
        hours = hours -1;
        min = 59;
    }
    var sec = 59 - time.getSeconds();

    if(min<10){
        min = "0"+min;
    }

    if(sec<10){
        sec = "0"+sec;
        if(sec === "00"){
            minutes--;
        }
    }
    var time = hours+":"+min+":"+sec;
    return time;
}

//Changes background image of the body element
//======================================
//Parameters
//+showName = name of show for the background
function changeBackground(showName){
    var body = document.querySelector('body');
    var newBackground = "url(./assets/imgs/backgrounds/bg-"+showName+".png)"; 
    body.style.backgroundImage = newBackground;
}

//
//======================================
//Parameters
//+color = 
function changeNavColor(name){
    var root = document.querySelector(":root");
    
    //Check if showColors has a color or not. 
    //Default to black if there it is undefined. 
    if(typeof showColors[name] !== 'undefined'){
        root.style.setProperty('--color700', showColors[name]);
    }
    else{
        root.style.setProperty('--color700', '#000');
    }
    
    if(name === "callousRow"){
        root.style.setProperty('--textColor', "#e416fb");
    }
    else{
        root.style.setProperty('--textColor', "#fff");
    }
}



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