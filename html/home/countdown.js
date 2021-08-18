//------------//------------//------------//------------//------------
//      TABLE OF CONTENTS
//------------//------------//------------//------------//------------
//      
//------------//------------//------------//------------//------------

export let data = {finished: false, eventTime: 0, title: "", daysTill: 0, display: '', container: ""};

//Info: Creates a html countdown that updates every second
//------------//------------
//Parameters:
//      +eventTime: int value of event start time in minutes;
//      +title: name of the event;
//      +dayTill: days till the event;
//------------
//Return:
//  +html coundown object
export function create(eventTime, title = "", daysTill = 0){
    //set initiail values
    data.eventTime = eventTime;
    data.title = title;
    data.daysTill = daysTill;

    //generate html
    let container = document.createElement('div');
    container.id = "countdown";

    if(title != ""){
        let name = document.createElement('div');
        name.id = "showName";
        name.innerText = data.title;
        container.appendChild(name);
    }

    let number = document.createElement('div');
    number.id = "cdDisplay";
    container.appendChild(number);
    
    data.container = container;
    data.display = number;

    //Set interval to update countdown every second.
    let intervalID = window.setInterval(() => {
        let minutes = minutesTill(data.eventTime, data.daysTill);
        let display = convertToString(minutes);
        data.display.innerText = display;

        //Clears interval and sets finished to true when countdown hits 0
        if(display === "0s"){
            clearInterval(intervalID);
            data.finished = true;
        }
    },1000);

    return container;
}

//Info: Determines the number of minutes till next show
//------------//------------
//Parameters:
//      +eventTime: int value of event start time in minutes;
//      +dayTill: days till the event;
//------------
//Return:
//  +minutes till event as an int
export function minutesTill(eventTime, daysTill){
    let minutes = 0;
    let date = new Date();
    let curTime = date.getMinutes() + date.getHours() * 60;

    if(daysTill === 0){
        //event hasn't happened yet
        if(eventTime > curTime){
            minutes = eventTime - curTime; 
        }
        else{
            minutes = 0;
        }
    }
    else{
        //minutes remaining in day
        minutes = 1440 - curTime;

        //add minutes of days between
        for(let x = 0; x < daysTill - 1; x++){
            minutes += 1440;
        }

        //minutes of day show airs
        minutes += eventTime;
    }

    return minutes;
}

//Info: Converts minutes into string value
//------------//------------
//Format: hours:mins:secs
//  +if(hours === 0) minutes:seconds
//  +if(hours === 0 && minutes === 00) seconds+"s" 
//------------//------------
//Parameters:
//  +minutes = int representing minutes
//------------
//Return:
//  +display as a string value
export function convertToString(minutes){
    let curSec = new Date().getSeconds();
    let hours = Math.floor(minutes/60);
    let min = minutes - hours*60;
    min = min - 1;
    let sec = 59 - curSec;
    

    if(min == -1){
        if(hours !== 0){
            hours = hours -1;
            min = 59;
            sec = 59 - curSec;
        }
        else{
            min = 0;
            sec = 0;
        }
    }

    //create display string
    let display;
    if(hours === 0){
        if(min === 0){
            display = sec+"s";
        }
        else{
            if(sec<10) sec = "0"+sec;

            display = min+":"+sec;
        }
    }
    else{
        if(min<10) min = "0"+min;
        if(sec<10) sec = "0"+sec;
        
        display = hours+":"+min+":"+sec;
    }
    return display;
}
