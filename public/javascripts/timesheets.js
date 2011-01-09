/* 
 * Code for timesheets UI
 */

function convertToTimeString(mins){
    var timestr = [];
    var meridian = "AM";
    var time_in_mins = mins;
    if(mins>=60){
        var hrs = time_in_mins / 60;
        hrs = Math.floor(hrs);
        if(hrs>12){
            meridian = "PM";
            hrs -= 12;
        }
        else if(hrs==12){
            meridian = "PM";
        }
        if(hrs<=9) timestr.push("0"+hrs)
        else timestr.push(parseInt(hrs));
        time_in_mins %= 60;
    }
    else{
        timestr.push("12");
    }
    timestr.push(":");
    if(time_in_mins<=9) timestr.push("0"+time_in_mins)
    else timestr.push(parseInt(time_in_mins));

    timestr.push(meridian);
    return timestr.join("");
}

function convertToHoursString(mins){
    return new Number(mins/60).toFixed(2);
}

function convertFromTimeString(time){
    var timeInfo = crackTimeString(time);
    var total_mins = (timeInfo.ampm.toLowerCase()=="am") ? (
                        (timeInfo.hours!=12) ? timeInfo.hours*60 : 0
                    ) : (
                        (timeInfo.hours!=12) ? (timeInfo.hours+12)*60 : timeInfo.hours*60
                    );
    total_mins += timeInfo.minutes;
    return total_mins;
}

function convertFromHoursString(hours_str){
    return (String)(parseFloat(hours_str)*60);
}

/*
 * Utility functions
 */

function crackTimeString(time_str){
    var exp = /^(0?[1-9]|1[0-2]):([0-5][0-9])([AaPp][Mm])?$/i;
    if( time_str.match(exp) ){
        return{ hours:   parseInt(RegExp.$1, 10),
                minutes: parseInt(RegExp.$2, 10),
                ampm:   RegExp.$3 };
    }
    else{
        return{ hours:0, minutes:0, ampm:"am" };
    }
}
