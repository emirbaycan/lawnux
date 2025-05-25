function setNavigations() {
    var i, a, b, c;
    a = document.getElementsByClassName('navigations-header');
    b = a.length;
    for (i = 0; i < b; i++) {
        c = a[i];
        c.onclick = setNavigation.bind(null, i);
    }
}

function clearSetStates(a, b) {
    var i, c, d;
    c = document.getElementsByClassName(a);
    d = c.length;
    for (i = 0; i < d; i++) {
        c[i].dataset.state = "";
    }
    c[b].dataset.state = "open";
}

function setNavigation(a) {
    clearSetStates('navigations-header', a);
    clearSetStates('navigation', a);
}

firer.push(setNavigations);