var isNavShown = false;
var nav = null;
var content = null;
var navButton = null;
var navLabel = $( "<span id=\"navLabel\">&nbsp;&nbsp;&nbsp;Navigation</span>" );
navLabel.fadeOut();


$(document).ready( function() {
    content = $("#content");
    nav = $("#nav");
    navButton = $("#navButton");

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
    $(".folder").click(function (event) {
        if (this == event.target) {
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

            //child.stop().animate({height: "toggle"},
            //    {
            //        duration: 400,
            //        progress: function(animation, progress, remainingMs) {
            //            var left = (progress / 400) * nav.outerWidth();
            //
            //            content.animate({"left": "+=" + left}, 1);
            //            navButton.animate({"left": "+=" + left}, 1);
            //        }
            //    }
            //);

        }
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
}