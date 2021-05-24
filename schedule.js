// var utcTimes = [
//     [[180,"The Clash(Fighting Games)"]],
//     [[1140, "Scrolls of Not'Chek"]],
//     [[60, "Lost At Sea"]],
//     [[0, "Pride Of The Nightwolf"]], 
//     [], 
//     [],
//     [[60, "Callous Row"], [1140, "Into The Mists"], [1380, "Shrine Of Sin"]]];
    

var utcTimes = [
[],
[[1140, "Scrolls of Not'Chek"]],
[[60, "Lost At Sea"]],
[[0, "Pride Of The Nightwolf"]], 
[], 
[],
[[60, "Callous Row"], [1140, "Into The Mists"], [1380, "Shrine Of Sin"]]];

var convertedTimes = [
[],
[],
[],
[],
[],
[],
[]];

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
var intervalId = window.setInterval(function(){ nextShow();} , 1000);
console.log(convertedTimes);

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



function nextShow(){
    var time = new Date();
    var found = false;
    var mintuesTill = 0;
    var countdown = document.getElementById('cdDisplay');
    var nextName = document.getElementById('showName');
    var showName;

    var day = time.getDay();
    var minutes = time.getMinutes() + time.getHours() * 60;

    for(var x = 0; x < convertedTimes[day].length; x++){
        if(minutes < convertedTimes[day][x][0]){
            showName = convertedTimes[day][x][1];
            nextName.innerHTML = "Next Show: "+showName;
            found = true;
            mintuesTill = convertedTimes[day][x][0] - minutes;
            break;
        }
    }

    if(found == false){
        mintuesTill = 1440 - minutes;

        for(var x = 1; x < 7; x++){
            var nextDay = day + x;
            if(nextDay > 6){
                nextDay = nextDay - 7;
            }

            for(var y = 0; y < convertedTimes[nextDay].length; y++){
                showName = convertedTimes[nextDay][y][1];
                nextName.innerHTML = "Next Show: "+showName;
                found = true;
                mintuesTill = mintuesTill + convertedTimes[nextDay][y][0];
                break;
            }

            if(found){
                break;
            }
            else{
                mintuesTill = mintuesTill + 1440;
            }
        }
    }
    

    
    countdown.innerHTML = convertToCount(mintuesTill);
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
    }
    var time = hours+":"+min+":"+sec;
    return time;
}