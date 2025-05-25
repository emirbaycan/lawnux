function updateProfile() {
    var a, data;
    a = document.getElementById('profile_container')
    var data = getChanges(a);
    if (data === 0) {
        return;
    }
    postJSON(user_api_url + 'update/profile', function(a, b) {
        if (a.result === 1) {
            clearChanges(b.b);
            good();
            if (a.username) {
                b = getLogin();
                b.username = a.username;
                setLogin(b)
            }
            if (a.img) {
                b = getLogin();
                b.img = a.img;
                setLogin(b)
            }
        } else {
            error('Lütfen değiştirdiğiniz bilgileri kontrol ediniz');
        }
    }, data, { b: a });
}

function getSetProfile() {
    getJSON(user_api_url + 'get/profile', function(a) {
        if (a.result === 1) {
            var b, c;
            b = a.data;
            for (c in b) {
                if (document.getElementById(c)) {
                    document.getElementById(c).value = b[c];
                }
            }
        } else {
            error('Lütfen internet bağlantınızı kontrol ediniz');
        }
    });
}

firer.push(function() {
    if (typeof user_image !== 'undefined' && document.getElementById('user_image_2')) {
        var m = document.getElementById('user_image_2');
        if (m.nodeName === "INPUT") {
            m = m.nextElementSibling;
        }
        m.style = 'background-image:url(' + user_image + ')';
    }
    if (typeof username !== 'undefined' && document.getElementById('username_2')) {
        document.getElementById('username_2').innerHTML = username;
    }
    getSetProfile();
})