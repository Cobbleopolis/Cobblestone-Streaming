var isNavShown = false;
var nav = null;
var content = null;
var navButton = null;
var navLabel = $( "<span id=\"navLabel\">&nbsp;&nbsp;&nbsp;Navigation</span>" );
navLabel.fadeOut();
var mediaMount = null;
var autoClose = true;

$(document).ready( function() {
    content = $("#content");
    nav = $("#nav");
    navButton = $("#navButton");
    mediaMount = $("#mediaMount");

    navButton.append(navLabel);
    navButton.css("height", navButton.height());

    navButton.click(function () {
        toggleNav();
    });
    navButton.hover(
        function () {
            navLabel.stop().animate({opacity: "toggle", width: "toggle"});
        }, function () {
            navLabel.stop().animate({opacity: "toggle", width: "toggle"});

        }
    );
    content.click(function () {
        if (isNavShown)
            toggleNav();
    });
    $(".folder").click(function () {
        var jThis = $(this);
        var i = jThis.find($("i"));

        if (i.hasClass("fa-folder")) {
            i.removeClass("fa-folder");
            i.addClass("fa-folder-open");
        } else if (i.hasClass("fa-folder-open")) {
            i.removeClass("fa-folder-open");
            i.addClass("fa-folder");
        }

        var child = $(jThis.siblings()[0]);
        child.stop().animate({height: "toggle"},
            {
                start: function() {
                    content.animate({"left": nav.outerWidth()}, 350);
                    navButton.animate({"left": nav.outerWidth()}, 350);
                },
                complete: function() {
                    content.animate({"left": nav.outerWidth()}, 350);
                    navButton.animate({"left": nav.outerWidth()}, 350);
                }
            }
        );
    });

    $(".file").click(function() {
        var jThis = $(this);
        console.log(jThis.html());
        mountFileContent(jThis);
    });

});

function openNav() {
    //console.log("OPEN");
    if (!isNavShown) {
        content.animate({"left": nav.outerWidth()}, 350);
        navButton.animate({"left": nav.outerWidth()}, 350);
        isNavShown = true;
    }
}

function closeNav() {
    //console.log("CLOSE");
    if (isNavShown) {
        content.animate({"left": "0"}, 350);
        navButton.animate({"left": "0"}, 350);
        isNavShown = false;
    }
}

function toggleNav() {
    if (isNavShown)
        closeNav();
    else
        openNav();
    content.toggleClass("darken")
}

function getFileExtention(filename) {
    return filename.split('.').pop().toLowerCase();
}

function mountFileContent(jObject) {
    var fileName = jObject.find($("span")).text();
    var extension = getFileExtention(fileName);
    var appendingObject = null;
    if (extension == "jpg" || extension == "jpeg" || extension == "png")
        appendingObject = $("<img>").attr('src', jObject.attr('path').split("/").slice(1).join("/"));

    if (appendingObject) {
        mediaMount.children().remove();
        if (autoClose)
            toggleNav();
        mediaMount.append(appendingObject);
    }
}