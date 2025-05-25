function uploadCv(elem) {
    var data = new FormData();
    data.append('file', elem.files[0]);

    postForm(main_api_url + 'upload/cv', function(a, d) {
        var result, valid,
            message = false;
        result = a.result;
        switch (result) {
            case 1:
                d.elem.value = 1;
                valid = true;
                message = valids.cv_submited;
                break;
            case -1:
                message = errors.file_size;
                break;
            case -2:
                message = errors.file_type;
                break;
            default:
                message = errors.file;
                break;
        }
        setStatus('application_status', message, valid);
    }, data, { elem: elem });
}

function setBound(a, n) {
    b = a.parentNode.children;
    c = b.length;
    for (i = 0; i < c; i++) {
        b[i].classList.remove('selected');
    }
    b[n].classList.add('selected');
    b = a.parentNode.nextElementSibling.children;
    c = b.length;
    for (i = 0; i < c; i++) {
        b[i].classList.remove('selected');
    }
    b[n].classList.add('selected');
    b = a.parentNode.parentNode.previousElementSibling.children
    c = b.length;
    for (i = 0; i < c; i++) {
        b[i].classList.remove('selected');
    }
    b[n].classList.add('selected');
}

function setBounds() {
    a = document.getElementsByClassName('career-nav');
    b = a.length;
    for (i = 0; i < b; i++) {
        a[i].onclick = setBound.bind(null, a[i], i);
    }
    a[0].click();
}

function applicate(event, form) {
    event.preventDefault();
    var data = {
        fullname: form.fullname.value,
        phone: form.phone.value,
        email: form.email.value,
        field: form.field.value,
        cover_letter: form.cover_letter.value,
        cv: form.cv.value,
    }

    postJSON(main_api_url + 'add/application', function(a, d) {
        var result, valid,
            message = false;
        result = a.result;
        switch (result) {
            case 1:
                valid = true;
                message = valids.application_submited;
                clearValues(d.form.getElementsByClassName('input'))
                break;
            case -1:
                message = errors.cv_error;
                break;
            case -2:
                message = errors.time_limit;
                break;
            case -3:
                message = errors.time_limit_exceed;
                break;
            default:
                message = errors.try_again;
                break;
        }
        setStatus('application_status', message, valid);
    }, data, { form: form });
    return false;
}

firer.push(function() {
    setBounds();
});