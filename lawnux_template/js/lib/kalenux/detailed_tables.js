var table_start = 0;
var table_limit = 10;
var table_page = 1;
var table_language = {
    "sDecimal": ",",
    "sEmptyTable": "No data in table yet",
    "sInfo": "Showing records from _START_ to _END_ of _TOTAL_ records",
    "sInfoEmpty": "No records found",
    "sInfoFiltered": "(containing _MAX_ records)",
    "sInfoPostFix": "",
    "sInfoThousands": ".",
    "sLengthMenu": "Show _MENU_ records on page",
    "sLoadingRecords": "Loading...",
    "sProcessing": "Processing...",
    "sSearch": "Search:",
    "sZeroRecords": "No matching records found",
    "oPaginate": {
        "sFirst": "First",
        "sLast": "Last",
        "sNext": "Next",
        "sPrevious": "Previous"
    },
    "oAria": {
        "sSortAscending": ": enable ascending column sorting",
        "sSortDescending": ": enable descending column sorting"
    },
    "select": {
        "rows": {
            "_": "%d records selected",
            "0": "",
            "1": "1 record selected"
        }
    }
}

function refreshTable() {

    table = $('#datatable');
    table.DataTable({
        language: table_language,
        info: false,
        filter: false,
        lengthChange: false,
        responsive: true,
        paging: false,
        searching: false,
        autoWidth: true,
    });

    if (typeof table_corder != 'undefined') {
        table.DataTable().order(table_corder).draw();
    } else {
        if (table_order !== 0) {
            if (typeof table_order != 'object') {
                table_order = table_order.split(' ');
            }
            table.DataTable().order(table_order).draw();
        } else {
            table.DataTable().draw();
        }
    }
    var a, b;
    a = table[0].getElementsByTagName('th');
    b = a.length;
    for (i = 0; i < b; i++) {
        a[i].onclick = tableSetOrder.bind(null, table);
    }
}

function tableSetOrder(table) {
    var a, b, c;
    a = table.DataTable().order();
    table_corder = a;
    c = [];
    for (b in a) {
        b = a[b];
        c.push(b[0] + ' ' + table_sorts_r[b[1]]);
    }
    c = c.join(',');
    table_order = c;
    filterTable();
}

function setNav(a) {
    var b, c, d, e, f;
    b = table_navs.dataset.count / table_limit;
    c = Math.ceil(b);
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
            d = Math.floor(b);
            if (c != d) {
                f = 0;
            } else {
                f = 1;
            }
            table_start = d * table_limit - table_limit * f;
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
}

function setNavs() {
    var b, c, e, d, f, i, b, m;
    b = table_navs.dataset.count / table_limit;
    c = Math.ceil(b);
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
        b.classList.add('page-item');
        if (m) {
            b.classList.add('active');
        }
        b.innerHTML = '<button>' + i + '</button>';
        b.onclick = setNav.bind(null, i);
        table_navs.appendChild(b);
    }
}

function getOrders() {
    var data, a, b, c, d;;
    data = {
        start: table_start,
        limit: table_limit,
    };
    if (typeof specialPosts != 'undefined') {
        data = Object.assign({}, data, specialPosts());
    }
    if (typeof table_order === 'object') {
        a = table_order;
        data.order = a[0] + ' ' + table_sorts[a[1]];
    } else if (table_order != 0) {
        data.order = table_order;
    }

    if (table_filters && table_filters.dataset) {
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
    }

    postJSON(table_url, function (a) {
        if (a.result === 1) {
            setOrders(a);
        } else {
            table_navs.parentNode.dataset.state = 'opage';
        }
    }, data);
}

function setOrders(a) {
    var data;
    if (typeof table != 'undefined') {
        table.DataTable().destroy();
    }
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
    if (typeof kalenuxOnoff !== 'undefined') {
        setElems('kalenux-onoffs', kalenuxOnoff);
    }
    if (typeof setActionPopup !== 'undefined') {
        setEvent('onclick', 'set-action-popup', setActionPopup);
    }
    refreshTable();
    setNavs();
}

function detailedTable() {
    $.fn.dataTable.ext.errMode = 'none';

    if (typeof table_holder == 'undefined') {
        table_holder = document.getElementById('table_holder');
        table_navs = document.getElementById('table_navs');
        table_filters = document.getElementById('table_filters');
    }
    if (typeof table_order == 'undefined') {
        table_order = 0;
    }
    table_sorts = {
        asc: 0,
        desc: 1,
    };
    table_sorts_r = {
        asc: 1,
        desc: 0,
    };
    table_page = 1;
    var a, b, c, d;
    if (table_filters && table_filters.dataset) {
        d = table_filters.dataset.filters.split(',');
        for (a in d) {
            a = d[a];
            if (!a) {
                continue;
            }
            a = document.getElementById(a);
            a.onchange = filterTable;
            b = a.dataset.type;
            if (b === 'search') {
                a.onkeydown = tableSearch;
            } else if (b === 'date') {
                $('#table_date').datepicker({
                    onSelect: function () {
                        filterTable();
                    }
                });
            }
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
    postJSON(b.del_url, function (a) {
        filterTable();
        closePopup();
    }, data);
}