Hooks.on("renderImagePopout", function(document,html){
    //Adjust Appearance
    html.find('.window-resizable-handle').remove()
    html.find('.window-header').remove()
    html.find('.window-content').css("background-color", "transparent");
    html.css("background", "none");
    html.css("box-shadow", "none");
    html.css("max-height", "none");
    html.find('.lightbox-image').css("flex", "1");
    html.closest(".window-content").css("overflow-y", "unset")

    //Click to Drag
    html.mousedown(function(e){
        window.my_dragging = {};
        my_dragging.pageX0 = e.pageX;
        my_dragging.pageY0 = e.pageY;
        my_dragging.elem = this;
        my_dragging.offset0 = $(this).offset();
        function handle_dragging(e){
            var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
            $(my_dragging.elem)
            .offset({top: top, left: left});
        }
        function handle_mouseup(e){
            $('body')
            .off('mousemove', handle_dragging)
            .off('mouseup', handle_mouseup);
        }
        $('body')
        .on('mouseup', handle_mouseup)
        .on('mousemove', handle_dragging);
    });

    //Mousewheel to Zoom
    html.find('.lightbox-image').on('mousewheel', function(ev){
	var delta = ev.originalEvent.deltaY;
    let imageSrc = html.find('.lightbox-image').css('background-image').replace(/url\((['"])?(.*?)\1\)/gi, '$2').split(',')[0]
    let tempImage = new Image();
    tempImage.src = imageSrc;

	let width = Math.max(100, html.width() - (delta/2));
    let height = width/tempImage.width*tempImage.height;
	html.width(width);
	html.height(height);

    let left = html.css('left').slice(0, -2)
    html.css('left', left -delta/-5+"px")
    let top = html.css('top').slice(0, -2)
    html.css('top', top -delta/-5+"px")
    });

    //Double Click to Close
    var DELAY = 250, clicks = 0, timer = null;
    html.find('.lightbox-image').on('click', function(ev){
        clicks++;
        if(clicks === 1) {
            timer = setTimeout(function() {
                clicks = 0;
            }, DELAY);

        } else {
            clicks = 0;
            clearTimeout(timer);
            document.close()
        }
    })

    //Right Click for Options
    let X,Y;
    html.on('contextmenu', function(e) {
        console.log(this)
        let parentOffset = $(this).offset(); 
        X = e.pageX - parentOffset.left;
        Y = e.pageY - parentOffset.top;
    })

    html.on('DOMNodeInserted', function(e) {
        $(e.target).css("left", X+'px')
        $(e.target).css("top", Y+'px')
        html.css("position", "fixed");
    });

    const menuItems = [
        {
            name: "JOURNAL.ActionShow",
            icon: '<i class="fas fa-eye"></i>',
            callback: () => document.shareImage()
        },
        {
            name: "Close",
            icon: '<i class="fas fa-times"></i>',
            callback: () => document.close()
        },
        {
            name: "Send to Back",
            icon: '<i class="fas fa-level-down-alt"></i>',
            callback: () => html.css('z-index', 100)
        }
    ]

    new ContextMenu(html, html.find('.lightbox-image'), menuItems);



})


//Setting to Confine Sidebar
Hooks.on("ready", () => {
    // game.settings.register("transparent-popouts", "movable-sidebar", {
    //     name: "Movable Side",
    //     hint: "Enable moving the right sidebar by clicking and dragging it.",
    //     scope: "client",
    //     config: true,
    //     default: false,
    //     type: Boolean
    // });
    game.settings.register("transparent-popouts", "extended", {
        name: "Extended Mode",
        hint: "Enter the width of your monitor in pixels (eg 1920) to set the position of the sidebar to that monitor. Also enables repositioning the sidebar by clicking and dragging. Set to 0 to disable.",
        scope: "client",
        config: true,
        default: 0,
        type: Number
    });
    let res = game.settings.get("transparent-popouts", "extended");
    if (res < 310) return;
    res = res - 310 +"px"
    $('#ui-right').css("right", "unset").css("left", res).css("position", 'absolute')

    $('#ui-right').mousedown(function(e){
        window.my_dragging = {};
        my_dragging.pageX0 = e.pageX;
        my_dragging.pageY0 = e.pageY;
        my_dragging.elem = this;
        my_dragging.offset0 = $(this).offset();
        function handle_dragging(e){
            var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
            var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
            $(my_dragging.elem)
            .offset({top: top, left: left});
        }
        function handle_mouseup(e){
            $('body')
            .off('mousemove', handle_dragging)
            .off('mouseup', handle_mouseup);
        }
        $('body')
        .on('mouseup', handle_mouseup)
        .on('mousemove', handle_dragging);
    });
})
