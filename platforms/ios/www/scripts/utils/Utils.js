function Utils($http) {
    this.linkDefault = "http://thilaixe.de";
    Utils.prototype.convertText = function (text) {
        var x = text;
        var r = /\\u([\d\w]{4})/gi;
        x = x.replace(r, function (match, grp) {
            return String.fromCharCode(parseInt(grp, 16));
        });
        x = unescape(x);
        return x;
    };

    Utils.prototype.randomQuestion =  function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function callService(callBack, method, url, data, header, param) {
        if (url) {
            //header['Content-Type'] = 'application/json; charset=utf-8';
            var configObject = {
                url: url,
                headers: {
                    'Content-Type': 'application/json;'
                }
            };
            if (method) {
                configObject.method = method;
            } else {// default method = GET
                configObject.method = GET;
            }
            if (data) {
                configObject.data = data;
            }
            if (param) {
                configObject.params = param;
            }
            configObject.timeout = 60000; // 1min
            configObject.responseType = "json";
            // call 
            $http(configObject).success(function (data, status, headers, config, statusText) {
                console.log("http success " + status);
                var obj = new Object();
                var success = parseInt(data.d);
                if (success > 0) {
                    obj.number = 10;
                }
                else {
                    switch (data.d) {
                        case "-1":
                            obj.number = 9;
                            break;
                        case "-2":
                            obj.number = 8;
                            break;
                        case "-3":
                            obj.number = 7;
                            break;
                    }
                }                        
                if (callBack) callBack(true, status, obj);
            }).error(function (data, status, headers, config, statusText) {
                console.log("http fail " + status);
                var obj = new Object();
                obj.number = 11;
                if (callBack) callBack(true, status, obj);
            });
        } else {
            console.error("Http call must contain a url");
        }
    };



    // User
    Utils.prototype.authenticateUser = function (callBack, inputUserName, inputPassword) {
        var data = '{"Username": "' + inputUserName + '","Password": "' + inputPassword + '"}';

        var callBackHandle = function (isSuccess, code, data) {
            if (isSuccess) {                           
                callBack(isSuccess, code, data);
            } else {
                callBack(isSuccess, code, null);
            }
        }
        callService(callBackHandle, "POST", this.linkDefault, data, $http.defaults.headers);
    }
};

//pk, ent, opt, id, testImage, update, isHtml, isVideo, oldId, testBigImage, l,
//                        points, thema, qzg, valid1, valid2, valid3, isInput, pretext, image, answer1, answer2, answer3,
//                        answer1Image, answer2Image, answer3Image, wbmp, question, questionImage, tip, kommentar, setName, notUsed, type,
//                        fragEnKatalog, bigImage, commentMoffa, commentZ