var resizeViewPort = function(width, height) {
    if (window.outerWidth) {
        window.resizeTo(
            width + (window.outerWidth - window.innerWidth),
            height + (window.outerHeight - window.innerHeight)
        );
    } else {
        window.resizeTo(1280, 800);
        window.resizeTo(
            width + (1280 - document.body.offsetWidth),
            height + (800 - document.body.offsetHeight)
        );
    }
};
