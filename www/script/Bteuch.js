window.onload = function() {
    //a=getCookie("loginBteuch");
    //c_start=document.cookie.indexOf("loginBteuch=");
    //if(c_start == -1){
    //    b=getCookie("registeredBteuch");
    //    d_start=document.cookie.indexOf("registeredBteuch=");
    //    if(d_start == -1){
    //        window.location.href="registering"
    //    }
    //    else{
    //        window.location.href="login"
    //    }
    //}
    //else{
    //   

 var Bteuch = new BTEUCH();
 Bteuch.init();
};
var BTEUCH = function() {
    this.socket = null;
};
BTEUCH.prototype = {
    init: function() {
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect', function() {
            document.getElementById('info').textContent = 'get yourself a nickname :)';
            document.getElementById('nickground').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });
        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = '!nickname is taken, choose another XD';
        });
        this.socket.on('loginSuccess', function() {
            document.title = 'Bteuch | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginground').style.display = 'none';
            document.getElementById('messageInput').focus();
        });
        this.socket.on('error', function(err) {
            if (document.getElementById('loginground').style.display == 'none') {
                document.getElementById('status').textContent = '!fail to connect :(';
            } else {
                document.getElementById('info').textContent = '!fail to connect :(';
            }
        });
        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            //system red ajesse
            that._displaySysMsg('system ', msg, 'red');
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });
        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });
        document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length != 0) {
                that.socket.emit('login', nickName);
            } else {
                document.getElementById('nicknameInput').focus();
            };
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color);
                that._displayMeMsg('me', msg, color);
                return;
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color);
                that._displayMeMsg('me', msg, color);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('hisMsg').innerHTML = '';
        }, false);
        document.getElementById('sendImage').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('colorStyle').value;
                if (!reader) {
                    that._displaySysMsg('system', '!your browser doesn\'t support fileReader', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayMyImage('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        this._initialEmoji();
        document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiground = document.getElementById('emojiground');
            emojiground.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiground = document.getElementById('emojiground');
            if (e.target != emojiground) {
                emojiground.style.display = 'none';
            };
        });
        document.getElementById('emojiground').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },
    
    _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiground'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../content/emoji/' + i + '.png';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function(user, msg, color) {
        var container = document.getElementById('hisMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): <br /></span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayMeMsg: function(user, msg, color) {
        //alert!!! dangerous
        var container = document.getElementById('hisMsg'),
            msgToDisplay = document.createElement('myMsg'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.style.paddingLeft = '750px';
        msgToDisplay.style.wordWrap = 'break-word'
        msgToDisplay.innerHTML = msg + '<br />';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displaySysMsg: function(user, msg, color) {
        var container = document.getElementById('hisMsg'),
            sysmsgToDisplay = document.createElement('p1'),
            date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        sysmsgToDisplay.style.color = color || '#000';
        sysmsgToDisplay.innerHTML =  msg + '<br />';
        container.appendChild(sysmsgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('hisMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiground').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.png" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
};