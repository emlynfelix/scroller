var scrollImages = [];
var scrollCount = 0;
var scrollDiv;
var scrollSpeed;
var parentWidth = 0;
var parentHeight = 0;
var scrolling = 0;
var imagesWidth = 0;
var divArray = [];
var leftX1 = 0, leftY1 = 0, leftX2 = 0, leftY2 = 0, rightX1 = 0, rightX2 = 0, rightY1 = 0, rightY2 = 0;
var imagesLoaded = 0;

function showDiv(displayType) {
    //divArray[0].css({float: 'left'});
    divArray[0].css({display: displayType});
    //divArray[1].css({float: 'left'});
    divArray[1].css({display: displayType});
    var newLeft = divArray[0].offset().left + divArray[0].width()-1, newTop = divArray[0].offset().top;
    divArray[1].offset({left: newLeft, top: newTop});
}

$(window).load( function () {
    showDiv('inline-block');
});

function scrollDiv(i, scrollAmt, scrollAmount) {
    var $elem = divArray[i], $elem2 = divArray[1-i], newLeft = 0, newTop = 0;
    if ( ($elem.position().left + $elem.width() ) < -1 && scrollAmount < 0 ) {
        newLeft = $elem2.offset().left + $elem2.width()-1;
        newTop = $elem.offset().top;
        //console.log('Left '+i+' before', $elem.position().left);
        $elem.offset({left: newLeft, top: newTop});
        //console.log('Left '+i, $elem.position().left, newLeft);
    }
    else if ( $elem.position().left > (parentWidth+1) && scrollAmount > 0 ) {
        newLeft = $elem2.offset().left - $elem.width()+1;
        newTop = $elem.offset().top;
        //console.log('Left '+i+' before', $elem.position().left, parentWidth);
        $elem.offset({left: newLeft, top: newTop});
        //console.log('Left '+i, $elem.position().left, newLeft, parentWidth);
    }

    $elem.animate({left: scrollAmt}, 1000, 'linear', function () {
        scrollDiv(i, scrollAmt, scrollAmount);
    });
}

function scroll(scrollAmount) {
    var scrollAmt = ""+scrollAmount, i = 0;
    if (scrollAmt.indexOf("-") > -1)
        scrollAmt = scrollAmt.replace("-", "-=");
    else
        scrollAmt = "+=" + scrollAmt;
    for (i = 0; i < 2; i++) {
        scrollDiv(i, scrollAmt, scrollAmount);
    }
    scrolling = scrollAmount;
}

function stopScroll() {
    var i = 0;
    for (i = 0; i < 2; i++) {
        var $elem = divArray[i];
        $elem.stop(true);
    }
    scrolling = 0;
}

function startScroll(parentDivSel, scrollSpeedSel, scrollImagesSel, parentWidthSel, parentHeightSel) {
    scrollSpeed = scrollSpeedSel;
    scrollImages = scrollImagesSel;
    scrollCount = scrollImages.length;

    parentWidth = parentWidthSel;
    parentHeight = parentHeightSel;
    var parentDiv = parentDivSel, my_html = '', i = 0, newDiv;

    parentDiv.css({width: parentWidth, height: parentHeight, overflow: 'hidden', position: 'relative', opacity: 0});

    leftX1 = parentDiv.offset().left;
    leftY1 = parentDiv.offset().top;
    leftX2 = leftX1 + 50;
    leftY2 = leftY1 + parentHeight;

    rightX2 = leftX1 + parentWidth;
    rightX1 = rightX2 - 50;
    rightY1 = leftY1;
    rightY2 = leftY2;

    for (i = 0; i < scrollCount; i++) {
        scrollImages[i].onload = function () {
            //imagesWidth += $(this).width;
            imagesLoaded++;
            if (imagesLoaded == scrollCount) {
                var newLeft = divArray[0].width() - 1, newTop = divArray[0].offset().top;
                divArray[1].offset({left: newLeft, top: newTop});
                parentDiv.fadeTo(400, 1, function() { scroll(0-scrollSpeed); });
            }
        };
        my_html += '<img style="display: inline; height: '+parentHeight+'px; margin: 0px;" src="'+scrollImages[i].src+'" />';
    }

    for (i = 0; i < 2; i++) {
        newDiv = jQuery('<div/>', { id: 'scroller'+i });
        newDiv.css({height: parentHeight, position: 'absolute', display: 'inline', 'white-space': 'nowrap'});
        parentDiv.append(newDiv);
        newDiv.html(my_html);
        divArray[i] = newDiv;
    }

    $(window).bind('blur', function() {
        stopScroll();
    });
    $(window).bind('focus', function() {
        if (scrolling == 0)
            scroll(0-scrollSpeed);
    });

    parentDiv.bind('mouseleave', function () {
        if (scrolling == 0)
            scroll(0-scrollSpeed);
    });
    parentDiv.bind('mousemove', function (event) {
        var eventX = event.pageX, eventY = event.pageY, inRight = 0, inLeft = 0;
        inRight = eventX < rightX2 && eventX > rightX1 && eventY > rightY1 && eventY < rightY2;
        inLeft = eventX < leftX2 && eventX > leftX1 && eventY > leftY1 && eventY < leftY2;
        if (inRight && scrolling < 0) {}
        else if (inLeft && scrolling > 0) {}
        else if (inRight) {
            if (scrolling > 0)
                stopScroll();
            scroll(0-scrollSpeed);
        }
        else if (inLeft) {
            if (scrolling < 0)
                stopScroll();
            scroll(scrollSpeed);
        }
        else {
            stopScroll();
        }
    });
}
