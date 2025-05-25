var mouse_x;
var mouse_y;
var kalenux_toggles = [];

function mouseMoved(event) {
    mouse_x = event.pageX;
    mouse_y = event.pageY;
}

window.onmousemove = mouseMoved;

function setKalenuxBars() {
    var a, b, i;
    a = document.getElementsByClassName('kalenux-bars');
    b = a.length;
    for (i = 0; i < b; i++) {
        kalenuxBar(a[0], i);
        kalenux_toggles[i] = false;
    }
}

function kalenuxBar(a, i) {
    var b, c, d, e, f, j, k, g, h;
    e = document.createElement('div');
    e.className = 'kalenux-bar';
    f = document.createElement('input');
    f.type = 'hidden';
    if (a.id) {
        f.id = a.id;
    }
    g = document.createElement('div');
    g.className = 'kalenux-toggles';
    g.onmousedown = enableKalenuxTouch.bind(null, g, i);
    g.ontouchstart = enableKalenuxTouch.bind(null, g, i);
    window.onmouseup = disableKalenuxTouch.bind(null, i);
    g.ontouchend = disableKalenuxTouch.bind(null, i);
    g.onmousemove = kalenuxTouched.bind(null, g, i);
    g.ontouchmove = kalenuxTouched.bind(null, g, i);
    h = document.createElement('div');
    h.className = 'kalenux-toggle';
    j = document.createElement('div');
    j.className = 'kalenux-toggle-text';
    j.style = 'transform: translate(0, -50%);';
    k = document.createElement('ul');
    k.className = 'kalenux-touchs';
    b = a.options;
    c = b.length;
    for (i = 0; i < c; i++) {
        d = b[i];
        l = document.createElement('li');
        l.className = 'kalenux-touch';
        l.dataset.value = d.value;
        l.innerHTML = d.innerHTML;
        k.appendChild(l);
    }
    j.innerHTML = b[0].innerHTML;
    g.dataset.count = c;
    e.appendChild(f);
    e.appendChild(k);
    g.appendChild(h);
    g.appendChild(j);
    e.appendChild(g);
    a.parentNode.appendChild(e);
    a.remove();
}

function kalenuxToggled(a, f) {
    var b, c, d, g, i;
    b = a.previousElementSibling;
    c = b.children;
    d = c.length;
    for (i = 0; i < d; i++) {
        c[i].className = 'kalenux-touch';
    }
    h = parseInt(f * d / 100);
    g = c[h];
    a.lastElementChild.innerHTML = g.innerHTML;
    b.previousElementSibling.value = g.dataset.value;
    g.className = 'kalenux-touch kalenux-touch-selected';
}

function kalenuxTouched(a, i) {
    if (!kalenux_toggles[i]) {
        return;
    }
    var b, c, d, e, f;
    b = a.getBoundingClientRect();
    d = a.previousElementSibling.getBoundingClientRect();
    c = mouse_x - d.left;
    e = d.width;
    if (c < 0) {
        c = 0;
    }
    if (c > e) {
        c = e;
    }
    f = c * 100 / e;
    a.firstElementChild.style = 'width:' + f + '%';
    a.lastElementChild.style = 'transform:translate(calc(' + e * f / 100 + 'px - 50%), -50%)';
    kalenuxToggled(a, f);
}

function enableKalenuxTouch(a, i) {
    kalenux_toggles[i] = true;
    kalenuxTouched(a, i);
}

function disableKalenuxTouch(a) {
    kalenux_toggles[a] = false;
}