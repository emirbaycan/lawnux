function setPopup(options) {
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n;
    if (document.getElementById('popup')) {
        document.getElementById('popup').remove();
    }
    a = document.createElement('div');
    a.className = 'popup';
    a.id = 'popup';
    a.dataset.state = 'open';
    if (options.dataset) {
        b = options.dataset;
        for (c in b) {
            a.dataset[c] = b[c];
        }
    }
    b = document.createElement('div');
    b.className = 'popup-close';
    b.onclick = closePopup;
    b.dataset.the = 'popup';
    c = document.createElement('div');
    c.className = 'popup-inner';
    d = document.createElement('div');
    d.className = 'pop-header';
    e = document.createElement('p');
    e.innerHTML = options.text;
    d.appendChild(e);
    c.appendChild(d);
    if (options.actions) {
        f = document.createElement('div');
        f.className = 'pop-footer';
        g = options.actions;
        h = g.length;
        for (i = 0; i < h; i++) {
            j = g[i];
            k = document.createElement('button');
            if (i === 0) {
                n = k;
            }
            k.className = 'ti-actions';
            if (j.onclick) {
                k.onclick = j.onclick;
            }
            if (j.icon) {
                l = document.createElement('span');
                l.className = j.icon;
                k.appendChild(l);
            }
            if (j.text) {
                m = document.createElement('p');
                m.innerHTML = j.text;
                k.appendChild(m);
            }
            f.appendChild(k);
        }
        c.appendChild(f);
    }
    a.appendChild(b);
    a.appendChild(c);
    document.body.appendChild(a);
    if (n) {
        n.focus();
    }
}

function closePopup() {
    document.getElementById('popup').dataset.state = "";
}

function setAlert(options) {
    var a, b, c, d, e, f, g, h, n;
    if (document.getElementById('kalenux_alert')) {
        document.getElementById('kalenux_alert').remove();
    }
    a = document.createElement('div');
    a.className = 'kalenux-alert';
    a.id = 'kalenux_alert';
    a.dataset.state = 'open';
    if (options.dataset) {
        b = options.dataset;
        for (c in b) {
            a.dataset[c] = b[c];
        }
    }
    if (options.inner) {
        c = document.createElement('div');
        c.className = 'kalenux-alert-header';
        d = options.inner;
        for (f in d) {
            f = d[f];
            if (f) {
                e = document.createElement('span');
                e.className = 'kalenux-alert-icon ' + f.icon;
                c.appendChild(e);
            }
            if (f) {
                e = document.createElement('p');
                e.className = 'kalenux-alert-text';
                e.innerHTML = f.text;
                c.appendChild(e);
            }
        }
        a.appendChild(c);
    }
    if (options.actions) {
        d = document.createElement('div');
        d.className = 'kalenux-alert-actions';
        g = options.actions;
        h = g.length;
        for (i = 0; i < h; i++) {
            e = g[i];
            f = document.createElement('button');
            if (i === 0) {
                n = f;
            }
            f.className = 'kalenux-alert-action';
            f.onclick = e.action;
            f.innerHTML = e.text;
            d.appendChild(f);
        }
        a.appendChild(d);
    }
    document.body.appendChild(a);
    if (options.timer) {
        alert_close_interval = setInterval(closeAlert, options.timer);
    }
    if (n) {
        n.focus();
    }
}

function closeAlert() {
    document.getElementById('kalenux_alert').dataset.state = "";
    if (typeof alert_close_interval != 'undefined') {
        clearInterval(alert_close_interval);
    }
}