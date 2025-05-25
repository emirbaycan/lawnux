function sendMessage(event, form) {
    event.preventDefault();
    var data = {
        fullname: form.fullname.value,
        email: form.email.value,
        message: form.message.value,
    }
    if (form.phone) {
        data.phone = form.phone.value;
    }

    if (form.subject) {
        data.subject = form.subject.value;
    }

    postJSON(main_api_url + 'add/message', function(a, d) {
        var result, valid,
            message = false;
        result = a.result;
        switch (result) {
            case 1:
                valid = true;
                message = valids.message_submited;
                var e = Array.prototype.slice.call(d.form.getElementsByTagName('input'));
                if (e.length) {
                    var f = Array.prototype.slice.call(d.form.getElementsByTagName('textarea'));
                    if (f.length) {
                        e = e.concat(f);
                    }
                    clearValues(e);
                }
                break;
            case -1:
                message = errors.duplicate_user;
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
        setStatus('message_status', message, valid);
    }, data, { form: form });
    return false;
}