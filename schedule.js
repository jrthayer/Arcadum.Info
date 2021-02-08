var utcTimes = [
[[0, "Shadow Of Tyre"]],
[[180, "Shattered Crowns"]],
[[180, "Heart Of Tyre"], [1200, "Weal And Woe"]],
[[0, "Soul Of Tyre"], [1200, "The Herald's Call"]], 
[[240, "Steel & Silence"]], 
[[1320, "The Tearing Veil"]],
[[120, "Callous Row"]]];

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

            convertedTimes[day].push([time, name]);
        }
    }
}
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

