//------------//------------//------------//------------//------------
//      TABLE OF CONTENTS
//------------//------------//------------//------------//------------
//      1. Initialization
//          1.1 Global Data Structures
//          1.2 Intialize Components
//      2. Features
//          2.1 Next Show
//          2.2 Dynamic Styling
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

let utcTimes = [
    [[1380, "Update Stream!!"]],
    [[1020, "Ink And Blood"],[1320, "The Final Toll"]],
    [[1260, "A Storm Approaches"]],
    [[1440, "Servants Of The Spire"]], 
    [[1080, "The Divine Wind"]], 
    [[1260, "Otikata's Curse"]],
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

import * as schedule from './schedule.js';
import * as countdown from './countdown.js';

let convertedWeek = schedule.convertWeek(utcTimes);
let scheduleHTML = schedule.createSchedule(convertedWeek);

document.querySelector('.section:nth-of-type(3)').appendChild(scheduleHTML);
setNextShow();


function setNextShow(){
    let next = nextShow(convertedWeek);
    let showDay = next[0];
    let showTime = convertedWeek[showDay][next[1]][0];
    let showName = convertedWeek[showDay][next[1]][1];
    let daysTill = daysTillShow(showDay);

    let showNameFormatted = showName.replace(/\s/g, '');
    showNameFormatted = showNameFormatted.replace('\'', '');
    showNameFormatted = showNameFormatted[0].toLowerCase() + showNameFormatted.substring(1);
    changeBackground(showNameFormatted);
    changeNavColor(showNameFormatted);

    let countdownHTML = countdown.create(showTime, showName, daysTill);
    document.querySelector('.section:nth-of-type(2)').appendChild(countdownHTML);

    let intervalID = window.setInterval(() => {
        console.log(countdown.data.finished);
        if(countdown.data.finished){
            document.querySelector('#countdown').remove();
            countdown.data.finished = false;
            clearInterval(intervalID);
            setNextShow();
        } 
    },1000);
}


//------------//------------//------------
//  2.1 Next Show
//------------//------------//------------

//Info: determines the next show on the schedule
//------------
//Return:
//  +an array with:
//      +index 0: int value of the day of the show;
//      +index 1: index of show that day;
function nextShow(schedule){
    let time = new Date();
    let day = time.getDay();
    let minutes = time.getMinutes() + time.getHours() * 60;

    let loopNum = 0;
    let showDay = 0;
    let showInstance = 0;
    let found = false;

    while(found !== true){
        let curDay = day + loopNum;
        
        //accounts for being greater than sun === 6
        if(curDay > 6) curDay = curDay - 7;
        
        //have to check all shows of current day
        if(loopNum === 0){
            for(let x = 0; x < schedule[curDay].length; x++){
                //+1 ensures that next show runs at 0
                if(minutes + 1 < schedule[curDay][x][0]){
                    showDay = curDay;
                    showInstance = x;

                    found = true;
                    break;
                }
            }
        }
        else{
            //if next show is on another day it will be the first show of that day
            if(schedule[curDay].length > 0){
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

    return [showDay, showInstance];
}

//Info: determines days till weekly event
//------------
//Parameters:
//  +eventDay: day of the event
//------------
//Return:
//  +an int that is the days till the event
function daysTillShow(eventDay){
    let date = new Date();
    let curDay = date.getDay();

    // days between now and next show
    let daysBetween = 0;
    if(curDay > eventDay){
        daysBetween = (7 - curDay) + eventDay; 
    }
    else{
        daysBetween = eventDay - curDay;
    }

    return daysBetween;
}


//------------//------------//------------
//  2.2 Dynamic Styling
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
