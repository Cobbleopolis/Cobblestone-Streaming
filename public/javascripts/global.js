var isNavShown = false;
var nav = null;
var content = null;
var navButton = null;


$(function() {
    content = $("#content");
    nav = $("#nav");
    navButton = $("#navButton");
    //nav.css("left", nav.width());
    //nav.css("z-index", "auto");
    navButton.click(function() {
        toggleNav()
    });
});

function openNav() {
    console.log("OPEN");
    if (!isNavShown) {
        content.animate({"left": nav.outerWidth()}, 350);
        navButton.animate({"left": nav.outerWidth()}, 350);
        isNavShown = true;
    }
}

function closeNav() {
    console.log("CLOSE");
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