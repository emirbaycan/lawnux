var table_start = 0;
var table_limit = 12;
var table_page = 1;
var table_order = [2, 'desc'];

function setNav(a) {
    var b, c, d, e, f, m, i;
    b = table_navs.dataset.count / table_limit;
    if (!b || b <= 1) {
        table_navs.parentNode.dataset.state = 'opage';
    } else {
        table_navs.parentNode.dataset.state = 'mpage';
    }
    c = Math.ceil(b);
    if (a != undefined) {
        switch (a) {
            case '-2':
                if (table_page == 1) {
                    return;
                }
                table_start = 0;
                e = 1
                break;
            case '-1':
                if (table_start < table_limit) {
                    table_start = 0;
                    return;
                }
                table_start -= table_limit;
                e = Math.ceil(table_start / table_limit) + 1;
                break;
            case '0':
                table_start = 0;
                e = 1;
                break;
            case '+1':
                e = Math.ceil((table_start + table_limit) / table_limit) + 1;
                if (e > c) {
                    return;
                }
                table_start += table_limit;
                break;
            case '+2':
                table_start = Math.floor(b) * table_limit;
                e = Math.ceil(table_start / table_limit) + 1;
                if (table_page == e) {
                    return;
                }
                break;
            default:
                table_start = (a - 1) * table_limit;
                e = a;
                break;
        };
        table_page = e;
        getOrders();
        return;
    }

    e = table_page;
    table_navs.innerHTML = '';
    d = e + 5;
    f = e - 5;
    for (i = 1; i <= c; i++) {
        if (i > d && i !== c) {
            continue;
        } else if (i < f && i !== 1) {
            continue;
        }
        b = document.createElement('li');
        if (i == e) {
            m = true;
            if (i != c) {
                table_navs.parentNode.dataset.page = i;
            } else {
                table_navs.parentNode.dataset.page = -1;
            }
        } else {
            m = false;
        }
        b.className = "page-item " + (m ? 'active' : '');
        b.innerHTML = '<button class="page-link">' + i + '</button>';
        b.onclick = setNav.bind(null, i);
        table_navs.appendChild(b);
    }
}

function getOrders() {
    var data, a, b, c, d;
    data = {
        start: table_start,
        limit: table_limit,
    };
    if (typeof specialPosts != 'undefined') {
        data = Object.assign({}, data, specialPosts());
    }
    d = table_filters.dataset.filters.split(',');
    for (a in d) {
        a = d[a];
        if (!a) {
            continue;
        }
        a = $('#' + a);
        b = a.val();
        if (b != '' && b != 0) {
            c = a[0].dataset.name;
            if (c == 'limit') {
                table_limit = parseInt(b);
            }
            data[c] = b;
        }
    }

    postJSON(table_url, function(a) {
        setOrders(a);
    }, data);
}

function setOrders(a) {
    table_navs.dataset.count = a.count;
    var b = a.count;
    if (!b || (table_page === 1 && b < (table_page * table_limit))) {
        table_navs.parentNode.dataset.state = 'opage';
    } else {
        table_navs.parentNode.dataset.state = 'mpage';
    }
    table_navs.dataset.count = b;
    if (a.result === 1) {
        table_holder.innerHTML = setTable(a.data);
    } else {
        table_holder.innerHTML = '';
    }
    setEvent('onclick', 'set-action-popup', setActionPopup);
    setNav();
}

function cardTable() {
    if (typeof table_holder == 'undefined') {
        table_holder = document.getElementById('table_holder');
        table_navs = document.getElementById('table_navs');
        table_filters = document.getElementById('table_filters');
    }
    var a, b, c, d;
    d = table_filters.dataset.filters.split(',');
    for (a in d) {
        a = d[a];
        if (!a) {
            continue;
        }
        a = document.getElementById(a);
        a.onchange = filterTable;
        b = a.dataset.type;
        if (b == 'search') {
            a.onkeydown = tableSearch;
        } else if (b == 'date') {
            $('#table_date').datepicker({
                onSelect: function() {
                    filterTable();
                }
            });
        }
    }
    filterTable();
}

function filterTable() {
    setNav('0');
}

function updateTable() {
    setNav(table_page);
}

function tableSearch(event) {
    if (event.keyCode == 13) {
        filterTable();
        event.preventDefault();
    }
}

function setDelete(elem) {
    setPopup({
        dataset: {
            id: elem.dataset.id,
            del_url: table_del_url
        },
        text: table_del_text,
        actions: [{
            text: 'Evet',
            icon: 'icon-yes',
            onclick: deleteItem
        }, {
            text: 'Hayır',
            icon: 'icon-no',
            onclick: closePopup,
        }]
    });
}

function deleteItem() {
    var a, b;
    a = document.getElementById('popup');
    b = a.dataset;
    var data = {
        id: b.id,
    };
    postJSON(b.del_url, function(a) {
        filterTable();
        closePopup();
    }, data);
}