//------------//------------//------------//------------//------------
//      TABLE OF CONTENTS
//------------//------------//------------//------------//------------
//      1. Features
//          1.1 Time Conversion
//          1.2 Type Conversion
//          1.3 Html Generators
//------------//------------//------------//------------//------------

//------------//------------//------------//------------
//      1. Features
//------------//------------//------------//------------

//------------//------------//------------
//  1.1 Time Conversion
//------------//------------//------------

//Info: Converts a week of shows into local timezone(in minutes)
//------------
//Parameters:
//  +showArray: an array of arrays.
//      +length of 7(one index for each day of week)
//      +each show is a 2 index array:
//          +index 0: show time in utc
//          +index 1: show name
//Return:
//  +an array of arrays:
//      +length of 7(one index for each day of week)
//      +each show is a 2 index array:
//          +index 0: show time in utc
//          +index 1: show name
export function convertWeek(showArray) {
    let convertedArray = [[], [], [], [], [], [], []];

    //loop through each day of week
    for (let x = 0; x < 7; x++) {
        let day = showArray[x];

        //loop through each show of day
        for (let y = 0; y < day.length; y++) {
            let showName = day[y][1];
            let convertData = convertDay(day[y][0], x);

            let showTime = convertData[0];
            let showDay = convertData[1];

            //insert into array
            let showInstance = 0;
            for (let z = 0; z < convertedArray[showDay].length; z++) {
                let comparedDay = convertedArray[showDay][z];

                if (comparedDay[0] < showTime) {
                    showInstance = z + 1;
                }
            }

            convertedArray[showDay].splice(showInstance, 0, [
                showTime,
                showName,
            ]);
        }
    }

    return convertedArray;
}

//Info: Converts shows into local timezone(in minutes)
//------------
//Parameters:
//  +index = represents day of show
//  +utcTime = utc time in minutes being converted
//Return:
//  +an array with:
//      +index 0: local time in minutes;
//      +index 1: local day as an int 0 === sunday;
export function convertDay(utcTime, utcDay) {
    let date = new Date();
    let offset = date.getTimezoneOffset();
    offset = offset * -1;

    let localTime = utcTime + offset;

    let dayOffset = 0;

    if (localTime < 0) {
        localTime = 60 * 24 + localTime;
        dayOffset = -1;
    } else if (localTime > 1440) {
        localTime = localTime - 1440;
        dayOffset = 1;
    }

    let day = utcDay + dayOffset;

    if (day > 6) day = 0;
    if (day < 0) day = 6;

    let convertedTime = [localTime, day];
    return convertedTime;
}

//------------//------------//------------
//  1.2 Type Conversion
//------------//------------//------------

//Info: Converts minutes into am/pm format
//------------
//Parameters:
//  +minutes = int representing minutes
//Return:
//  +converts minutes to am/pm
export function convertToTime(minutes) {
    var hours = Math.floor(minutes / 60);
    var min = minutes - hours * 60;

    if (min < 10) {
        min = "0" + min;
    }

    var ampm = "am";
    if (hours > 12) {
        hours = hours - 12;
        ampm = "pm";
    } else if (hours == 12) {
        ampm = "pm";
    }

    if (hours == 0) {
        hours = 12;
    }

    var time;
    if (min == "00") {
        time = hours + ampm;
    } else {
        time = hours + ":" + min + ampm;
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
export function convertToDay(index) {
    var day;

    if (index == 0) {
        day = "Sun";
    } else if (index == 1) {
        day = "Mon";
    } else if (index == 2) {
        day = "Tues";
    } else if (index == 3) {
        day = "Wed";
    } else if (index == 4) {
        day = "Thurs";
    } else if (index == 5) {
        day = "Fri";
    } else if (index == 6) {
        day = "Sat";
    } else {
        day = "HOW";
    }

    return day;
}

//------------//------------//------------
//  1.3 Html Generators
//------------//------------//------------

//Info: Dynamically creates html for the show schedule
//------------
//Parameters:
//  +showArray: an array of arrays.
//      +length of 7(one index for each day of week)
//      +each show is a 2 index array:
//          +index 0: show time in utc
//          +index 1: show name
export function createSchedule(showArray) {
    let container = document.createElement("div");
    container.id = "schedule";

    let header = document.createElement("h1");
    header.innerHTML = "Schedule";
    container.appendChild(header);

    for (let day = 0; day < 7; day++) {
        if (showArray[day].length >= 1) {
            let daySchedule = createDaySchedule(day, showArray[day]);
            container.appendChild(daySchedule);
        }
    }

    return container;
}

//Info: Creates html element of individual day
//------------//------------
//Parameters:
//  +day = int representing day being created
//  +daySchedule = array of shows for that day
//      +each show is a 2 index array:
//          +index 0: show time in utc
//          +index 1: show name
//------------
//Return:
//  +html element of day created
export function createDaySchedule(day, daySchedule) {
    let dayElement = document.createElement("div");
    dayElement.classList.add("row");
    let label = document.createElement("div");
    label.classList.add("label");
    label.innerHTML = convertToDay(day);
    let data = document.createElement("div");
    data.classList.add("data");
    dayElement.appendChild(label);
    dayElement.appendChild(data);

    for (let x = 0; x < daySchedule.length; x++) {
        let show = document.createElement("div");
        show.classList.add("gameInfo");
        let showName = document.createElement("div");
        showName.innerHTML = daySchedule[x][1];
        let showTime = document.createElement("div");
        showTime.innerHTML = convertToTime(daySchedule[x][0]);
        show.appendChild(showName);
        show.appendChild(showTime);
        data.appendChild(show);
    }

    return dayElement;
}
