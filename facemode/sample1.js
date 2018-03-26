/*global navigator, console, document, alert */
/*jslint es5: true */
/*eslint no-console: ["error", { allow: ["log"] }] */

(function () {
    'use strict';

    try {
        alert('First Try - facingMode: user');
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
            alert('Second Try - facingMode: environment');
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
                alert('Second Try - no facingMode');
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
