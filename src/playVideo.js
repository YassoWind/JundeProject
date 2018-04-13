function Play(url) {

    var videoElement = document.getElementById('trailer');




    if (url != "none") {
        videoElement.style.display = '';
    } else {
        videoElement.style.display = 'none';
    }


    // // Older browsers do not support WebGL video textures,
    // // put up a friendly error message indicating such.
    // viewer.scene.renderError.addEventListener(function() {
    //     if (!videoElement.paused) {
    //         videoElement.pause();
    //     }
    //     viewer.cesiumWidget.showErrorPanel('This browser does not support cross-origin WebGL video textures.', '', '');
    // });
}