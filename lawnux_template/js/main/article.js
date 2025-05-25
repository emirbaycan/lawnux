firer.push(setShareLinks);

function socialWindow(url) {
    var left = (screen.width - 570) / 2;
    var top = (screen.height - 570) / 2;
    var params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;
    window.open(url, "NewWindow", params);
}

function setShareLinks() {
    var pageUrl = encodeURIComponent(document.URL);
    var tweet = encodeURIComponent(document.querySelector("meta[name='description']").getAttribute('content'));

    /* document.getElementById('facebook').onclick = function() {
        url = "https://www.facebook.com/sharer.php?u=" + pageUrl;
        socialWindow(url);
    }*/

    document.getElementById('twitter').onclick = function() {
        url = "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + tweet;
        socialWindow(url);
    }
    document.getElementById('linkedin').onclick = function() {
        url = "https://www.linkedin.com/shareArticle?mini=true&url=" + pageUrl;
        socialWindow(url);
    }
}