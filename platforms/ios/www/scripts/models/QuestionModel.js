function QuestionModel() {
    this.number;
    this.Z_PK;
    this.Z_ENT;
    this.Z_OPT;
    this.ZID;
    this.ZTESTIMAGE;
    this.ZUPDATE;
    this.ZISHTML;
    this.ZISVIDEO;
    this.ZISVIDEO_DEFAULT;
    this.ZOLDID;
    this.ZTESTBIGIMAGE;
    this.ZL;
    this.ZPOINTS;
    this.ZTHEMA;
    this.ZQZG;
    this.ZVALID1;
    this.ZVALID2;
    this.ZVALID3;
    this.ZISINPUT;
    this.ZINPUTRIGHT1 = null;
    this.ZINPUTRIGHT2 = null;
    this.ZINPUTANSWER1 = null;
    this.ZINPUTANSWER2 = null;
    this.countPlayVideo = 0;
    this.countPlayVideoText = null;
    this.textip1;
    this.textip1_1;
    this.textip1_2;
    this.textip1VN;
    this.textip1_1VN;
    this.textip1_2VN;
    this.ZPRETEXT;
    this.ZIMAGE;  
    this.ZWBMP;
    this.ZQUESTION;
    this.ZQUESTIONIMAGE;
    this.ZTIP;
    this.ZKOMENTAR;
    this.ZSETNAME;
    this.ZNOTUSED;
    this.ZTYPE;
    this.ZFRAGENKATALOG;
    this.ZBIGIMAGE;
    this.ZCOMMENTMOFFA;
    this.ZCOMMENTZ;
    this.ZTIPVN;
    this.ZQUESTIONVN;
    this.ZPRETEXTVN;
    this.ZPRETEXTTEMP;
    this.ZISPRETEXT = false;
    this.ZISIMAGE = false;
    this.ZVARIANT = false;
    this.ZVIDEOSOURCE;
    this.ANSWERINPUTSTRING1;
    this.ANSWERINPUTSTRING2;
    this.ANSWERINPUTSTRING1VN;
    this.ANSWERINPUTSTRING2VN;
    this.ANSWERINPUTSTRING1TEMP;
    this.ANSWERINPUTSTRING2TEMP;
    this.ISANSWERED = false;
    this.ANSWERRIGHT = false;
    this.ISHARD = false;
    this.ISCHECK = false;
    this.ZICON;
    this.ZQUESTIONTEMP;
    this.ZTEST = false;
    this.ZANSWER1 = null;
    this.ZANSWER1VN = null;
    this.ZANSWER = [{
        vn: {          
            ZANSWER: "",            
            ZANSWERIMAGE: ""            
        },
        de: {
            ZANSWER: "",
            ZANSWERIMAGE: "",
        },
        ZANSWER: "",
        Number: 0,
        isAnswer: false,
        isValid: null,
        isRight: false,
        checkAnswer: false,
        isImage: false
    },
    {
        vn: {
            ZANSWER: "",
            ZANSWERIMAGE: ""
        },
        de: {
            ZANSWER: "",            
            ZANSWERIMAGE: ""
        },
        ZANSWER: "",
        Number: 0,
        isAnswer: false,
        isValid: null,
        isRight: false,
        checkAnswer: false,
        isImage: false
    },
    {
        vn: {
            ZANSWER: "",
            ZANSWERIMAGE: ""
        },
        de: {
            ZANSWER: "",
            ZANSWERIMAGE: ""
        },
        ZANSWER: "",
        Number: 0,
        isAnswer: false,
        isValid: null,
        isRight: false,
        checkAnswer: false,
        isImage: false
    }];
}