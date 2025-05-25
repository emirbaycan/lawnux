function send(e) {
    if (e.keyCode == 13 && !e.shiftKey) {
        sendMessage();
        e.preventDefault();
    }
}

function sendMessage() {
    var a = message_holder.value;
    if (!a.replace(/\s/g, '').length) {
        return;
    }
    var data = {
        order_id: order_id,
        message: a,
    }
    postJSON(messager_send_url, function(a, params) {
        message_holder.value = '';
        message_holder.focus();
        getMessageCount();
    }, data);
}

function getMessageCount() {
    if (typeof messager === 'undefined' || !messager) {
        return;
    }
    var data = {
        order_id: order_id,
    }
    postJSON(message_count_url, function(a) {
        if (a.result === 1) {
            if (message_count != a.count) {
                loadNewMessages(0, a.count - message_count);
            }
        }
    }, data)
}

function getMessages() {
    var data = {
        start: message_start,
        limit: message_limit,
        order_id: order_id,
    }
    postJSON(messager_url, function(a) {
        if (a.result === 1) {
            message_count = a.count;
            setOldMessages(a.data);
            messages_holder.scrollBy({ top: messages_holder.dataset.height, left: 0 });
        }
    }, data)
}

function loadNewMessages(b, c) {
    var data = {
        start: b,
        limit: c,
        order_id: order_id,
    }
    postJSON(messager_url, function(a) {
        if (a.result === 1) {
            message_count = a.count;
            setNewMessages(a.data);
            messages_holder.scrollBy({ top: messages_holder.scrollHeight, left: 0 });
        }
    }, data)
}

function loadOldMessages() {
    if (messages_holder.scrollTop != 0) {
        return;
    }
    var a = document.getElementsByClassName('om-message').length;

    if (message_count >= a) {
        return;
    }
    var data = {
        start: a,
        limit: message_limit,
        order_id: order_id,
    }

    postJSON(messager_url, function(a) {
        if (a.result === 1) {
            message_count = a.count;
            setOldMessages(a.data);
            messages_holder.scrollBy({ top: messages_holder.dataset.height, left: 0 });
        }
    }, data)
}

function parseMessages(a) {
    var b = a.length,
        c, d, r = '';
    for (i = 0; i < b; i++) {
        c = a[i];
        if (c.sender_id == user_id) {
            d = 'class="om-message om-sender"';
        } else {
            d = 'class="om-message om-receiver"';
        }
        r += '<div ' + d + ' >' + c.message + '<span class="om-time">' + c.message_time + '</span></div>';
    }
    return r;
}

function setNewMessages(data) {
    messages_holder.innerHTML += parseMessages(data.reverse());
}

function setOldMessages(data) {
    messages_holder.innerHTML = parseMessages(data.reverse()) + messages_holder.innerHTML;
}

firer.push(function() {
    message_count = 0;
    messages_holder = document.getElementById('messages');
    message_holder = document.getElementById('message');
    if (message_holder != null) {
        message_holder.onkeydown = send;
    }
    int_boost_messages = setInterval(getMessageCount, 15000);
    messages_holder.onscroll = loadOldMessages;
})