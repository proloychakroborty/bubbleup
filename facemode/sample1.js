/*global navigator, console, document */
/*jslint es5: true */
/*eslint no-console: ["error", { allow: ["log"] }] */

(function () {
    'use strict';
    var type = document.getElementById('type');

    navigator.mediaDevices
        .getUserMedia({
            video: {
                facingMode: {
                    exact: "user"
                }
            },
            audio: false
        })
        .then(function (stream) {
            type.innerHTML = 'First Try - facingMode: user';
            var video = document.createElement('video');
            video.muted = true;
            video.srcObject = stream;
            (document.body || document.documentElement).appendChild(video);
        })
        .catch(function (error1) {
            console.log('MediaStream Error 1', error1);
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode: {
                            exact: "environment"
                        }
                    },
                    audio: false
                })
                .then(function (stream) {
                    type.innerHTML = 'Second Try - facingMode: environment';
                    var video = document.createElement('video');
                    video.muted = true;
                    video.srcObject = stream;
                    (document.body || document.documentElement).appendChild(video);
                })
                .catch(function (error2) {
                    console.log('MediaStream Error 2', error2);
                    navigator.mediaDevices
                        .getUserMedia({
                            video: true,
                            audio: false
                        })
                        .then(function (stream) {
                            type.innerHTML = 'Second Try - no facingMode';
                            var video = document.createElement('video');
                            video.muted = true;
                            video.srcObject = stream;
                            (document.body || document.documentElement).appendChild(video);
                        })
                        .catch(function (error3) {
                            console.log('MediaStream Error 3', error3);
                        });
                });
        });
}());
