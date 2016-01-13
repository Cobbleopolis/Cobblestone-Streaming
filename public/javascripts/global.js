var isNavShown = false;
var nav;
var content;
var overlay;
var navButton;
var navLabel = $('<span id=\'navLabel\'>&nbsp;&nbsp;&nbsp;Navigation</span>');
navLabel.fadeOut();
var mediaMount = null;
var autoClose = true;
var navSlideTime = 350;
$(document).ready(function () {
    content = $('#content');
    overlay = $('#overlay');
    nav = $('#nav');
    navButton = $('#navButton');
    mediaMount = $('#mediaMount');
    navButton.append(navLabel);
    navButton.css('height', navButton.height());
    var overlayHeight = window.getComputedStyle(document.getElementById('content'), null).getPropertyValue('height');
    overlay.css('height', overlayHeight === 'auto' ? '100%' : overlayHeight);
    navButton.click(function () {
        toggleNav();
    });
    navButton.hover(function () {
        navLabel.stop().animate({ opacity: 'toggle', width: 'toggle' });
    }, function () {
        navLabel.stop().animate({ opacity: 'toggle', width: 'toggle' });
    });
    overlay.click(function () {
        if (isNavShown)
            toggleNav();
    });
    $('.folder').click(function () {
        var jThis = $(this);
        var i = jThis.find($('i'));
        var isClosing;
        var moveWidth = nav.outerWidth(true);
        if (i.hasClass('fa-folder')) {
            i.removeClass('fa-folder');
            i.addClass('fa-folder-open');
            isClosing = false;
        }
        else if (i.hasClass('fa-folder-open')) {
            i.removeClass('fa-folder-open');
            i.addClass('fa-folder');
            isClosing = true;
        }
        var child = $(jThis.siblings()[0]);
        child.stop().animate({ height: 'toggle' }, {
            start: function () {
                if (isClosing)
                    child.css('position', 'absolute');
                content.animate({ 'left': nav.outerWidth(true) }, 350);
                navButton.animate({ 'left': nav.outerWidth(true) }, 350);
                overlay.animate({ 'left': nav.outerWidth(true) }, 350);
                if (isClosing)
                    child.css('position', 'static');
            }
        });
    });
    $('.file').click(function () {
        var jThis = $(this);
        console.log(jThis.html());
        mountFileContent(jThis);
    });
});
function openNav() {
    //console.log('OPEN');
    if (!isNavShown) {
        content.stop().animate({ 'left': nav.outerWidth() }, navSlideTime);
        navButton.stop().animate({ 'left': nav.outerWidth() }, navSlideTime);
        overlay.stop().css('display', 'inline').animate({ 'left': nav.outerWidth(), 'opacity': '0.4' }, navSlideTime);
        isNavShown = true;
    }
}
function closeNav() {
    //console.log('CLOSE');
    if (isNavShown) {
        content.stop().animate({ 'left': '0' }, navSlideTime);
        navButton.stop().animate({ 'left': '0' }, navSlideTime);
        overlay.stop().animate({ 'left': '0', 'opacity': '0' }, {
            duration: navSlideTime,
            done: function () {
                overlay.css('display', 'none');
            }
        });
        isNavShown = false;
    }
}
function toggleNav() {
    if (isNavShown)
        closeNav();
    else
        openNav();
    content.toggleClass('darken');
}
function mountFileContent(jObject) {
    var fileName = jObject.find($('span')).text();
    var path = jObject.attr('path');
    var dir = path.substring(0, path.lastIndexOf("/"));
    var extension = FileExtention.getFileExtention(fileName);
    var appendingObject = null;
    if (FileExtention.isImageExtension(extension)) {
        mediaMount.children().remove();
        mediaMount.append($(document.createElement('img')).attr('src', path));
    }
    else if (FileExtention.isAudioExtension(extension)) {
        $.ajax({
            url: '/rest/getAudioPlayer?file=' + path + '&dir=' + dir,
            type: 'get',
            success: function (res) {
                mediaMount.children().remove();
                mediaMount.append(res);
                AudioPlayer.setAudioElem($('audio')[0]);
            }
        });
    }
    if (autoClose)
        toggleNav();
}
var MessageHandle;
(function (MessageHandle) {
    var MessageType;
    (function (MessageType) {
        MessageType.NEUTRAL = 'neutral';
        MessageType.INFO = 'info';
        MessageType.POSITIVE = 'positive';
        MessageType.NEGATIVE = 'negative';
    })(MessageType = MessageHandle.MessageType || (MessageHandle.MessageType = {}));
    function messageBefore(mount, errorMsg, messageType, callback) {
        var msg = $(document.createElement('p'));
        msg.addClass('message ' + messageType);
        msg.text(errorMsg);
        msg.insertBefore(mount);
        if (callback)
            callback(msg, mount);
        return msg;
    }
    MessageHandle.messageBefore = messageBefore;
    function messageAfter(mount, errorMsg, messageType, callback) {
        var msg = $(document.createElement('p'));
        msg.addClass('message ' + messageType);
        msg.text(errorMsg);
        msg.insertAfter(mount);
        if (callback)
            callback(msg, mount);
        return msg;
    }
    MessageHandle.messageAfter = messageAfter;
    function messageBeforeWithBreak(mount, errorMsg, messageType, callback) {
        var message = MessageHandle.messageBefore(mount, errorMsg, messageType, callback);
        $(document.createElement('hr')).insertAfter(message);
        return message;
    }
    MessageHandle.messageBeforeWithBreak = messageBeforeWithBreak;
    function messageAfterWithBreak(mount, errorMsg, messageType, callback) {
        var message = MessageHandle.messageAfter(mount, errorMsg, messageType, callback);
        $(document.createElement('hr')).insertBefore(message);
        return message;
    }
    MessageHandle.messageAfterWithBreak = messageAfterWithBreak;
    function messageError(message, callback) {
        message.remove();
        if (callback)
            callback();
    }
    MessageHandle.messageError = messageError;
    function removeAllMessages(callback) {
        $('p.message').remove();
        if (callback)
            callback();
    }
    MessageHandle.removeAllMessages = removeAllMessages;
})(MessageHandle || (MessageHandle = {}));
var FileExtention;
(function (FileExtention) {
    var fileTypes = {
        imageTypes: {
            'jpg': '',
            'jpeg': '',
            'png': ''
        },
        audioTypes: {
            'mp3': 'audio/mpeg',
            'flac': 'audio/mpeg',
            'oog': 'audio/oog'
        }
    };
    function getFileExtention(filename) {
        return filename.split('.').pop().toLowerCase();
    }
    FileExtention.getFileExtention = getFileExtention;
    function isImageExtension(fileExtension) {
        return fileExtension in fileTypes.imageTypes;
    }
    FileExtention.isImageExtension = isImageExtension;
    function isAudioExtension(fileExtension) {
        return fileExtension in fileTypes.audioTypes;
    }
    FileExtention.isAudioExtension = isAudioExtension;
    function getFileMediaType(fileExtension) {
        if (isImageExtension(fileExtension))
            return fileTypes.imageTypes[fileExtension];
        else if (isAudioExtension(fileExtension))
            return fileTypes.audioTypes[fileExtension];
        else
            return null;
    }
    FileExtention.getFileMediaType = getFileMediaType;
})(FileExtention || (FileExtention = {}));
var Color = (function () {
    function Color(value) {
        this.color = value;
    }
    Color.prototype.toString = function () { return this.color; };
    Color.prototype.getDisplayString = function () {
        return this.color.substring(0, 1).toUpperCase() + this.color.substring(1);
    };
    Color.red = new Color('red');
    Color.orange = new Color('orange');
    Color.yellow = new Color('yellow');
    Color.olive = new Color('olive');
    Color.green = new Color('green');
    Color.teal = new Color('teal');
    Color.blue = new Color('blue');
    Color.violet = new Color('violet');
    Color.pink = new Color('pink');
    Color.brown = new Color('brown');
    Color.grey = new Color('grey');
    Color.black = new Color('black');
    Color.allColors = [
        Color.red,
        Color.orange,
        Color.yellow,
        Color.olive,
        Color.green,
        Color.teal,
        Color.blue,
        Color.violet,
        Color.pink,
        Color.brown,
        Color.grey,
        Color.black
    ];
    return Color;
})();
var AudioPlayer;
(function (AudioPlayer) {
    var audioElem;
    function setAudioElem(newElem) {
        audioElem = newElem;
    }
    AudioPlayer.setAudioElem = setAudioElem;
    function getAudioElem() {
        return audioElem;
    }
    AudioPlayer.getAudioElem = getAudioElem;
    function play() {
        audioElem.play();
    }
    AudioPlayer.play = play;
    function pause() {
        audioElem.pause();
    }
    AudioPlayer.pause = pause;
    function togglePlaying() {
        if (audioElem.paused)
            play();
        else
            pause();
    }
    AudioPlayer.togglePlaying = togglePlaying;
})(AudioPlayer || (AudioPlayer = {}));
//# sourceMappingURL=global.js.map