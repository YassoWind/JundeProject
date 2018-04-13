function control() {
    var scene = viewer.scene;
    var canvas = viewer.canvas;
    canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
    canvas.onclick = function() {
        canvas.focus();
    };
    var ellipsoid = viewer.scene.globe.ellipsoid;



    scene.screenSpaceCameraController.enableLook = false;

    var startMousePosition;
    var mousePosition;
    var flags = {
        looking: false,
        moveForward: false,
        moveBackward: false,
        moveUp: false,
        moveDown: false,
        moveLeft: false,
        moveRight: false
    };

    var handler = new Cesium.ScreenSpaceEventHandler(canvas);



    function getFlagForKeyCode(keyCode) {
        switch (keyCode) {
            case 'W'.charCodeAt(0):
                return 'moveForward';
            case 'S'.charCodeAt(0):
                return 'moveBackward';
            case 'Q'.charCodeAt(0):
                return 'moveUp';
            case 'E'.charCodeAt(0):
                return 'moveDown';
            case 'D'.charCodeAt(0):
                return 'moveRight';
            case 'A'.charCodeAt(0):
                return 'moveLeft';
            default:
                return undefined;
        }
    }

    document.addEventListener('keydown', function(e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = true;
        }
    }, false);

    document.addEventListener('keyup', function(e) {
        var flagName = getFlagForKeyCode(e.keyCode);
        if (typeof flagName !== 'undefined') {
            flags[flagName] = false;
        }
    }, false);

    viewer.clock.onTick.addEventListener(function(clock) {
        var camera = viewer.camera;

        if (flags.looking) {
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;

            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
            var x = (mousePosition.x - startMousePosition.x) / width;
            var y = -(mousePosition.y - startMousePosition.y) / height;


            var lookFactor = 0.05;
            camera.moveForward(x);

            // camera.lookRight(x * lookFactor);
            // camera.lookUp(y * lookFactor);
        }

        // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
        var moveRate = cameraHeight / 10.0;

        if (flags.moveForward) {
            camera.moveForward(moveRate);
        }
        if (flags.moveBackward) {
            camera.moveBackward(moveRate);
        }
        if (flags.moveUp) {
            camera.moveUp(moveRate);
        }
        if (flags.moveDown) {
            camera.moveDown(moveRate);
        }
        if (flags.moveLeft) {
            camera.moveLeft(moveRate);
        }
        if (flags.moveRight) {
            camera.moveRight(moveRate);
        }
    });
}