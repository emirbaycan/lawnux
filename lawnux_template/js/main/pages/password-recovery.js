function recover_password(event, form) {
    event.preventDefault();
    var b;
    b = form.new_password.value;
    if (!validPassword(b)) {
        setStatus('recover_status', logins.auth_password_error, false);
        return;
    }

    if (form.new_password.value !== form.new_password_confirmation.value) {
        setStatus('recover_status', logins.passwords_not_same, false);
        return;
    }

    var data = {
        email: form.email.value,
        password: b,
        hash_code: form.hash_code.value,
    }

    postJSON(main_api_url + 'do/recover_password', function(a) {
        var result, valid,
            message = false;
        result = a.result;
        switch (b) {
            case 1:
                valid = true;
                setLogin(a);
                message = logins.password_changed;
                location.href = "/";
                break;
            case -1:
                message = logins.time_limit;
                break;
            case -2:
                message = logins.time_limit;
                break;
            case -3:
                message = logins.time_limit_exceed;
                break;
            default:
                message = logins.try_again;
                break;
        }
        setStatus('recover_status', message, valid);
    }, data);
    return false;
}

function setRecovers() {
    var m;
    m = url_params.get('email');
    if (!m) {
        location.href = "/";
    }
    setValue('email', m)
    m = url_params.get('hash');
    if (!m) {
        location.href = "/";
    }
    setValue('hash_code', m)
}

firer.push(setRecovers);