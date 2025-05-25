var fields={"1":"Lawyer","2":"Trainee Lawyer","3":"Others"};

function getActions(id) {
    return '<button data-id="' + id + '" class="btn btn-del" onclick="del(this)"><span class="icon-delete"></span></button>';
}

function parseCv(cv) {
    return '<div class="cv"><div class="cv-top"></div><a target="_blank" href="../' + cv + '"></a></div>';
}

function del(elem) {
    postJSON(user_api_url + 'del/application', function(a, b) {
        if (a.result === 1) {
            b.elem.parentNode.parentNode.remove();
        }
    }, { id: elem.dataset.id }, { elem: elem })
}