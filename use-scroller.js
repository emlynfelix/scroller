var scrollImages = [];
var imageURLs = [ 'heart.jpg', 'fudge.jpg', 'coconut_ice.jpg', 'macaroon.jpg' ];

for (var i = 0; i < imageURLs.length; i++) {
    my_image = new Image();
    my_image.src = imageURLs[i];
    scrollImages.push(my_image);
}

$(document).ready(function () {
    startScroll(
        $('#scroller'), // name of the slideshow 'window' div
        50,             // scroll speed
        scrollImages,   // the array of Image objects you set up above
        800,           // the width of your slideshow window
        350,            // the height of your slideshow window
        1               // the gap between images
    );
});