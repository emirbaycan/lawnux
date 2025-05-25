var dates = {
    "01": "JANUARY",
    "02": "FEBRUARY",
    "03": "MARCH",
    "04": "APRIL",
    "05": "MAY",
    "06": "JUNE",
    "07": "JULY",
    "08": "AUGUST",
    "09": "SEPTEMBER",
    "10": "OCTOBER",
    "11": "NOVEMBER",
    "12": "DECEMBER"
};

var article_data = {
        start: 3,
        limit: 3
    }
    /*
    var new_start = 4;
    var new_limit = 4;
    */
function parseDate(date) {
    date = date.split(' ')[0].split('-');
    return date[2] + ' ' + dates[date[1]];
}

function filterArticles(elem) {
    article_data.category = elem.dataset.service;
    a = document.getElementsByClassName('category');
    b = a.length;
    for (i = 0; i < b; i++) {
        a[i].dataset.state = "";
    }
    elem.parentNode.dataset.state = 'open';

    holder = document.getElementById('articles');
    holder.innerHTML = '';
    article_data.start = 0;
    getArticles();
}

function getArticles() {
    postJSON(main_api_url + 'get/articles', function(a) {
        if (a.result === 1) {
            var item, data, template, holder;
            data = a.data;
            if (a.count > data.length + article_data.start) {
                document.getElementById('articles_see_more').dataset.state = "open";
            } else {
                document.getElementById('articles_see_more').dataset.state = "";
            }
            template = document.getElementById('article').innerHTML;
            holder = document.getElementById('articles');
            for (item in data) {
                item = data[item];
                text = setTemplate(template, item);
                holder.innerHTML += text;
            }
            article_data.start = article_data.start + article_data.limit;
        }
    }, article_data)
}
/*
function getNews() {
    postJSON(main_api_url + 'get/news', function(a) {
        if (a.result === 1) {
            var item, data, template, holder;
            data = a.data;
            if (a.count > data.length + new_start) {
                document.getElementById('news_see_more').dataset.state = "open";
            } else {
                document.getElementById('news_see_more').dataset.state = "";
            }
            template = document.getElementById('new').innerHTML;
            holder = document.getElementById('news');
            for (item in data) {
                item = data[item];
                text = setTemplate(item, template);
                holder.innerHTML += text;
            }
            new_start += new_limit;
        }
    }, {
        start: new_start,
        limit: new_limit
    })
}*/

firer.push(function() {
    document.getElementById('articles_see_more').onclick = getArticles;
    /*  document.getElementById('news_see_more').onclick = getNews;*/
})