var assetsPath = "";
var appVersion = 'pro';

if (appVersion == 'free') {
    var adsEnabled = true;
    var upgradeEnabled = true;
}
else
{
    var adsEnabled = false;
    var upgradeEnabled = false;
}

function initAds() {
    var admobid = {};
    if( /(android)/i.test(navigator.userAgent) ) { 
        admobid = { // for Android
            banner: 'ca-app-pub-7887128767743361/7828509138',
            interstitial: 'ca-app-pub-7887128767743361/9305242337'
        };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
        admobid = { // for iOS
            banner: 'ca-app-pub-7887128767743361/1921576338',
            interstitial: 'ca-app-pub-7887128767743361/3398309538'
        };
    } else {
        admobid = { // for Windows Phone
            banner: 'ca-app-pub-7887128767743361/1921576338',
            interstitial: 'ca-app-pub-7887128767743361/3398309538'
        };
    }
    if (AdMob) {
        AdMob.createBanner({
            adId : admobid.banner,
            position : AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow : true
        });
    }
}

function downloadAssets() {
    var storage = window.localStorage;
    var value = storage.getItem("assets_downloaded");
    if (value != "done") {
        var fileTransfer = new FileTransfer();
        var uri = encodeURI("http://thilaixe.de/assets.zip");
        var targetPath = cordova.file.externalDataDirectory + "/assets.zip";
        var targetDir = cordova.file.externalDataDirectory + "/fahrschul";

        fileTransfer.download(
            uri,
            targetPath,
            function(entry) {
                console.log("Download complete: " + entry.fullPath);
                cordova.plugin.pDialog.dismiss();
                cordova.plugin.pDialog.init({
                    progressStyle : 'SPINNER',
                    cancelable : false,
                    title : 'Please Wait',
                    message : 'Unzipping files...'
                });  
                zip.unzip(targetPath, targetDir, unzipCallback, unzipProgressCallback);
            },
            function(error) {
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("upload error code" + error.code);
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );

        var unzipProgressCallback = function(progressEvent) {
            console.log("Unzip: " +  Math.round((progressEvent.loaded / progressEvent.total) * 100));
            cordova.plugin.pDialog.setProgress( Math.round((progressEvent.loaded / progressEvent.total) * 100) );
        };

        var unzipCallback = function() {
            storage.setItem("assets_downloaded", "done");
            cordova.plugin.pDialog.dismiss();
        };

        cordova.plugin.pDialog.init({progressStyle : 'HORIZONTAL', title: 'Please Wait', message : 'Downloading data...', cancelable : false});

        fileTransfer.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                var currentProgress = Math.round(progressEvent.loaded / progressEvent.total * 100);
                cordova.plugin.pDialog.setProgress(currentProgress);
            } else {
                // loadingStatus.increment();
            }
        };
    }
}