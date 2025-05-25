function kalenuxImage(a) {
    var b, c, d, e, f, g, h, j;
    e = document.createElement('div');
    e.className = 'kalenux-image-adder';
    f = document.createElement('input');
    f.className = a.className.replace('kalenux-images', 'kalenux-image');
    if (a.id) {
        f.id = a.id;
    }
    g = Object.keys(a.dataset);
    for (h in g) {
        j = g[h];
        f.dataset[j] = a.dataset[j];
    }
    f.type = 'hidden';
    f.dataset.type = 'image';
    g = document.createElement('div');
    g.className = 'kalenux-image-add';
    h = document.createElement('input');
    h.className = 'kalenux-image-input';
    h.type = 'file';
    h.onchange = kalenuxImageSelected.bind();
    j = document.createElement('div');
    j.className = 'kalenux-image-display';
    if (a.dataset.default) {
        j.style = 'background-image:url(' + a.dataset.default+')';
        delete a.dataset.default;
    }
    b = a.parentNode;
    e.appendChild(g);
    e.appendChild(h);
    b.appendChild(e);
    b.appendChild(f);
    b.appendChild(j);
    if (a.className.indexOf('kalenux-change') != -1) {
        f.className = 'kalenux-image kalenux-change';
    }
    a.remove();
}

function kalenuxVideo(a) {
    var b, c, d, e, f, g, h, j, k;
    e = document.createElement('div');
    e.className = 'kalenux-video-adder';
    f = document.createElement('input');
    f.className = a.className.replace('kalenux-videos', 'kalenux-video');
    if (a.id) {
        f.id = a.id;
    }
    g = Object.keys(a.dataset);
    for (h in g) {
        j = g[h];
        f.dataset[j] = a.dataset[j];
    }
    f.type = 'hidden';
    f.dataset.type = 'video';
    g = document.createElement('div');
    g.className = 'kalenux-video-add';
    h = document.createElement('input');
    h.className = 'kalenux-video-input';
    h.type = 'file';
    h.onchange = kalenuxVideoSelected.bind();
    j = document.createElement('video');
    j.className = 'kalenux-video-display';
    j.controls = true;

    if (a.dataset.default) {
        j.src = a.dataset.default;
        delete a.dataset.default;
    }
    b = a.parentNode;
    e.appendChild(g);
    e.appendChild(h);
    b.appendChild(e);
    b.appendChild(f);
    b.appendChild(j);
    if (a.className.indexOf('kalenux-change') != -1) {
        f.className = 'kalenux-video kalenux-change';
    }
    a.remove();
}

function onKalenuxVideoeUploaded(a) {
    a.previousElementSibling.src = a.dataset.folder + user_id;
    a.previousElementSibling.load();
}

function onKalenuxImageUploaded(a) {
    a.previousElementSibling.setAttribute('style', 'background-image:url(' + a.dataset.folder + user_id + ')');
}

function kalenuxVideoSelected(event) {
    var a, b, c, d, data, url;
    a = event.target;
    b = a.files[0];
    a = a.parentNode.nextElementSibling;
    c = b.type.split('/')[1];
    d = a.dataset.api;
    url = eval(d + '_api_url');
    data = new FormData();
    data.append('file', b);
    if (a.dataset.page) {
        data.append('page', a.dataset.page);
    }
    postForm(url + a.dataset.upload, function(a, b) {
        if (a.result === 1) {
            var c;
            c = b.elem;
            c.nextElementSibling.src = c.dataset.folder + user_id + '.' + b.type + '?' + new Date().getTime();
            c.nextElementSibling.load()
            c.value = 1;
            setChanged(c);
        }
    }, data, { elem: a, type: c })
}

function kalenuxImageSelected(event) {
    var a, b, c, d;
    a = event.target;
    b = a.files[0];
    a = a.parentNode.nextElementSibling;
    c = b.type.split('/')[1];
    d = a.dataset.api;
    api_url = eval(d + '_api_url');
    if (a.dataset.compress) {
        kalenuxCompress(function(b, a) {
            var data;
            data = new FormData();
            data.append('file', b);
            c = b.type.split('.')[1];
            if (a.dataset.page) {
                data.append('page', a.dataset.page);
            }
            postForm(api_url + a.dataset.upload, function(a, b) {
                if (a.result === 1) {
                    var c;
                    c = b.elem;
                    c.nextElementSibling.setAttribute('style', 'background-image:url(' + c.dataset.folder + user_id + '.' + b.type + '?' + new Date().getTime() + ')');
                    c.value = 1;
                    setChanged(c);
                }
            }, data, { elem: a, type: c })
        }, b, a);
    } else {
        var data;
        data = new FormData();
        data.append('file', b);
        if (a.dataset.page) {
            data.append('page', a.dataset.page);
        }
        postForm(api_url + a.dataset.upload, function(a, b) {
            if (a.result === 1) {
                var c;
                c = b.elem;
                c.nextElementSibling.setAttribute('style', 'background-image:url(' + c.dataset.folder + user_id + '.' + b.type + '?' + new Date().getTime() + ')');
                c.value = 1;
                setChanged(c);
            }
        }, data, { elem: a, type: c })
    }
}

function kalenuxSetVideo(a, b) {
    a = document.getElementById(a);
    a.value = 0;
    a.nextElementSibling.src = b + '?' + new Date().getTime();
    a.nextElementSibling.load();
}

function kalenuxSetImage(a, b) {
    a = document.getElementById(a);
    a.value = 0;
    a.nextElementSibling.setAttribute('style', 'background-image:url(' + b + '?' + new Date().getTime() + ')');
}

function kalenuxCompressImage(maxWidth, maxHeight, cimage, imgType, maxSize, fillStyle, compression, orientation, originalSize, speed, logo) {
    var owidth, oheight, width, height, canvas, ctx, res, size;
    width = cimage.width;
    height = cimage.height;
    if (width > maxWidth) {
        height = Math.round(maxWidth * height / width);
        width = maxWidth;
    }
    while (true) {
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        if (orientation > 0) {
            if ([5, 6, 7, 8].indexOf(orientation) > -1) {
                canvas.width = height;
                canvas.height = width;
            } else {
                canvas.width = width;
                canvas.height = height;
            }
            switch (orientation) {
                case 2:
                    ctx.transform(-1, 0, 0, 1, width, 0);
                    break;
                case 3:
                    ctx.transform(-1, 0, 0, -1, width, height);
                    break;
                case 4:
                    ctx.transform(1, 0, 0, -1, 0, height);
                    break;
                case 5:
                    ctx.transform(0, 1, 1, 0, 0, 0);
                    break;
                case 6:
                    ctx.transform(0, 1, -1, 0, height, 0);
                    break;
                case 7:
                    ctx.transform(0, -1, -1, 0, height, width);
                    break;
                case 8:
                    ctx.transform(0, -1, 1, 0, 0, width);
                    break;
                default:
                    break;
            }
        } else {
            canvas.width = width;
            canvas.height = height;
        }
        ctx.fillStyle = fillStyle;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(cimage, 0, 0, width, height);
        if (typeof logo !== 'undefined') {
            ctx.font = '600 30px Arial'
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillText(logo, width / 2, height / 2);
        }
        res = canvas.toDataURL(imgType, compression);
        size = res.length * 7 / 8;
        if (size < maxSize && size < originalSize) {
            return res;
        } else {
            compression = compression - speed;
            if (compression <= 0) {
                return res;
            }
        }
    }
}

function kalenuxGetOrientation(callback, file) {
    var nreader = new FileReader();
    nreader.onload = function(event) {
        var view = new DataView(event.target.result);
        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
        var length = view.byteLength,
            offset = 2;
        while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) {
                    return callback(-1);
                }
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                        return callback(view.getUint16(offset + (i * 12) + 8, little));
            } else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
        }
        return callback(-1);
    };
    nreader.readAsArrayBuffer(file.slice(0, 64 * 1024));
}

function kalenuxSrcToFile(src, mimeType, filename) {
    return (fetch(src)
        .then(function(res) { return res.arrayBuffer(); })
        .then(function(buf) { return new File([buf], filename, { type: mimeType }, ); })
    );
}

function kalenuxCompress(callback, file, elem) {
    if (typeof FileReader !== 'undefined') {
        var reader;
        reader = new FileReader();
        reader.onload = function(e) {
            var src, orientation, minSize, maxSize, maxWidth, maxHeight, fillStyle, image, originalSize, compression, speed, logo;
            src = e.target.result;
            if (!elem.dataset.maxSize) {
                maxSize = 1024 * 1024 * 1;
            } else {
                maxSize = parseInt(elem.dataset.maxSize);
            }
            if (!elem.dataset.minSize) {
                minSize = 1024 * 1024 * 0.2;
            } else {
                minSize = parseInt(elem.dataset.minSize);
            }
            if (!elem.dataset.maxWidth) {
                maxWidth = 1920;
            } else {
                maxWidth = parseInt(elem.dataset.maxWidth);
            }
            if (!elem.dataset.maxHeight) {
                maxHeight = 1080;
            } else {
                maxHeight = parseInt(elem.dataset.maxHeight);
            }
            if (!elem.dataset.fillStyle) {
                fillStyle = 'rgba(0, 0, 0, 0)';
            } else {
                fillStyle = elem.dataset.fillStyle;
            }
            if (elem.dataset.logo) {
                logo = elem.dataset.logo;
            }
            image = new Image();
            originalSize = file.size;
            compression = 0.9;
            speed = 0.1;
            kalenuxGetOrientation(function(orientation) {
                if (originalSize > minSize) {
                    imgType = 'image/jpeg';
                } else {
                    imgType = file.type;
                }
                fileType = imgType.split('/')[1];
                image.onload = function() {
                    src = kalenuxCompressImage(maxWidth, maxHeight, image, imgType, maxSize, fillStyle, compression, orientation, originalSize, speed, logo);
                    kalenuxSrcToFile(
                            src,
                            'image.' + imgType.split('/')[1],
                            'file.' + fileType,
                        )
                        .then(function(file) {
                            callback(file, elem);
                        });
                }
                image.src = src;
            }, file);
        }
        reader.readAsDataURL(file);
    }
}
firer.push(function() {
    setElems('kalenux-images', kalenuxImage);
    setElems('kalenux-videos', kalenuxVideo);
});