var getter = 'service';

firer.push(function () {
    
    add_content_json = new Quill('#add_content', {
        theme: 'snow',
        formats: ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link', 'image', 'align'],
        modules: {
            toolbar: [
                [{ 'header': [2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image']
            ]
        },
    });

    add_content_json.getModule('toolbar').addHandler('image', () => {
        selectLocalImage();
    });

    edit_content_json = new Quill('#edit_content', {
        theme: 'snow',
        formats: ['header', 'bold', 'italic', 'underline', 'strike', 'list', 'link', 'image', 'align'],
        modules: {
            toolbar: [
                [{ 'header': [2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image']
            ]
        },
    });

    edit_content_json.getModule('toolbar').addHandler('image', () => {
        selectLocalImage();
    });
    
    $('#add_created_at').datepicker();
    $('#edit_created_at').datepicker();
})

function getActions(id) {
    return '<button data-id="' + id + '" class="btn btn-edit" onclick="startAction(this)" data-action="edit_service" data-after="getSet()"><span class="icon-edit"></span></button><button data-id="' + id + '" class="btn btn-del" onclick="del(this)"><span class="icon-delete"></span></button>';
}

function del(elem) {
    postJSON(user_api_url + 'del/service', function (a, b) {
        if (a.result === 1) {
            b.elem.parentNode.parentNode.remove();
        }
    }, { id: elem.dataset.id }, { elem: elem })
}

function setSpecial(data) {
    edit_content_json.setContents(JSON.parse(data.content_json));
    return data;
}

function updateSpecial(data) {
    data.content_json = JSON.stringify((edit_content_json.getContents()));
    data.content = edit_content_json.root.innerHTML;
    return data;
}

function addSpecial(data) {
    data.content_json = JSON.stringify((add_content_json.getContents()));
    data.content = add_content_json.root.innerHTML;
    return data;
}


function selectLocalImage() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();

    input.onchange = () => {
        const file = input.files[0];

        if (/^image\//.test(file.type)) {
            saveToServer(file);
        } else {
            console.warn('You could only upload images.');
        }
    };
}

function saveToServer(file) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('order', image_order);
    fd.append('way', 'service');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/functions/general/upload-multi', true);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const url = '/' + xhr.responseText;
            insertToEditor(url);
        }
    };
    xhr.send(fd);
}
 