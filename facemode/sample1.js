/*global navigator, console, document */
/*jslint es5: true */
/*eslint no-console: ["error", { allow: ["log"] }] */

(function () {
    'use strict';

    try {
        console.log('First Try - facingMode: user');
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "user"
                },
                audio: false
            })
            .then(function (stream) {
                var video = document.createElement('video');
                video.muted = true;
                video.srcObject = stream;
                (document.body || document.documentElement).appendChild(video);
            })
            .catch(function (error) {
                console.log('MediaStream Error', error);
            });
    } catch (e1) {
        try {
            console.log('Second Try - facingMode: environment');
            navigator.mediaDevices
                .getUserMedia({
                    video: {
                        facingMode: "environment"
                    },
                    audio: false
                })
                .then(function (stream) {
                    var video = document.createElement('video');
                    video.muted = true;
                    video.srcObject = stream;
                    (document.body || document.documentElement).appendChild(video);
                })
                .catch(function (error) {
                    console.log('MediaStream Error', error);
                });
        } catch (e2) {
            try {
                console.log('Second Try - no facingMode');
                navigator.mediaDevices
                    .getUserMedia({
                        video: true,
                        audio: false
                    })
                    .then(function (stream) {
                        var video = document.createElement('video');
                        video.muted = true;
                        video.srcObject = stream;
                        (document.body || document.documentElement).appendChild(video);
                    })
                    .catch(function (error) {
                        console.log('MediaStream Error', error);
                    });
            } catch (e3) {
                console.log('error');
            }
        }
    }
}());
