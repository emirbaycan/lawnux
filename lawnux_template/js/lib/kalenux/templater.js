function setTemplate(a, b) {
    var c, d, e, f, g, h, j;
    c = a.match(/£[\w_,]+£/g);
    for (f in c) {
        f = c[f];
        d = f.replace(/£/g, '');
        d = d.split(',');
        for (e in d) {
            e = d[e];
            e = eval('b["' + e + '"]');
            if (e) {
                e = JSON.parse(e);
                for (g in e) {
                    h = e[g];
                    eval('b["' + g + '"]="' + h + '"');
                }
            }
        }
        a = a.replace(f, '');
    }

    c = a.match(/\+[\w\._:,=;*]+\+/g);
    for (f in c) {
        f = c[f];
        d = f.replace(/[\+]/g, '');
        if (d.indexOf('=') !== -1) {
            d = d.split('=');
            j = d[0];
            d = d[1];
        } else {
            j = false;
        }
        if (d.indexOf('.') !== -1) {
            d = d.split('.');
            g = d[0].split(',');
            if (g[0] === '*') {
                e = JSON.stringify(b);
            } else {
                e = [];
                for (h in g) {
                    h = g[h];
                    h = b[h];
                    if (!h && h !== '0' && h !== 0) {
                        continue;
                    }
                    e.push('"' + h + '"');
                }
                e = e.join(',');
            }
            if (!e && e !== '0' && e !== 0) {
                e = '';
            } else {
                e = eval(d[1] + '(' + e + ')');
            }
        } else if (d.indexOf(':') !== -1) {
            d = d.split(':');
            e = eval(d[1]);
            if (e) {
                e = e[b[d[0]]];
            } else {
                e = '';
            }
        } else if (d.indexOf(';') !== -1) {
            d = d.split(';');
            e = b[d[0]];
            if (e && d[1]) {
                e = e[d[1]];
            } else {
                e = '';
            }
        } else {
            if (b[d] || (e === '0' || e === 0)) {
                e = b[d];
            } else {
                e = '';
            }
        }
        if (j) {
            b[j] = e;
            continue;
        }
        a = a.replace(f, e);
    }
    a = a.replace(/#[£ \w\+=,;:\._]+#/g, '');

    return a;
}