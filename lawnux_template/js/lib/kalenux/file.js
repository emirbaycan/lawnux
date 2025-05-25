function kalenuxFiles(a) {
    var a, b, c;
    a = document.getElementsByClassName('kalenux-file');
    b = a.length;
    for (i = 0; i < b; i++) {
        c = a[i];
        setKalenuxFile(c);
    }
}

function setKalenuxFile(a) {
    var b, c, d;

    b = document.createElement('input');
    b.className = 'kalenux-file-input';
    b.type = 'file';
    b.onchange = upload.bind(null, b);

    c = document.createElement('div');
    c.className = 'kalenux-file-holder';

    d = document.createElement('div');
    d.className = 'kalenux-file-name';

    a.appendChild(b);
    a.appendChild(c);
    a.appendChild(d);

}

function upload(a) {
    data = new FormData();
    data.append('file', a.files[0]);
    postForm(user_api_url + 'upload/file', function(a, b) {
        var result, valid,
            message = false;
        result = a.result;
        switch (result) {
            case 1:
                b.nextElementSibling.nextElementSibling.innerHTML = b.elem.filename;
                b.elem.value = a.filename;
                break;
            default:
                break;
        }

    }, data, { elem: a });
}
kalenuxFiles();