var __live_stats = { "!key!": "!value!" };
var user_type_names = { "0": "Customer", "1": "Writer", "2": "Moderator", "3": "Admin" };

firer.push(function () {
    if (document.getElementById("username")) {
        setInner("username", username);
    }

    if (document.getElementById("user_image")) {
        document.getElementById("user_image").style =
            "background-image:url(" + user_image + ")";
    }
});

function getSet() {
    var data;
    data = {
        id: document.getElementById('edit_' + getter).dataset.id
    }
    postJSON(user_api_url + 'get/' + getter, function (a) {
        if (a.result === 1) {
            var b, c;
            b = a.data[0];
            for (c in b) {
                d = document.getElementById('edit_' + c);
                if (d) {
                    if (c === 'content') {
                        edit_content_json.setContents(JSON.parse(b['content_json']));
                    } else {
                        e = d.dataset.type;
                        switch (e) {
                            case 'image':
                                kalenuxSetImage('edit_' + c, b[c]);
                                break;
                            case 'select':
                                kalenuxSelectOption('edit_' + c, b[c]);
                                setChanged(document.getElementById('edit_' + c));
                                break;
                            case 'date':
                                $('#edit_' + c).datepicker({
                                    language: "tr",
                                    onSelect: function (fd, date) {
                                        setChanged(document.getElementById('edit_' + c));
                                    }
                                }).data('datepicker').selectDate(new Date(b[c]));
                                break;
                            case 'onoff':
                                kalenuxSelectOnoff('edit_' + c, parseInt(b[c]));
                            default:
                                setValue('edit_' + c, b[c]);
                                break;
                        }
                    }
                }
            }
        }
    }, data);
}

function postAction(a, b, c, d) {
    if (typeof c === "undefined") {
        c = "post";
    }
    if (typeof d === "undefined") {
        d = "_blank";
    }
    var e, f, g;
    e = document.createElement("form");
    e.method = c;
    e.action = a;
    e.target = d;
    for (f in b) {
        if (b.hasOwnProperty(f)) {
            g = document.createElement("input");
            g.type = "hidden";
            g.name = f;
            g.value = b[f];
            e.appendChild(g);
        }
    }
    document.body.appendChild(e);
    e.submit();
}

var getVarName = (a) => Object.keys(a)[0];

function startAction(a) {
    var b, c, d, e;
    if (a.dataset.before) {
        eval(a.dataset.before.replace("(this)", "(" + getVarName({ a }) + ")"));
    }
    b = document.getElementById(a.dataset.action);
    b.dataset.state = "open";
    c = Object.keys(a.dataset);
    for (d in c) {
        e = c[d];
        b.dataset[e] = a.dataset[e];
    }
    if (a.dataset.after) {
        eval(a.dataset.after.replace("(this)", "(" + getVarName({ a }) + ")"));
    }
    a = b.getElementsByClassName("ti-actions");
    if (a.length) {
        a[0].focus();
    }
}

function setChanged(elem) {
    elem.dataset.change = 1;
}

function clearChanges(a) {
    var b, i;
    a = a.getElementsByClassName("kalenux-change");
    b = a.length;
    for (i = 0; i < b; i++) {
        a[i].dataset.change = 0;
    }
}

function getChanges(a) {
    var b, c, r, i;
    a = a.getElementsByClassName("kalenux-change");
    b = a.length;
    r = {};
    for (i = 0; i < b; i++) {
        c = a[i];
        if (c.dataset.change == 1) {
            if (c.type === "checkbox") {
                r[c.dataset.name] = c.checked ? 1 : 0;
            } else {
                r[c.dataset.name] = c.value;
            }
        }
    }
    return r;
}

function getInputs(a) {
    var b, c, r, i;
    a = a.getElementsByClassName("kalenux-change");
    b = a.length;
    r = {};
    for (i = 0; i < b; i++) {
        c = a[i];
        if (c.dataset.change != 1) {
            return false;
        }
        if (c.type === "checkbox") {
            r[c.dataset.name] = c.checked ? 1 : 0;
        } else {
            r[c.dataset.name] = c.value;
        }
    }
    if (typeof setSpecial !== 'undefined') {
        r = setSpecial(r);
    }
    return r;
}

function getAdds(a) {
    var b, c, r, i;
    a = a.getElementsByClassName("kalenux-add");
    b = a.length;
    r = {};
    for (i = 0; i < b; i++) {
        c = a[i];
        if (c.type === "checkbox") {
            r[c.dataset.name] = c.checked ? 1 : 0;
        } else {
            r[c.dataset.name] = c.value;
        }
    }
    return r;
}

function update(elem) {
    var a = elem.parentNode.parentNode.parentNode;
    var data = {
        id: a.dataset.id,
    };

    data = { ...data, ...getChanges(a) };

    if (typeof updateSpecial != "undefined") {
        data = updateSpecial(data);
    }

    postJSON(
        user_api_url + a.dataset.url,
        function (a, b) {
            if (a.result === 1) {
                updateTable(tables.item);
                clearChanges(b.a);
                good();
            } else {
                error("Bir hata oluştu!");
            }
        },
        data, { a: a }
    );
}

function add(elem) {
    var a = elem.parentNode.parentNode.parentNode;
    var data = getAdds(a);
    if (!data) {
        error("Lütfen tüm alanları doldurunuz!");
        return;
    }

    if (typeof addSpecial != "undefined") {
        data = addSpecial(data);
    }

    postJSON(
        user_api_url + a.dataset.url,
        function (a) {
            if (a.result === 1) {
                updateTable(tables.item);
                good();
            } else {
                error("Bir hata oluştu!");
            }
        },
        data
    );
}

function tableSwitch(elem) {
    var data = {
        id: elem.dataset.id,
    };
    data[elem.dataset.name] = elem.checked ? 1 : 0;
    postJSON(
        user_api_url + elem.dataset.url,
        function (a) {
            if (a.result === 1) {
                good();
            }
        },
        data
    );
}

function setActionPopup(a) {
    popup_action = popup_actions[a.dataset.action];
    var b = popup_action.action;
    setPopup({
        dataset: a.dataset,
        text: popup_action.text,
        actions: [{
            text: b.text,
            icon: b.icon,
            onclick: doit,
        },
        {
            text: "Hayır",
            icon: "icon-no",
            onclick: closePopup,
        },
        ],
    });
    popup = document.getElementById("popup");
}

function doit() {
    var data, d;
    data = {};
    d = popup_action.action;
    if (d.send) {
        var a, b, c;
        a = d.send;
        for (b in a) {
            c = a[b];
            if (popup.dataset[c]) {
                data[c] = popup.dataset[c];
            }
        }
    }
    postJSON(
        user_api_url + d.url,
        function (a) {
            if (a.result == 1) {
                closePopup();
                good(popup_action.results[1]);
                filterTable();
            } else {
                error(popup_action.results.e);
            }
        },
        data
    );
}

function panelHeaderMenu(data, holder) {
    var a, b, g;
    if (!document.getElementById(holder)) {
        return;
    }
    a = document.createElement('div');
    a.className = 'menu-down';

    function getHeaderAction(a) {
        var g = document.createElement('a');
        g.className = 'header-action';
        g.href = a.url;
        g.innerHTML = a.text;
        return g;
    }

    for (b in data) {
        a.appendChild(getHeaderAction(data[b]));
    }

    g = document.createElement('button');
    g.innerHTML = 'Çıkış Yap';
    g.className = 'header-action';
    g.onclick = logout;
    a.appendChild(g);
    document.getElementById(holder).appendChild(a);
}

firer.push(function () {
    setEvent("onclick", "copen", copen);
    setEvent("onchange", "kalenux-change", setChanged);
    if (!user_id) {
        logout();
    }

    if (user_id) {
        //setE(panelHeaderMenu, general_header_menu, "general_header_menu");
    }
});