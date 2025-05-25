var __times = { '!key!': '!value!' };

function setRemain() {
    var current_time, finish_time, remain_time;
    current_time = new Date().getTime();
    finish_time = new Date('Sun Aug 13 2021 00:00:00 GMT+0300 (GMT+03:00)').getTime();
    remain_time = (finish_time - current_time) / 1000;
    document.getElementById('remain').innerHTML = Math.floor(remain_time / 86400) + ' ' + times.days + ' ' + Math.floor(remain_time / 3600) % 24 + ' ' + times.hours + ' ' + Math.floor(remain_time / 60) % 60 + ' ' + times.minutes + ' ' + Math.floor(remain_time % 60) + ' ' + times.seconds;
}

firer.push(function() {
    //setInterval(setRemain, 1000);
})