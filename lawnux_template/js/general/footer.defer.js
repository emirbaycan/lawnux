document.body.onload = function() {
    if (user_id) {
    }
    if (document.getElementById('preloader')) {
        document.getElementById('preloader').dataset.state = "";
    }
    document.body.className = '';
    var a, i;
    a = firer.length
    for (i = 0; i < a; i++) {
        firer[i]();
    }
    firer = null;
    setEvent('onclick', 'copen', copen);
}