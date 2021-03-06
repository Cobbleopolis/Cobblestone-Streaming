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
    else if (FileExtention.isAudioExtension(extension))
        $.ajax({
            url: '/rest/getAudioPlayer?file=' + path + '&dir=' + dir + '&type=' + FileExtention.getFileMediaType(extension),
            type: 'get',
            success: function (res) {
                mediaMount.children().remove();
                mediaMount.append(res);
                AudioPlayer.setAudioElem($('audio')[0]);
                AudioPlayer.setControlsElem($('.controls')[0]);
            }
        });
    else if (FileExtention.isVideoExtension(extension))
        $.ajax({
            url: '/rest/getVideoPlayer?file=' + path + '&type=' + FileExtention.getFileMediaType(extension),
            type: 'get',
            success: function (res) {
                mediaMount.children().remove();
                mediaMount.append(res);
                console.log(res);
                //AudioPlayer.setAudioElem((<HTMLAudioElement>$('audio')[0]));
                //AudioPlayer.setControlsElem((<HTMLDivElement>$('.controls')[0]));
            }
        });
    //$.ajax(
    //    {
    //        url: '/rest/getAlbumImage?dir=' + dir,
    //        type: 'get',
    //        success: function(res) {
    //            $('div.musicPlayer img').fadeOut('fast', function() {
    //
    //            });
    //            console.log(res);
    //        }
    //    }
    //}
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
        },
        videoTypes: {
            'mp4': 'video/mp4',
            'webm': 'video/webm'
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
    function isVideoExtension(fileExtension) {
        return fileExtension in fileTypes.videoTypes;
    }
    FileExtention.isVideoExtension = isVideoExtension;
    function getFileMediaType(fileExtension) {
        if (isImageExtension(fileExtension))
            return fileTypes.imageTypes[fileExtension];
        else if (isAudioExtension(fileExtension))
            return fileTypes.audioTypes[fileExtension];
        else if (isVideoExtension(fileExtension))
            return fileTypes.videoTypes[fileExtension];
        else
            return null;
    }
    FileExtention.getFileMediaType = getFileMediaType;
})(FileExtention || (FileExtention = {}));
var Color = (function () {
    function Color(value) {
        this.color = value;
    }
    Color.prototype.toString = function () {
        return this.color;
    };
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
    var Controls = (function () {
        function Controls(htmlElem) {
            this.loadedData = false;
            this.mouseDown = false;
            this.container = $(htmlElem);
            this.htmlElem = htmlElem;
            this.play = this.container.find('.play');
            this.timeline = this.container.find('.timeline');
            this.playHead = this.container.find('.playHead');
            this.volume = this.container.find('.volume');
            this.volumeControl = this.container.find('.volumeControl');
            this.volumeToggle = this.container.find('.volumeToggle');
            this.volumeHead = this.container.find('.volumeHead');
            this.timeline.mousedown(function (event) {
                this.mouseDown = true;
                updateTimeFromTimeline(event);
            });
            this.timeline.mousemove(function (event) {
                if (this.mouseDown)
                    updateTimeFromTimeline(event);
            });
            this.timeline.mouseup(function () {
                this.mouseDown = false;
            });
            this.volumeControl.mouseleave(function () {
                this.mouseDown = false;
            });
            this.volumeControl.mousedown(function (event) {
                this.mouseDown = true;
                changeVolumeFromControls(event);
            });
            this.volumeControl.mousemove(function (event) {
                if (this.mouseDown)
                    changeVolumeFromControls(event);
            });
            this.volumeControl.mouseup(function () {
                this.mouseDown = false;
            });
            this.volumeControl.mouseleave(function () {
                this.mouseDown = false;
            });
        }
        return Controls;
    })();
    var audioElem;
    var controls;
    var timeUpdateFunction = function () {
        controls.playHead.width((audioElem.currentTime / audioElem.duration * 100) + "%");
    };
    var volumeUpdateFunction = function () {
        controls.volumeHead.css('height', audioElem.volume * 100 + "%");
    };
    //let onLoad: () => void = function() {
    //
    //};
    function setAudioElem(newElem) {
        audioElem = newElem;
        audioElem.addEventListener('timeupdate', timeUpdateFunction);
        audioElem.addEventListener('volumechange', volumeUpdateFunction);
        audioElem.addEventListener('loadeddata', function () {
            controls.loadedData = true;
        });
    }
    AudioPlayer.setAudioElem = setAudioElem;
    function getAudioElem() {
        return audioElem;
    }
    AudioPlayer.getAudioElem = getAudioElem;
    function setControlsElem(newControlsElem) {
        controls = new Controls(newControlsElem);
        controls.loadedData = false;
        controls.volumeToggle.click(toggleMute);
        volumeUpdateFunction();
    }
    AudioPlayer.setControlsElem = setControlsElem;
    function getControlsElem() {
        return controls;
    }
    AudioPlayer.getControlsElem = getControlsElem;
    function play() {
        if (controls.loadedData) {
            audioElem.play();
            controls.play.find('i').toggleClass('fa-play').toggleClass('fa-pause');
        }
    }
    AudioPlayer.play = play;
    function pause() {
        if (controls.loadedData) {
            audioElem.pause();
            controls.play.find('i').toggleClass('fa-play').toggleClass('fa-pause');
        }
    }
    AudioPlayer.pause = pause;
    function togglePlaying() {
        if (audioElem.paused)
            play();
        else
            pause();
    }
    AudioPlayer.togglePlaying = togglePlaying;
    function mute() {
        audioElem.muted = true;
        controls.volumeToggle.find('i').toggleClass('fa-volume-up').toggleClass('fa-volume-off');
    }
    AudioPlayer.mute = mute;
    function unMute() {
        audioElem.muted = false;
        controls.volumeToggle.find('i').toggleClass('fa-volume-up').toggleClass('fa-volume-off');
    }
    AudioPlayer.unMute = unMute;
    function toggleMute() {
        if (audioElem.muted)
            unMute();
        else
            mute();
    }
    AudioPlayer.toggleMute = toggleMute;
    function updateTimeFromTimeline(event) {
        var percent = Math.max(Math.min((event.pageX - controls.timeline.offset().left) / controls.timeline.width(), 1.0), 0.0);
        audioElem.currentTime = audioElem.duration * percent;
        controls.playHead.css('width', percent * 100 + "%");
    }
    AudioPlayer.updateTimeFromTimeline = updateTimeFromTimeline;
    function changeVolumeFromControls(event) {
        var percent = Math.max(Math.min(1 - (event.pageY - controls.volumeControl.offset().top) / controls.volumeControl.height(), 1.0), 0.0);
        audioElem.volume = percent;
    }
    AudioPlayer.changeVolumeFromControls = changeVolumeFromControls;
})(AudioPlayer || (AudioPlayer = {}));
//# sourceMappingURL=global.js.map