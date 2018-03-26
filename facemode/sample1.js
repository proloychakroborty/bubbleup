/*global navigator, console, document, window, DetectRTC */
/*jslint es5: true */
/*eslint no-console: ["error", { allow: ["log"] }] */

(function () {
    'use strict';
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;


    DetectRTC.load(function () {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then(function (stream) {
            var video;
            try {
                video = document.createElement('video');
                video.muted = true;
                video.src = window.URL.createObjectURL(stream);
                video.style.display = 'none';
                (document.body || document.documentElement).appendChild(video);
            } catch (e) {
                console.log(e);
            }

            DetectRTC.load(function () {
                var selectDevice = document.getElementById('webcam');
                DetectRTC.videoInputDevices.forEach(function (val) {
                    var option = document.createElement('option');
                    option.value = val.deviceId;
                    option.text = val.label;
                    selectDevice.appendChild(option);
                });

                // release camera
                stream.getTracks().forEach(function (track) {
                    track.stop();
                });

                if (video && video.parentNode) {
                    video.parentNode.removeChild(video);
                }

                onWebcam();
            });
        });
    });

    function onWebcam() {
        var selectDevice = document.getElementById('webcam'),
            videoTag = document.getElementsByTagName('video')[0],
            device = selectDevice.value,
            mediaConstraint = {};

        if (videoTag && videoTag.parentNode) {
            videoTag.parentNode.removeChild(video);
        }

        if (device) {
            mediaConstraint = {
                video: {
                    deviceId: {
                        exact: device
                    },
                    facingMode: {
                        exact: "user"
                    }
                },
                audio: false
            };
        } else {
            mediaConstraint = {
                video: {
                    facingMode: {
                        exact: "user"
                    }
                },
                audio: false
            };
        }

        navigator.mediaDevices
            .getUserMedia(mediaConstraint)
            .then(function (stream) {
                document.getElementById('type').innerHTML = 'First Try - facingMode: user';
                var video = document.createElement('video');
                video.muted = true;
                video.src = window.URL.createObjectURL(stream);
                (document.body || document.documentElement).appendChild(video);
            })
            .catch(function (error1) {
                console.log('MediaStream Error 1', error1);
                mediaConstraint.video.facingMode.exact = "environment";
                navigator.mediaDevices
                    .getUserMedia(mediaConstraint)
                    .then(function (stream) {
                        document.getElementById('type').innerHTML = 'Second Try - facingMode: environment';
                        var video = document.createElement('video');
                        video.muted = true;
                        video.src = window.URL.createObjectURL(stream);
                        (document.body || document.documentElement).appendChild(video);
                    })
                    .catch(function (error2) {
                        console.log('MediaStream Error 2', error2);
                        mediaConstraint.video = true;
                        navigator.mediaDevices
                            .getUserMedia(mediaConstraint)
                            .then(function (stream) {
                                document.getElementById('type').innerHTML = 'Third Try - no facingMode';
                                var video = document.createElement('video');
                                video.muted = true;
                                video.src = window.URL.createObjectURL(stream);
                                (document.body || document.documentElement).appendChild(video);
                            })
                            .catch(function (error3) {
                                console.log('MediaStream Error 3', error3);
                            });
                    });
            });
    }

    var selectDevice = document.getElementById('webcam');
    document.addEventListener('change', function (e) {
        onWebcam();
    });
}());
