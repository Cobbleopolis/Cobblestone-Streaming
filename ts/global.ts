var isNavShown = false;
var nav: JQuery;
var content: JQuery;
var overlay: JQuery;
var navButton: JQuery;
var navLabel: JQuery = $( '<span id=\'navLabel\'>&nbsp;&nbsp;&nbsp;Navigation</span>' );
navLabel.fadeOut();
var mediaMount = null;
var autoClose = true;

var navSlideTime: number = 350;

$(document).ready( function() {
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

    navButton.hover(
        function () {
            navLabel.stop().animate({opacity: 'toggle', width: 'toggle'});
        }, function () {
            navLabel.stop().animate({opacity: 'toggle', width: 'toggle'});
        }
    );

    overlay.click(function () {
        if (isNavShown)
            toggleNav();
    });

    $('.folder').click(function () {
        var jThis = $(this);
        var i = jThis.find($('i'));
        var isClosing: boolean;
        var moveWidth: number = nav.outerWidth(true);

        if (i.hasClass('fa-folder')) {
            i.removeClass('fa-folder');
            i.addClass('fa-folder-open');

            isClosing = false;
        } else if (i.hasClass('fa-folder-open')) {
            i.removeClass('fa-folder-open');
            i.addClass('fa-folder');

            isClosing = true;
        }

        var child = $(jThis.siblings()[0]);
        child.stop().animate({height: 'toggle'},
            {
                start: function() {
                    if (isClosing)
                        child.css('position', 'absolute');
                    content.animate({'left': nav.outerWidth(true)}, 350);
                    navButton.animate({'left': nav.outerWidth(true)}, 350);
                    overlay.animate({'left': nav.outerWidth(true)}, 350);
                    if (isClosing)
                        child.css('position', 'static');
                }
            }
        );
    });

    $('.file').click(function() {
        var jThis = $(this);
        console.log(jThis.html());
        mountFileContent(jThis);
    });
});

function openNav() {
    //console.log('OPEN');
    if (!isNavShown) {
        content.stop().animate({'left': nav.outerWidth()}, navSlideTime);
        navButton.stop().animate({'left': nav.outerWidth()}, navSlideTime);
        overlay.stop().css('display', 'inline').animate({'left': nav.outerWidth(), 'opacity': '0.4'}, navSlideTime);
        isNavShown = true;
    }
}

function closeNav() {
    //console.log('CLOSE');
    if (isNavShown) {
        content.stop().animate({'left': '0'}, navSlideTime);
        navButton.stop().animate({'left': '0'}, navSlideTime);
        overlay.stop().animate({'left': '0', 'opacity': '0'}, {
            duration: navSlideTime,
            done: function() {
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

function mountFileContent(jObject: JQuery) {
    var fileName:string = jObject.find($('span')).text();
    var path:string = jObject.attr('path');
    var dir:string = path.substring(0, path.lastIndexOf("/"));
    var extension:string = FileExtention.getFileExtention(fileName);
    var appendingObject:JQuery = null;
    if (FileExtention.isImageExtension(extension)) {
        mediaMount.children().remove();
        mediaMount.append($(document.createElement('img')).attr('src', path));
    } else if (FileExtention.isAudioExtension(extension)) {
            $.ajax({
                    url: '/rest/getAudioPlayer?file=' + path + '&dir=' + dir,
                    type: 'get',
                    success: function(res) {
                        mediaMount.children().remove();
                        mediaMount.append(res);
                        AudioPlayer.setAudioElem((<HTMLAudioElement>$('audio')[0]));
                        AudioPlayer.setControlsElem((<HTMLDivElement>$('.controls')[0]));
                    }
                }
            );
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
            //)
    }
    if (autoClose)
        toggleNav();
}

module MessageHandle {

    export module MessageType {
        export const NEUTRAL: string = 'neutral';
        export const INFO: string = 'info';
        export const POSITIVE: string = 'positive';
        export const NEGATIVE: string = 'negative';
    }

    export function messageBefore(mount: JQuery, errorMsg: string, messageType: string, callback?: (error?: JQuery, mount?: JQuery) => void): JQuery {
        var msg = $(document.createElement('p'));
        msg.addClass('message ' + messageType);
        msg.text(errorMsg);
        msg.insertBefore(mount);
        if (callback) callback(msg, mount);
        return msg;
    }

    export function messageAfter(mount: JQuery, errorMsg: string, messageType: string, callback?: (error?: JQuery, mount?: JQuery) => void): JQuery {
        var msg = $(document.createElement('p'));
        msg.addClass('message ' + messageType);
        msg.text(errorMsg);
        msg.insertAfter(mount);
        if (callback) callback(msg, mount);
        return msg;
    }

    export function messageBeforeWithBreak(mount: JQuery, errorMsg: string, messageType: string, callback?: (error?: JQuery, mount?: JQuery) => void): JQuery {
        var message = MessageHandle.messageBefore(mount, errorMsg, messageType, callback);
        $(document.createElement('hr')).insertAfter(message);
        return message;
    }

    export function messageAfterWithBreak(mount: JQuery, errorMsg: string, messageType: string, callback?: (error?: JQuery, mount?: JQuery) => void): JQuery {
        var message = MessageHandle.messageAfter(mount, errorMsg, messageType, callback);
        $(document.createElement('hr')).insertBefore(message);
        return message;
    }

    export function messageError(message: JQuery, callback?: () => void) {
        message.remove();
        if (callback) callback();
    }

    export function removeAllMessages(callback?: () => void) {
        $('p.message').remove();
        if (callback) callback();
    }
}

module FileExtention {
    let fileTypes: any = {
        imageTypes: {
            'jpg': '',
            'jpeg': '',
            'png': ''
        },
        audioTypes: {
            'mp3': 'audio/mpeg',
            'flac': 'audio/mpeg', //TODO check for correct type
            'oog': 'audio/oog'
        }
    };

    export function getFileExtention(filename: string): string {
        return filename.split('.').pop().toLowerCase();
    }

    export function isImageExtension(fileExtension: string): boolean {
        return fileExtension in fileTypes.imageTypes;
    }

    export function isAudioExtension(fileExtension: string): boolean {
        return fileExtension in fileTypes.audioTypes;
    }

    export function getFileMediaType(fileExtension: string): string {
        if (isImageExtension(fileExtension))
            return fileTypes.imageTypes[fileExtension];
        else if (isAudioExtension(fileExtension))
            return fileTypes.audioTypes[fileExtension];
        else
            return null;
    }

}

class Color {

    color: string;

    constructor (value: string) {this.color = value}

    toString(): string {return this.color}

    getDisplayString(): string {
        return this.color.substring(0, 1).toUpperCase() + this.color.substring(1);
    }

    static red: Color = new Color('red');
    static orange: Color = new Color('orange');
    static yellow: Color = new Color('yellow');
    static olive: Color = new Color('olive');
    static green: Color = new Color('green');
    static teal: Color = new Color('teal');
    static blue: Color = new Color('blue');
    static violet: Color = new Color('violet');
    static pink: Color = new Color('pink');
    static brown: Color = new Color('brown');
    static grey: Color = new Color('grey');
    static black: Color = new Color('black');

    static allColors: Color[] = [
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

}

module AudioPlayer {

    class Controls {
        htmlElem: HTMLDivElement;
        container: JQuery;
        play: JQuery;
        timeline: JQuery;
        playHead: JQuery;
        volume: JQuery;
        volumeControl: JQuery;
        volumeToggle: JQuery;
        volumeHead: JQuery;

        loadedData: boolean = false;

        mouseDown: boolean = false;

        constructor(htmlElem: HTMLDivElement) {
            this.container = $(htmlElem);
            this.htmlElem = htmlElem;
            this.play = this.container.find('.play');
            this.timeline = this.container.find('.timeline');
            this.playHead = this.container.find('.playHead');
            this.volume = this.container.find('.volume');
            this.volumeControl = this.container.find('.volumeControl');
            this.volumeToggle = this.container.find('.volumeToggle');
            this.volumeHead = this.container.find('.volumeHead');

            this.timeline.mousedown(function(event: JQueryMouseEventObject) {
                this.mouseDown = true;
                updateTimeFromTimeline(event);
            });
            this.timeline.mousemove(function(event: JQueryMouseEventObject) {
                if (this.mouseDown)
                    updateTimeFromTimeline(event);
            });
            this.timeline.mouseup(function() { this.mouseDown = false;});
            this.volumeControl.mouseleave(function() {this.mouseDown = false;});

            this.volumeControl.mousedown(function(event: JQueryMouseEventObject) {
                this.mouseDown = true;
                changeVolumeFromControls(event);
            });
            this.volumeControl.mousemove(function(event: JQueryMouseEventObject) {
                if (this.mouseDown)
                    changeVolumeFromControls(event);
            });
            this.volumeControl.mouseup(function () {this.mouseDown = false;});
            this.volumeControl.mouseleave(function() {this.mouseDown = false;});
        }
    }

    let audioElem: HTMLAudioElement;
    let controls: Controls;
    let timeUpdateFunction: () => void = function() {
        controls.playHead.width((audioElem.currentTime / audioElem.duration * 100) + "%");
    };
    let volumeUpdateFunction: () => void = function() {
        controls.volumeHead.css('height', audioElem.volume * 100 + "%");
    };
    //let onLoad: () => void = function() {
    //
    //};

    export function setAudioElem(newElem: HTMLAudioElement) {
        audioElem = newElem;
        audioElem.addEventListener('timeupdate', timeUpdateFunction);
        audioElem.addEventListener('volumechange', volumeUpdateFunction);
        audioElem.addEventListener('loadeddata', function() {
            controls.loadedData = true;
        })
    }

    export function getAudioElem(): HTMLAudioElement {
        return audioElem;
    }

    export function setControlsElem(newControlsElem: HTMLDivElement) {
        controls = new Controls(newControlsElem);
        controls.loadedData = false;
        controls.volumeToggle.click(toggleMute);
        volumeUpdateFunction();
    }

    export function getControlsElem(): Controls {
        return controls;
    }

    export function play() {
        if (controls.loadedData) {
            audioElem.play();
            controls.play.find('i').toggleClass('fa-play').toggleClass('fa-pause');
        }
    }

    export function pause() {
        if (controls.loadedData) {
            audioElem.pause();
            controls.play.find('i').toggleClass('fa-play').toggleClass('fa-pause');
        }
    }

    export function togglePlaying() {
        if(audioElem.paused)
            play();
        else
            pause();
    }

    export function mute() {
        audioElem.muted = true;
        controls.volumeToggle.find('i').toggleClass('fa-volume-up').toggleClass('fa-volume-off');
    }

    export function unMute() {
        audioElem.muted = false;
        controls.volumeToggle.find('i').toggleClass('fa-volume-up').toggleClass('fa-volume-off');
    }

    export function toggleMute() {
        if (audioElem.muted)
            unMute();
        else
            mute();
    }

    export function updateTimeFromTimeline(event: JQueryMouseEventObject) {
        let percent: number = Math.max(Math.min((event.pageX - controls.timeline.offset().left) / controls.timeline.width(), 1.0), 0.0);
        audioElem.currentTime = audioElem.duration * percent;
        controls.playHead.css('width', percent * 100 + "%");
    }

    export function changeVolumeFromControls(event: JQueryMouseEventObject) {
        let percent: number = Math.max(Math.min(1 - (event.pageY - controls.volumeControl.offset().top) / controls.volumeControl.height(), 1.0), 0.0);
        audioElem.volume = percent;
    }


}
