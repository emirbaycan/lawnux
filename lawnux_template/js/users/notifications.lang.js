var page_number = 6;
__user_types = { "!key!": "!value!" };

function setTable(data) {
    var a, b, c, d, e, f, g, h, j, k, p, r;
    a = data.length;
    r = '';
    for (i = 0; i < a; i++) {
        b = data[i];
        c = b.type;
        d = notifications[c];
        if (typeof d === 'undefined') {
            continue;
        }
        r += '<tr><td><a href="' + d.url + '" class="' + color_classes[d.color] + '-color icon-' +
            d.icon + '"></a></td><td><a href="' + d.url + '">' +
            d.text + '</a></td><td>' +
            b.time + '</td></tr>';
    }
    return r;
}

firer.push(function() {
    table_url = user_api_url + 'get/notifications';
    detailedTable();
});