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
};

//pk, ent, opt, id, testImage, update, isHtml, isVideo, oldId, testBigImage, l,
//                        points, thema, qzg, valid1, valid2, valid3, isInput, pretext, image, answer1, answer2, answer3,
//                        answer1Image, answer2Image, answer3Image, wbmp, question, questionImage, tip, kommentar, setName, notUsed, type,
//                        fragEnKatalog, bigImage, commentMoffa, commentZ