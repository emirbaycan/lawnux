var url_params = new URLSearchParams(window.location.search);
user_types = { "0": "customer", "1": "writer", "2": "moderator", "3": "admin" };
languages = { "TR": "1", "EN": "2" };
valids = {
    "logged": "Başarıyla giriş yaptınız, birazdan yölendirileceksiniz",
    "registered": "Başarıyla kayıt oldunuz, birazdan yönlendirileceksiniz",
    "recovery": "Şifre sıfırlama bağlantısı gönderildi",
    "message_submited": "Mesajınız başarıyla alınmıştır",
    "application_submited": "Başvurunuz alınmıştır, teşekkür ederiz"
}, errors = {
    "reg_email_error": "Lütfen uygun bir mail giriniz.",
    "reg_username_error": "Lütfen uygun bir kullanıcı adı giriniz.",
    "login_username_error": "Lütfen uygun bir mail veya kullanıcı adı giriniz",
    "auth_password_error": "Lütfen uygun bir şifre giriniz",
    "time_limit": "Bot korumasına takıldınız! lütfen daha sonra tekrar deneyiniz",
    "time_limit_exceed": "Bot korumasıyla engellendiniz, lütfen daha sonra tekrar deneyiniz",
    "try_again": "Lütfen daha sonra tekrar deneyiniz",
    "check_your_infos": "Lütfen bilgilerinizi kontrol ediniz",
    "duplicate_user": "Böyle bir kullanıcı sistemimizde kayıtlıdır",
    "please_wait": "Lütfen biraz bekleyiniz",
    "connection_error": "Lütfen internet bağlantınızı kontrol ediniz!",
    "no_match": "Böyle bir kullanıcı sistemimizde kayıtlı değildir!",
    "recovery_time_limit": "Şifre sıfırlama bağlantınız gönderilmiştir",
    "agreement": "Lütfen sözleşmeyi okuduğunuzu kabul ediniz"
};
language = "tr";
var site = 'lawnux';

jsons = {};
defer = true;
user_id = false;

var firer = (function () {
    api_url = '/api/';
    general_api_url = api_url + 'general/';
    var a, b;
    a = getLogin();
    if (a) {
        username = a.username;
        user_image = a.img;
        user_rank = a.user_rank;
        user_id = a.user_id;
        user_email = a.email;
    } else {
        user_rank = 1;
        user_id = false;
    }
    b = user_types[user_rank];
    a = document.createElement('link');
    a.rel = 'stylesheet';
    a.href = '/css/users/' + b + '/icons.css';
    document.head.appendChild(a);
    a = document.createElement('script');
    a.src = '/js/users/' + b + '/user.js';
    document.head.appendChild(a);
})();

firer = [];

function stateParser(a) {
    var b, c, d;
    c = [];
    if (a.popup) {
        c.push('copen');
        b = document.createElement('button');
        b.dataset.to = a.popup;
    } else {
        b = document.createElement('div');
    }
    if (a.color) {
        b.style.color = a.color;
    }
    if (a.icon) {
        c.push('state-wicon');
        d = '<span class="icon-' + a.icon + '"></span><div class="state-info">' + a.text + '</div>';
    } else {
        d = a.text;
    }

    b.innerHTML = d;
    if (c) {
        c = c.join(' ');
        b.className = c;
    }
    return b.outerHTML;
}

function validMail(e) {
    var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(e).toLowerCase());
}

function validLogin(a) {
    return a == "" ? false : true;
}

function validPassword(a) {
    return a == "" ? false : true;
}

function login(event, form) {
    event.preventDefault();
    var a, b;
    a = form.username.value;
    if (!validLogin(a)) {
        setStatus("log_status", errors.login_username_error, false);
        return;
    }
    b = form.password.value;
    if (!validPassword(b)) {
        setStatus("log_status", errors.auth_password_error, false);
        return;
    }

    var data = {
        username: a,
        password: b,
    };

    postJSON(general_api_url + "do/signin",
        function (a) {
            var result, valid,
                message = false;
            result = a.result;
            switch (result) {
                case 1:
                    setLogin(a);
                    valid = true;
                    message = valids.logged;
                    switch (a.user_rank) {
                        case 1:
                            location.href = "/writer/articles";
                            break;
                        case 3:
                            location.href = "/admin/messages";
                            break;
                    }
                    break;
                case -2:
                    message = errors.time_limit;
                    break;
                case -3:
                    message = errors.time_limit_exceed;
                    break;
                case -4:
                    message = errors.check_your_infos;
                    break;
                default:
                    message = errors.try_again;
                    break;
            }
            setStatus('log_status', message, valid);
        },
        data
    );
    return false;
}

function setLogin(a) {
    setCookie(
        site + "_account_infos",
        a.username + "," + a.img + "," + a.user_rank + "," + a.user_id + "," + a.email
    ); 
}

function setGoogle() {
    login_google = true;
}

function onSignIn(e) {
    if (!login_google || !e) {
        return;
    }
    e = e.getAuthResponse();

    var data = {
        id_token: e.id_token,
    };
    postJSON(
        main_api_url + "do/user_google",
        function (a) {
            if (a.result === 1) {
                setLogin(a);
                location.reload();
            }
        },
        data
    );
}

function alertParser(id, a) {
    var b, c;
    b = document.createElement('div');
    b.className = 'notification';
    b.dataset.id = id;
    b.onclick = seenNotification.bind(null, b);
    c = [];
    if (a.color) {
        b.style.color = a.color;
    }
    if (a.url) {
        d = '<a href="' + a.url + '">' + a.text + '</a>';
    } else {
        d = a.text;
    }
    if (a.icon) {
        c.push('state-wicon');
        d = '<span class="icon-' + a.icon + '"></span>' + d + '';
    }
    b.innerHTML = d;
    c = c.join(' ');
    b.className = c;
    return b.outerHTML;
}

function seenNotification(elem) {
    getJSON(
        general_api_url + 'do/seen_notification',
        function (a) { }, { notification_id: elem.dataset.id });
}

function getValue(a) {
    return document.getElementById(a).value;
}

function getV(a) {
    return document.getElementById(a).getAttribute('v');
}

function getInner(a) {
    return document.getElementById(a).innerHTML;
}

function getChecked(a) {
    return document.getElementById(a).checked;
}

function getData(a, b) {
    return document.getElementById(a).dataset[b];
}

function setValue(a, b) {
    a = document.getElementById(a);
    if (a) {
        a.value = b;
    }
}

function setInner(a, b) {
    document.getElementById(a).innerHTML = b;
}

function setOpen(a) {
    document.getElementById(a).dataset.state = "open";
}

function setSrc(a, b) {
    document.getElementById(a).setAttribute('src', b);
}

function setAttribute(a, b, c) {
    document.getElementById(a).setAttribute(b, c);
}

function clearState(a) {
    document.getElementById(a).dataset.state = "";
}

function clearAttribute(a, b) {
    document.getElementById(a).removeAttribute(b);
}

function setE(a, b, c) {
    a(b, c);
}

function focusTo(a) {
    document.getElementById(a).focus();
}

function copen(elem) {
    var a, b, c, d, e, f;
    a = elem.dataset.to;
    b = elem.dataset.the;
    c = elem.dataset.next;
    d = elem.dataset.tp;
    e = elem.dataset.tpc;
    f = elem.dataset.tot;
    if (typeof b !== 'undefined') {
        document.getElementById(b).dataset.state = '';
    }
    if (typeof a !== 'undefined') {
        document.getElementById(a).dataset.state = 'open';
    } else if (typeof c !== 'undefined') {
        elem.nextElementSibling.dataset.state = 'open';
    } else if (typeof d !== 'undefined') {
        while (d = d - 1) {
            elem = elem.parentNode;
        }
        elem.parentNode.dataset.state = 'open';
    } else if (typeof e !== 'undefined') {
        while (e = e - 1) {
            elem = elem.parentNode;
        }
        elem.parentNode.dataset.state = '';
    } else if (typeof f !== 'undefined') {
        b = document.getElementById(f);
        if (b.dataset.state == 'open') {
            b.dataset.state = '';
        } else {
            b.dataset.state = 'open';
        }
    } else {
        if (elem.dataset.state == 'open') {
            elem.dataset.state = '';
        } else {
            elem.dataset.state = 'open';
        }
    }
}

function mcopen(a, b) {
    var c, d, e, f, g, i;
    g = a.parentNode;
    c = document.getElementById(g.getAttribute('to'));
    d = c.children;
    e = d.length;
    for (i = 0; i < e; i++) {
        f = d[i];
        if (i != b) {
            f.removeAttribute('data-state');
        } else {
            f.dataset.state = 'open';
        }
    }
    c = g.children;
    d = c.length;
    for (i = 0; i < d; i++) {
        e = c[i];
        if (i != b) {
            e.dataset.state = '';
        } else {
            e.dataset.state = 'open';
        }
    }
}

function asyncGet(url, callback) {
    var a = new XMLHttpRequest();
    a.open('GET', url);
    a.withCredentials = true;
    a.onreadystatechange = function () {
        if (a.readyState == 4) {
            if (a.status == 200) {
                callback(a.response);
            } else {
                error(errors.connection_error);
            }
        }
    };
    a.send();
}

function postJSON(url, callback, data, params) {
    var a = new XMLHttpRequest();
    a.open('POST', url);
    a.withCredentials = true;
    a.onreadystatechange = function () {
        if (a.readyState == 4) {
            if (a.status == 200) {
                callback(JSON.parse(a.responseText), params);
            } else {
                error(errors.connection_error);
            }
        }
    }
    if (typeof data != 'undefined') {
        a.setRequestHeader('Content-type', 'application/json');
        a.send(JSON.stringify(data));
    } else {
        a.send();
    }
}

function postForm(url, callback, data, params) {
    var a = new XMLHttpRequest();
    a.open('POST', url);
    a.onreadystatechange = function () {
        if (a.readyState == 4) {
            if (a.status == 200) {
                callback(JSON.parse(a.responseText), params);
            } else {
                error(errors.connection_error);
            }
        }
    }
    if (typeof data != 'undefined') {
        a.send(data);
    } else {
        a.send();
    }
}

function getJSON(url, callback) {
    var a = new XMLHttpRequest();
    a.open('GET', url);
    a.withCredentials = true;
    a.onreadystatechange = function () {
        if (a.readyState == 4) {
            if (a.status == 200) {
                callback(JSON.parse(a.responseText));
            } else {
                error(errors.connection_error);
            }
        }
    };
    a.send();
}

function setNotifications(a) {
    var b, c, d, e;
    b = document.getElementById('notifications_holder');
    if (!b) {
        return;
    }
    b.dataset.status = 'filled';
    c = a.length;
    if (c) {
        d = a[0];
        if (d.seen === 0) {
            setEasyAlert(d);
        }
    }
    for (i = 0; i < c; i++) {
        d = a[i];
        e = notifications[d.type];
        if (typeof e === 'undefined') {
            continue;
        }
        b.innerHTML = alertParser(d.id, e);
    }
}

function getNotifications(b) {

    if (typeof b !== 'undefined') {
        var a = getCookie(site + '_check_notifications');
        if (!a) {
            setCookie(site + '_check_notifications', new Date().getTime(), 1);
        } else if (new Date().getTime() - a < 60000) {
            return;
        }
    }

    getJSON(user_api_url + 'get/notifications', function (a) {
        if (a.result === 1) {
            setNotifications(a.data);
        } else if (a.result === -999) {
            logout();
        }
    }, { seen: 0 });

}

function setCookie(e, t, n) {
    var i = '';
    if (n) {
        var o = new Date;
        o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3), i = '; expires=' + o.toUTCString()
    }
    document.cookie = e + '=' + (t || '') + i + '; path=/;'
}

function getCookie(e) {
    for (var t = e + '=', n = document.cookie.split(';'), i = 0; i < n.length; i++) {
        for (var o = n[i];
            ' ' == o.charAt(0);) o = o.substring(1, o.length);
        if (0 == o.indexOf(t)) return o.substring(t.length, o.length)
    }
    return null
}

function eraseCookie(a) {
    document.cookie = a + "=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
}

function setEasyAlert(a) {
    a = notification[a.type];
    setAlert({
        inner: [{
            icon: a.icon,
            text: alertParser(a),
        }],
        actions: [{
            action: closeAlert,
            text: 'Kapat',
            icon: 'close',
        }],
        timer: 3000,
    })
    var c = new Audio('/tr/wololo.mp3');
    c.volume = 0.2;
    c.play();
}

function good() {
    setAlert({
        inner: [{
            icon: 'icon-success',
            text: 'İşlem Başarılı',
        }],
        actions: [{
            action: closeAlert,
            text: 'Kapat',
            icon: 'close',
        }],
        timer: 3000,
    })
}

function error(a) {
    setAlert({
        inner: [{
            icon: 'icon-error',
            text: a,
        }],
        actions: [{
            action: closeAlert,
            text: 'Kapat',
            icon: 'close',
        }],
        timer: 3000,
    })
}

function clearStatus(a) {
    a = document.getElementById(a);
    a.dataset.state = '';
    a.dataset.status = '';
}

function setStatus(a, b, c) {
    if (!b) {
        return;
    }
    a = document.getElementById(a);
    a.dataset.state = 'open';
    a.dataset.status = (c ? 'valid' : 'error');
    a.innerHTML = b;
}

function setInfo(a, b) {
    a = document.getElementById(a);
    a.dataset.state = 'open';
    a.dataset.status = 'info';
    a.innerHTML = b;
}

function setEvent(d, e, f) {
    var a, b, c, i;
    a = document.getElementsByClassName(e);
    b = a.length;
    for (i = 0; i < b; i++) {
        c = a[i];
        c[d] = f.bind(null, c, i);
    }
}

function capitalize(e) { return e[0].toUpperCase() + e.substring(1) }

function setElems(a, b) {
    var c, d, i;
    c = document.getElementsByClassName(a);
    d = c.length;
    for (i = 0; i < d; i++) {
        b(c[0]);
    }
}

function getLogin() {
    var a = getCookie(site + '_account_infos');
    if (!a) {
        return false;
    }
    a = a.split(',');
    return {
        username: a[0],
        img: a[1],
        user_rank: a[2],
        user_id: a[3],
        email: a[4]
    }
}

function clearLogin() {
    eraseCookie(site + '_account_infos ');
    user_id = false;
}

function setGoogle() {
    login_google = true;
}

function socialLogout() {
    if (typeof gapi !== 'undefined' && typeof gapi.auth2 !== 'undefined') {
        gapi.auth2.getAuthInstance().signOut();
    }
}

function logout() {
    socialLogout();
    asyncGet(general_api_url + 'do/logout', function (a) {
        clearLogin();
        location.href = '/';
    });
}

function jsonToVar(json) {
    var key, value, type, result = [];
    for (key in json) {
        value = json[key];
        type = typeof value;
        switch (type) {
            case 'object':
                value = JSON.stringify(value);
                break;
            case 'string':
                value = '"' + value + '"';
                break;
        };
        result.push(key + ' = ' + value);
    }
    result = 'var ' + result.join(',') + ';';
    return result;
}

var entities = {
    'amp': '&',
    'apos': '\'',
    '#x27': '\'',
    '#x2F': '/',
    '#39': '\'',
    '#47': '/',
    'lt': '<',
    'nbsp': ' ',
    'quot': '"'
}

function decodeHTML(a) {
    return a.replace(/&([^;]+);/gm, function (match, entity) {
        return entities[entity] || match
    })
}

function round(a, b) {
    if (typeof b === 'undefined') {
        b = 2;
    }
    a = Math.round(a + "e" + b);
    return Number(a + "e" + -b);
}