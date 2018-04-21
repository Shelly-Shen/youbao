/************************************************************************/
/*                                  翻页js                              */
/************************************************************************/
//searchStr是用来记录搜索时的条件字符串的，生产格式如下：“&name=abc&id=1&pid=8”;
function _redireactPage(toPageNo, pageNo, uri, searchStr) {
    var topage = 1;
    if (typeof toPageNo == "string") {
        try {
            toPageNo = parseInt(toPageNo);
        } catch (_e) {}
    }
    if (typeof(toPageNo) != "number" || toPageNo < 1) topage = 1;
    else topage = toPageNo;

    try {
        if (searchStr != "null" && searchStr.length > 0) {
            window.location = uri + "?pageNo=" + topage + searchStr;
        } else {
            window.location = uri + "?pageNo=" + topage;
        }
    } catch (e) {
        window.location = uri + "?pageNo=1";
    }
}


/**
 * 将ajax内容装入jquery selector
 *
 * @param url
 * @param $target
 * @param type
 *            0 装载内容 1 替换内容
 * @return
 */
function _renderUrl(url, selector, type, fn) {
    $(selector).html(
        '<img src="/images/loading.gif" />');
    $.ajax({
        url: url,
        cache: false,
        success: function(html) {
            if (html == "0") { //
                alert("您访问的页面已经不存在。");
                return;
            }
            if (!type || type == 0) {
                $(selector).empty().append(html);
            } else
                $(selector).replaceWith(html);

            if (fn) {
                fn();
            }
        },
        error: function() {
            alert("您访问的页面出错，请稍后再试。");
        }
    });
}

//searchStr是用来记录搜索时的条件字符串的，生产格式如下：“&name=abc&id=1&pid=8”;
function _tunePage(toPageNo, pageNo, uri, selector, searchStr) {
    var topage = 1;
    if (typeof toPageNo == "string") {
        try {
            toPageNo = parseInt(toPageNo);
        } catch (_e) {}
    }
    if (typeof(toPageNo) != "number" || toPageNo < 1) topage = 1;
    else topage = toPageNo;

    try {
        if ("" != selector) {
            if (searchStr != "null" && searchStr.length > 0) {
                _renderUrl(uri + "?pageNo=" + topage + searchStr, selector, 0);
            } else {
                _renderUrl(uri + "?pageNo=" + topage, selector, 0);
            }
        } else {
            window.location = uri + "?pageNo=" + topage + searchStr;
        }
    } catch (e) {
        // window.location = window.location.pathname + window.location.search;
        _renderUrl(uri + "?pageNo=", selector, 0);
    }
}


/************************************************************************/
// /*                          通用交互js方法                              */========================================================================================
/************************************************************************/
var thisDom;
var winHeight;
var winWidth;
var docHeight;
var docWidth;
var winScrollTop;
var usercenterLeftTop;
var lookAtLeftTop;
var rankNavTop;
var smallTopicBoxTop;
var homepageTopicLabelTop;
var domain = 'http://imageqiniu.xxxxxbbs.com/'; //图片服务器域名
var vdomain = 'http://videoqiniu.xxxxxbbs.com/'; //视频服务器域名
var imgCommentCount = 0;
// 判断设备类型
var browser = {
        versions: function() {
            var u = navigator.userAgent;
            return { //移动终端浏览器版本信息   
                trident: u.indexOf('Trident') > -1, //IE内核  
                presto: u.indexOf('Presto') > -1, //opera内核  
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核  
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核  
                android: u.indexOf('Android') > -1, //|| u.indexOf('Linux') > -1, //android终端或者uc浏览器  
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器  
                iPad: u.indexOf('iPad') > -1, //是否iPad    
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部  
                ie10: u.indexOf('MSIE') > -1,
                ie11: u.indexOf('rv:11') > -1
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
    //m和pc的跳转
var threadURL = window.location.href;
var threadID = parseInt(threadURL.match(/\d+(\.\d+)?/g));
var prefix = 'http://www.xxxxxbbs.com/thread/';
var prefix1 = 'http://www.xxxxxbbs.com/small/topic/list/';
var indexFix = 'xxxxxbbs.com/index';
var isThreadInfo = (threadURL.slice(0, prefix.length) == prefix);
var isSmallTopic = (threadURL.slice(0, prefix1.length) == prefix1);
if (threadURL == "http://www.xxxxxbbs.com/index") {
    var expdate = new Date(); //初始化时间
    expdate.setTime(expdate.getTime() + 60 * 1000 * 60 * 24); //时间
    document.cookie = "autoTurn=true;expires=" + expdate.toGMTString() + ";path=/";
}
if (browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
    if (threadURL.indexOf("pc=1") < 0 && document.cookie.indexOf("autoTurn=false") < 0) {
        if (isThreadInfo) {
            window.location.href = "http://m.xxxxxbbs.com/th/info?id=" + threadID;
        } else if (isSmallTopic) {
            window.location.href = "http://m.xxxxxbbs.com/sth/info?id=" + threadID;
        } else if (threadURL.indexOf(indexFix) >= 0) {
            window.location.href = "http://m.xxxxxbbs.com/index";
        }
    } else {
        var expdate = new Date(); //初始化时间
        expdate.setTime(expdate.getTime() + 60 * 1000 * 60 * 24); //时间
        document.cookie = "autoTurn=false;expires=" + expdate.toGMTString() + ";path=/";
    }
}

//自动创建超链接
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记 
}
var t = [];

function linkAutoCreate(thisArea) {
    //新产品外露图片url
    var regMedia = /\[((http|ftp|https).*?)\]/g;
    var s = thisArea.html();
    var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&amp;|-)+)/g;
    //var re = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;   
    s = s.replace(regMedia, '');
    s = s.replace(re, "<a href='$1$2' target='_blank'>$1$2</a>");
    thisArea.html(s);
    var reg = /\[URL=(.[^\[]*)\](.*?)\[\/URL\]/ig;
    thisArea.find("a").each(function(index, element) {
        var html = thisArea.html();
        //html=html.replace("&nbsp;","");
        html = html.replace("&amp;", "&");
        thisArea.html(html);
        thisArea.attr("href", html);
    });

    var s1 = thisArea.html();
    s1 = s1.replace(reg, function($1) {
        var v1 = delHtmlTag($1);
        v1 = v1.replace(reg, function($1, $2) {
            var v2 = delHtmlTag($1);
            var vv = $1;
            if (t.indexOf(vv) < 0) {
                v2 = v2.replace(reg, "<A HREF=$1 TARGET='_blank' class='toBuy'>$2</A>");
            } else {
                v2 = v2.replace(reg, "$2");
            }
            t.push($1);
            return v2;
        });
        return v1;
    });
    thisArea.html(s1);

}
//图片加载
function imgLoad() {
    $(".onload-img").load(function() {
        $(this).prev('.loading-img').fadeOut(200, function() {
            $(this).next('.onload-img').fadeIn(200);
            $(this).remove();
        });
    });
}
//侧边栏定位
function sideBar() {
    var bodyHeight = $("body").height();
    winHeight = $(window).height();
    winWidth = $(window).width();
    winScrollTop = $(document).scrollTop();
    if (winScrollTop >= bodyHeight - winHeight - 236) { //侧边栏定位
        $(".side-bar").css("bottom", winHeight + winScrollTop + 256 - bodyHeight);
    } else {
        $(".side-bar").css("bottom", "20px");
    }
    if (winScrollTop > 0) { //显示-隐藏滚动到顶部按钮
        $(".side-bar").find('.go-top').removeClass('go-top-hidden');
    } else {
        $(".side-bar").find('.go-top').addClass('go-top-hidden');
    }
    if (winWidth <= 1170) { //窗口宽度变化侧栏水平位置
        $(".side-bar,.side-pub-thread").css({
            "opacity": "0.5",
            "right": "0px"
        });
        $(".side-bar,.side-pub-thread").mouseenter(function(event) {
            $(this).css("opacity", "1");
        });
        $(".side-bar,.side-pub-thread").mouseleave(function(event) {
            $(this).css("opacity", "0.5");
        });
    } else {
        $(".side-bar,.side-pub-thread").css({
            "opacity": "1",
            "right": "auto"
        });
        $(".side-bar,.side-pub-thread").mouseenter(function(event) {
            $(this).css("opacity", "1");
        });
        $(".side-bar,.side-pub-thread").mouseleave(function(event) {
            $(this).css("opacity", "1");
        });
    }
}
//站内信息推送
function remind() {
    var isUserCenter;
    if ((window.location.href).indexOf(/center/) >= 0) {
        isUserCenter = true;
    } else {
        isUserCenter = false;
    }
    $.ajax({
        type: 'GET',
        url: '/userremind',
        success: function(data) {
            if (null != data && 0 != data.length) {
                //推送消息总数 
                if ((data.remind.newmessagesystemcount + data.remind.newmessagereceivedcount + data.remind.newcommentcount + data.remind.newpraisecount + data.remind.newfinscount + parseInt(data.noticeNum)) > 0) {
                    var totalNum = parseInt(data.remind.newmessagesystemcount) + parseInt(data.remind.newmessagereceivedcount) + parseInt(data.remind.newcommentcount) + parseInt(data.remind.newpraisecount) + parseInt(data.remind.newfinscount) + parseInt(data.noticeNum);
                    if (totalNum > 99) {
                        totalNum = "99+"
                    }
                    $("#header").find('.header-username span').append('<b style="position: absolute; height: 9px;width: 9px;display: block; right: 3px;top: 6px;background: #ff0000;border-radius: 50%;"></b>');
                    //  $("#header").find('.remind-light').css("top","12px");
                    // 消息中心总数
                    if ((data.remind.newmessagesystemcount + data.remind.newmessagereceivedcount + data.remind.newcommentcount + data.remind.newpraisecount + parseInt(data.noticeNum)) > 0) {
                        var infoNum = parseInt(data.remind.newmessagesystemcount) + parseInt(data.remind.newmessagereceivedcount) + parseInt(data.remind.newcommentcount) + parseInt(data.remind.newpraisecount) + parseInt(data.noticeNum);
                        $("#header").find('.user-info-list .list-info').append('<i class="remind-light">' + infoNum + '</i>');
                        if (isUserCenter == true) {
                            $(".usercenter-left").find('.nav-info').append('<i class="remind-light">' + infoNum + '</i>');
                        }
                        if (0 < data.remind.newmessagesystemcount + parseInt(data.noticeNum)) {
                            var sysCount = data.remind.newmessagesystemcount + parseInt(data.noticeNum);
                            if (sysCount > 99) {
                                sysCount = '99+';
                            }
                            $('.info-sysinfo').append('<i class="remind-light">' + sysCount + '</i>');
                            if(0 < parseInt(data.noticeNum)&&$('#messageType').val()!=undefined&&$('#messageType').val()!=1){
                            	$('.notice-message').append('<i class="red"></i>');
                            }
                        }
                        if (0 < data.remind.newmessagereceivedcount) {
                            var privateCount = data.remind.newmessagereceivedcount;
                            if (privateCount > 99) {
                                privateCount = '99+';
                            }
                            $('.info-private').append('<i class="remind-light">' + privateCount + '</i>');
                        }
                        if (0 < data.remind.newcommentcount) {
                            var commentCount = data.remind.newcommentcount;
                            if (commentCount > 99) {
                                commentCount = '99+';
                            }
                            $('.info-comment').append('<i class="remind-light">' + commentCount + '</i>');
                        }
                        if (0 < data.remind.newpraisecount) {
                            var praiseCount = data.remind.newpraisecount;
                            if (praiseCount > 99) {
                                praiseCount = '99+';
                            }
                            $('.info-praise').append('<i class="remind-light">' + praiseCount + '</i>');
                        }
                    }
                    //粉丝数
                    if (0 < data.remind.newfinscount) {
                        var fansCount = data.remind.newfinscount;
                        if (fansCount > 99) {
                            fansCount = '99+';
                        }
                        $("#header").find('.user-info-list .friend-info').append('<i class="remind-light">' + fansCount + '</i>');
                        if (isUserCenter == true) {
                            $(".usercenter-left").find('.nav-friend').append('<i class="remind-light">' + fansCount + '</i>');
                        }
                    }
                }
            }
        }
    });
}

//搜索关键字
function searchkey(obj) {
    var regs = new RegExp("\\(", "g");
    var regs1 = new RegExp("\\)", "g");
    var key001 = $.trim(obj.val());
    key001 = key001.replace(regs, "（");
    key001 = key001.replace(regs1, "）");
    //将搜索记录写入cookie；
    var originalCookie = document.cookie;
    var reg = /(keywords\()(.*)(\))/g;
    var newKeyWords = key001;
    newKeyWords = encodeURI(newKeyWords); //对中文关键字编码
    var keyWords = originalCookie.match(reg);
    if (keyWords == null || keyWords == "") {
        keyWords = newKeyWords;
    } else {
        keyWords = keyWords.toString();
        keyWords = keyWords.replace("keywords(", "");
        keyWords = keyWords.replace(")", "");
        keyWords = keyWords.split(',');
        for (var i = 0; i < keyWords.length; i++) {
            if (keyWords[i] == encodeURI(key001)) {
                keyWords.splice(i, 1);
            }
        }
        keyWords = keyWords.toString();
        //var regKey = new RegExp(key001+',',"g");
        //keyWords=keyWords.replace(regKey,""); 
        keyWords = keyWords + "," + newKeyWords;
    }
    var expdate = new Date(); //初始化时间
    expdate.setTime(expdate.getTime() + 1000 * 60 * 60 * 24 * 7); //时间
    document.cookie = "keywords(" + keyWords + ");expires=" + expdate.toGMTString() + ";path=/";
    //跳转到搜索页
    if (!($.trim(key001).length != 0 && key001 != "搜索帖子、用户")) {
        key001 = $("#keyword002").val();
    }
    if ($.trim(key001).length != 0 && key001 != "搜索帖子、用户") {
        window.location.href = "/search/index?keyword=" + key001;
    }
}
//读取cookie中的搜索历史纪录
function searchHistory() {
    var originalCookie = document.cookie;
    var reg = /(keywords\()(.*)(\))/g;
    var keyWords = originalCookie.match(reg);
    if (keyWords != null) {
        keyWords = keyWords.toString();
        keyWords = keyWords.replace("keywords(", "");
        keyWords = keyWords.replace(")", "");
        keyWords = keyWords.split(",");
        if (keyWords.length > 0) {
            var j = 0;
            if (keyWords.length > 10) {
                j = keyWords.length - 10;
            }
            for (var i = j; i < keyWords.length; i++) {
                if (keyWords[i] != "") {
                    $(".search-record").find('ul').prepend('<li><a href="javascript:;"><i></i><em>' + decodeURI(keyWords[i]) + '</em></a></li>');
                }
            }
        }
    }
}
//页脚始终置于底部的方法
function footerBottom() {
    winHeight = parseInt($(window).height());
    winWidth = parseInt($(window).width());
    docHeight = parseInt($("body").height());
    docWidth = parseInt($("body").width());
    winScrollTop = parseInt($(document).scrollTop());
    if (winHeight > docHeight) {
        $("#container").css({
            "min-height": winHeight - 388 + "px",
            //"min-height":"720px"
        });
        //$(".interest-list").css("height",winHeight-388+"px");
    }
}
//定义选题标签颜色
function topicColor() {
    $(".topic-lab").each(function(index, element) {
        var topicId = $(this).attr("topicid");
        if (topicId == "3") {
            $(this).css("background", "#2e4b6b");
            return;
        }
        if (topicId == "2") {
            $(this).css("background", "#ff68c8");
            return;
        }
        if (topicId == "6") {
            $(this).css("background", "#3eb7c9");
            return;
        }
        if (topicId == "10") {
            $(this).css("background", "#729c5c");
            return;
        }
        if (topicId == "9") {
            $(this).css("background", "#343434");
            return;
        }
        if (topicId == "4") {
            $(this).css("background", "#ef2f2f");
            return;
        }
        if (topicId == "8") {
            $(this).css("background", "#85a5c7");
            return;
        }
        if (topicId == "最爱慢镜头") {
            $(this).css("background", "#d07721");
            return;
        }
        if (topicId == "7") {
            $(this).css("background", "#d6c23b");
            return;
        }
        if (topicId == "1") {
            $(this).css("background", "#8badb7");
            return;
        }
        if (topicId == "13") {
            $(this).css("background", "#fe6e00");
            return;
        }
        if (topicId == "11") {
            $(this).css("background", "#67a7a6");
            return;
        }
        if (topicId == "12") {
            $(this).css("background", "#676767");
            return;
        }
        if (topicId == "14") {
            $(this).css("background", "#c37a1b");
            return;
        }
        if (topicId == "15") {
            $(this).css("background", "#2175d0");
            return;
        }
        if (topicId == "16") {
            $(this).css("background", "#319892");
            return;
        }
    });
}
//字数判定方法
function charCount(len, v) {
    thisValue = thisDom.val();
    len = 0;
    v = $.trim(thisValue);
    for (i = 0; i < v.length; i++) {
        if (v.charCodeAt(i) > 256) {
            len += 2;
        } else {
            len++;
        }
    }
    thisLength = len;
}
//计数转换
function countFormat(thisCount) {
    thisCount = thisCount.toString();
    if (thisCount.length > 4) {
        var startCut = 0;
        var cutLength = thisCount.length - 4;
        var wan;
        var qian;
        wan = thisCount.substr(startCut, cutLength);
        qian = thisCount.substr(thisCount.length - 4, 1);
        if (qian > 0) {
            thisCount = wan + '.' + qian + '万';
        } else {
            thisCount = wan + '万';
        }
    }
    return thisCount;
}
//自定义弹出对话框
function dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok) {
    var html = '<div class="dialog-layer">' +
        '<div id="dialog">' +
        '<p></p>' +
        '<div class="button-box"><a href="javascript:;" class="cancel">取消</a> <a href="javascript:;" class="confirm"></a></div>' +
        '</div>' +
        '</div>';
    $('body').prepend(html);
    $('body').addClass('body-overlay');
    $(".dialog-layer").fadeIn(200);
    $("#dialog").find('p').text(content);
    $("#dialog").find('.confirm').text(confirmText);
    $("#dialog").find('.confirm').css({
        'background': confirmBackground,
        'border-color': confirmBackground
    });
    $("#dialog").find('.cancel').css('display', cancelDisplay);
    $("#dialog").css({
        'top': dialogTop + 'px'
    });
    $("body").off("click", "#dialog .confirm").on("click", "#dialog .confirm", function(event) {
        $(".dialog-layer").fadeOut(200, function() {
            if ($('#overlay').length <= 0) {
                if ($(".sort-layer").length > 0) {
                    if ($(".sort-layer").is(":hidden")) {
                        $('body').removeClass('body-overlay');
                    }
                } else {
                    $('body').removeClass('body-overlay');
                }
            }
            $(".dialog-layer").remove();
            ok();
        });
    });
    $("body").off("click", "#dialog .cancel").on("click", "#dialog .cancel", function(event) {
        $(".dialog-layer").fadeOut(200, function() {
            if ($('#overlay').length <= 0) {
                if ($(".sort-layer").length > 0) {
                    if ($(".sort-layer").is(":hidden")) {
                        $('body').removeClass('body-overlay');
                    }
                } else {
                    $('body').removeClass('body-overlay');
                }
            }
            $(".dialog-layer").remove();
            //激活发帖自动保存
            if ($("#page").val() == "thread-input" || $("#page").val() == "thread-update") {
                autoSave = setInterval(function() {
                    autoSaveFun();
                }, 3000);
            }
        });
    });
}
//提交内容过滤    
var htmlRegLeft = new RegExp("<", "gi");
var htmlRegRight = new RegExp(">", "gi");

function submitFilter() {
    $("textarea").each(function(index, el) {
        var inputValue = $(this).val();
        // inputValue=inputValue.replace(htmlRegLeft,"&lt;");
        // inputValue=inputValue.replace(htmlRegRight,"&gt;");
        //var spaceReg= /^\s*$/;
        //if(spaceReg.test(inputValue)){
        // inputValue=inputValue.replace(/&nbsp;/ig, ""); 
        if ($("#page").val() == "") {
            inputValue = inputValue.replace(/\s*$/g, "");
        } else {
            inputValue = inputValue.replace(/(^\s*)|(\s*$)/g, "");
        }
        //}
        $(this).val(inputValue);
    });
    $("input[type=text]").each(function(index, el) {
        var inputValue = $(this).val();
        // inputValue=inputValue.replace(htmlRegLeft,"&lt;");
        // inputValue=inputValue.replace(htmlRegRight,"&gt;");
        // inputValue=inputValue.replace(/&nbsp;/ig, ""); 
        // inputValue=inputValue.replace(/\s/ig, "");  
        $(this).val(inputValue);
    });
}
//输入字数限制
function commentCount(charLen) {
    charCount();
    var charLength = Math.round(thisLength / 2);
    if (thisLength > charLen && thisLength != 0) {
        thisDom.next(".button-box").find('.char-limit em').text('已超出');
        thisDom.next(".button-box").find('.char-limit i').text(Math.abs(charLen / 2 - charLength));
        thisDom.next(".button-box").find('.char-limit i').css('color', '#e24343');
        thisDom.next(".button-box").find('.char-limit b').text('字');
        thisDom.addClass('textarea-error');
    } else {
        thisDom.next(".button-box").find('.char-limit em').text('还可以输入');
        thisDom.next(".button-box").find('.char-limit i').text(charLen / 2 - charLength);
        thisDom.next(".button-box").find('.char-limit i').css('color', '#2175d0');
        thisDom.next(".button-box").find('.char-limit b').text('字');
        thisDom.removeClass('textarea-error');
    }
}
//禁言对话框提示
function forbiddenAlert() {
    content = '您好，您尚未登录或账号处于禁言状态，无法进行此操作。';
    dialogTop = 200;
    confirmText = '确定';
    confirmBackground = "#e97171";
    cancelDisplay = 'none';
    ok = function() {
        return false;
    };
    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
}
//赞
function praise() {
    //判断是否已登录先
    //请求后台赞
    var threadId = thisDom.attr('threadid');
    $.ajax({
        type: 'GET',
        url: '/thread/praise',
        data: {
            threadId: threadId
        },
        success: function(result) {
            if (result.status == 666) {
                forbiddenAlert();
            }
            var code = parseInt(result);
            switch (code) {
                case 4: //点赞成功
                    thisDom.prepend('<div class="add-one">+1</div>');
                    $(".add-one").fadeIn(500, function() {
                        $(this).fadeOut(500, function() {
                            $(this).remove();
                            var originalText = parseInt($(".praise-btn").find('em').text());
                            originalText++;
                            $(".praise-btn").find('em').text(originalText);
                        });
                    });
                    break;
                case 1:
                    content = '您还没有登录，无法点赞。';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case 2:
                    content = '您已经赞过此帖。';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                    //其他错误就不给提示了，直接没反应
            }
        }
    });
}
//顶
function up() {
    var commentId = thisDom.attr("commentid");
    var upCount = parseInt(thisDom.find('em').text());
    $.ajax({
        type: 'GET',
        url: '/thread/comment/' + commentId + "/top",
        success: function(result) {
            if (result.status == 666) {
                forbiddenAlert();
            }
            var code = parseInt(result);
            switch (code) {
                case 4:
                    thisDom.prepend('<b class="add-one">+1</b>');
                    thisDom.find('.add-one').fadeIn(500,
                        function() {
                            thisDom.find('.add-one').fadeOut(500,
                                function() {
                                    thisDom.find('.add-one').remove();
                                    upCount = upCount + 1;
                                    thisDom.find('em').text(upCount);
                                    checkTopStatus();
                                });
                        });
                    break;
                case 5:
                    thisDom.prepend('<b class="add-one">+10</b>');
                    thisDom.find('.add-one').fadeIn(500,
                        function() {
                            thisDom.find('.add-one').fadeOut(500,
                                function() {
                                    thisDom.find('.add-one').remove();
                                    upCount = upCount + 10;
                                    thisDom.find('em').text(upCount);
                                    checkTopStatus();
                                });
                        });
                    break;
                case 1:
                    break;
                case 2:
                    content = '您已经顶过该条评论。';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case -1:
                    content = '您已被对方拉黑，不可顶对方的评论。';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                    //其他错误就不给提示了，直接没反应
            }
        }
    });
}
//举报
function openReport(threadid, commentid, userid, typeid) { //打开举报层
    threadid = thisDom.attr('threadid');
    commentid = thisDom.attr('commentid');
    userid = thisDom.attr('userid');
    typeid = thisDom.attr('type');
    var reportHtml = '<div id="overlay" class="report-overlay"  threadid="' + threadid + '" commentid="' + commentid + '" userid="' + userid + '" type="' + typeid + '">' +
        '<div class="report">' +
        '<h3>' +
        '举报' +
        '<a href="javascript:;" class="close-report">×</a>' +
        '</h3>' +
        '<div class="report-box">' +
        '<h4>请选择举报原因：<span>必选</span></h4>' +
        '<table>  ' +
        '<tr>' +
        '<td><input type="radio" name="reason" id="renshengongji" value="人身攻击" /><label for="renshengongji">人身攻击</label></td>' +
        '<td><input type="radio" name="reason" id="seqing" value="色情低俗" /><label for="seqing">色情低俗</label></td>' +
        '<td><input type="radio" name="reason" id="guanggao" value="广告骚扰" /><label for="guanggao">广告骚扰</label></td>' +
        '<td><input type="radio" name="reason" id="zhengzhi" value="政治敏感" /><label for="zhengzhi">政治敏感</label></td>' +
        '</tr>' +
        '<tr>' +
        '<td><input type="radio" name="reason" id="yaoyan" value="谣言" /><label for="yaoyan">谣言</label></td>' +
        '<td><input type="radio" name="reason" id="zhapian" value="诈骗"/><label for="zhapian">诈骗</label></td>' +
        '<td><input type="radio" name="reason" id="qita" value="其它" /><label for="qita">其它</label></td>' +
        '</tr>' +
        '</table>' +
        '<h4>请输入补充说明：</h4>' +
        '<textarea placeholder="再次输入补充说明"></textarea>' +
        '<a href="javascript:;" id="pub-report" class="blue-button">确认提交</a>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("#header").before(reportHtml);
    $("body").addClass('body-overlay');
    $(".report-overlay").fadeIn(200);
    $("body").on('click', '.close-report,.success-close,.report-overlay', function(event) {
        $(".report-overlay").fadeOut(200, function() {
            $(".report-overlay").remove();
            if ($("div#overlay").length <= 0) {
                $('body').removeClass('body-overlay');
            }
        });
    });
    ESCClose('report-overlay', 'report');
    $("body").on('click', '#pub-report', function(event) {
        reportAjax();
    });
}

function reportAjax(reason, addoptionreason, uid, typeid, tid) { //提交举报
    typeid = $(".report-overlay").attr('type');
    if (typeid == 2 || typeid == 3) {
        tid = $(".report-overlay").attr('commentid');
    } else if (typeid == 1) {
        tid = $(".report-overlay").attr('threadid');
    } else if (typeid == 4) {
        tid = $(".report-overlay").attr('userid');
    }
    uid = $(".report-overlay").attr('userid');
    reason = $.trim($(".report-overlay").find("input[name=reason]:checked").val());
    addoptionreason = $.trim($(".report-overlay").find("textarea").val());
    if (reason == "") {
        content = '请输入举报原因';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#e97171";
        cancelDisplay = 'none';
        ok = function() {
            return false;
        };
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/user/report',
        data: {
            "re": reason + ":" + addoptionreason,
            "uid": uid,
            "te": typeid,
            "tid": tid
        },
        success: function(result) {
            if (result.status == 666) {
                forbiddenAlert();
            } else if (result.status == 200) {
                $(".report-box").after('<div class="report-success"><h1>您的举报信息已提交成功</h1><a href="javascript:;"" class="success-close blue-button">确定</a></div>');
                $(".report-box").remove();
            } else if (result.status == 601) {
                content = '请您登录后再提交举报信息';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    window.location.reload();
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            }
        },
        error: function() {
            content = '提交失败。';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        }
    });
}
//加入/取消收藏
function myFavorite(threadId) {
    threadId = thisDom.attr('threadid');
    var type = thisDom.attr('type');
    $.ajax({
        type: 'GET',
        url: '/thread/favorite',
        data: {
            'threadId': threadId,
            'type': type
        },
        success: function(data) {
            if ((window.location.href).indexOf("/center/favorite") >= 0) {
                window.location.reload();
                return;
            }
            if (type == 1) {
                content = '收藏成功！';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#2175d0";
                cancelDisplay = 'none';
                var count = parseInt(thisDom.find('em').text());
                count = count + 1;
                ok = function() {
                    thisDom.after('<a href="javascript:;" class="has-favorite" threadid="' + threadId + '" type="2" title="取消收藏"><i></i><em>' + count + '</em></a>');
                    thisDom.remove();
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            } else if (type == 2) {
                var count = parseInt(thisDom.find('em').text());
                count = count - 1;
                if (count < 0) {
                    count = 0;
                }
                thisDom.after('<a href="javascript:;" class="add-favorite" threadid="' + threadId + '" type="1" title="加入收藏"><i></i><em>' + count + '</em></a>');
                thisDom.remove();
            }
        },
        error: function() {
            content = '操作失败，请检查您的网络状态是否正常。';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        }
    });
}
//回复等图片加载方法
function uploadReplyImg(pickfiles) {
    var replyUploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: pickfiles,
        filters: {
            mime_types: [ //只允许上传图片
                {
                    title: "Image files",
                    extensions: "jpg,gif,png,jpeg"
                }
            ],
        },
        flash_swf_url: '/plugin/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        uptoken_url: $('#uptoken_url').val(),
        uptoken_url1: $('#uptoken_url1').val(),
        domain: $('#domain').val(),
        save_key: true,
        auto_start: true,
        init: {
            'FilesAdded': function(up, files) {
                thisDom = $('#' + pickfiles);
                commentImgBox();
            },
            'BeforeUpload': function(up, file) {

            },
            'UploadProgress': function(up, file) {

            },
            'UploadComplete': function() {

            },
            'FileUploaded': function(up, file, info) {
                res = $.parseJSON(info);
                commentImgUploaded(res);
            },
            'Error': function(up, err, errTip) {},
            'Key': function(up, file) {
                var key = "";
                return key
            }
        }
    });
}
//添加图片后
function commentImgBox() {
    thisDom.parent(".button-box").next('.comment-img-area').remove();
    var left = thisDom.parent(".button-box").find('.upload-img-btn').position().left + 7;
    var html = '<div class="comment-img-area" style="left:' + left + 'px;margin-top:10px;display:none">' +
        '<div class="comment-img-box">' +
        '<span><em></em><b></b></span>' +
        '<a href="javascript:;" class="close">×</a>' +
        '<div class="img-box">' +
        '<img src="/images/loading.gif" class="upload-img"/>' +
        '</div>' +
        '</div>' +
        '</div>';
    thisDom.parent(".button-box").after(html);
    $(".comment-img-area").fadeIn(200);
    $("body").on('click', '.comment-img-area .close', function(event) {
        thisDom = $(this);
        $(this).parents(".comment-img-area").fadeOut(200, function() {
            thisDom.parents(".comment-img-area").remove();
        });
    });
}
//图片上传完成后
function commentImgUploaded(res) {
    thisDom.parent(".button-box").next(".comment-img-area").attr({
        'imghash': res.hash,
        'imgurl': res.hash,
        'imgmime': res.mimeType,
        'imgsize': res.fsize,
        'imgwidth': res.w,
        'imgheight': res.h
    });
    thisDom.parent(".button-box").next(".comment-img-area").find('.upload-img').attr("src", domain + res.hash + "?imageMogr2/auto-orient/thumbnail/!80x80r/gravity/Center/crop/80x80/quality/100");
}
//打开评论图片    
var maxHeight;
var maxWidth;
var viewWidth = 800;
var viewHeight = 475;
var boxWidth = 760;
var boxHeight = 350;

function commentImgLayer(imgW, imgH, imgUrl, imgCut, imgMime) {
    var marginTop = (winHeight - viewHeight) / 2;
    var html = '<div id="overlay" class="overlay comment-img-overlay" style="z-index:9992">' +
        '<div class="view-img" style="width:' + viewWidth + 'px;height:' + viewHeight + 'px;min-width:800px;min-height:475px;margin-top:' + marginTop + 'px">' +
        '<h3>' +
        '查看图片' +
        '<a href="javascript:;" class="close-view-img">×</a>' +
        '</h3>' +
        '<div class="view" style="width:' + boxWidth + 'px;height:' + boxHeight + 'px;min-width:760px;min-height:350px">' +
        '<div class="img-box" style="width:' + boxWidth + 'px;height:' + boxHeight + 'px;min-width:760px;min-height:350px"><img src="/images/loading.gif" class="loading-img"/><img src="' + imgUrl + imgCut + '" class="onload-img"></div>' +
        '</div>' +
        '<a href="' + imgUrl + '?imageView2/1/q/100|watermark/1/image/aHR0cDovL3B1YmxpYy54eHh4eGJicy5jb20vaW1hZ2VzL3dhdGVybWFyay5wbmc=/gravity/South" target="_blank" class="blue-button view-button">查看原图</a>' +
        '</div>' +
        '</div>';
    $("body").prepend(html);
    $("body").addClass('body-overlay');
    $(".overlay").fadeIn(200);
    imgLoad();
    $("body").on('click', '.close-view-img,.comment-img-overlay', function(event) {
        $(".comment-img-overlay").fadeOut(200, function() {
            if ($("div#overlay").length <= 1) {
                $("body").removeClass('body-overlay');
            }
            $(this).remove();
        });
    });
    ESCClose('comment-img-overlay', 'view-img');
}
//删除评论
function delComment() {
    thrId = thisDom.attr('threadid');
    comId = thisDom.attr('commentid');
    $.ajax({
        type: 'POST',
        url: '/thread/delComment',
        data: {
            'threadId': thrId,
            'commentId': comId
        },
        success: function(result) {
            if (result.status == 666) {
                forbiddenAlert();
            }
            var code = parseInt(result);
            if (1 == code) {
                thisDom.parents(".comment-list").find('p:first').after('<p class="comment-deleted">该条评论已被删除！</p>');
                thisDom.parents(".comment-list").find('.up-btn').remove();
                thisDom.parents(".comment-list").find('.uped-btn').remove();
                thisDom.parents(".comment-list").find('p:first').remove();
                thisDom.parents(".comment-list").find('.commentImgBox').remove();
                thisDom.parents(".comment-list").find('.comment-p').attr('style', '');
                thisDom.parents(".comment-list").find('.comment-operate').remove();
            } else if (-1 == code || 0 == code) {
                content = '删除失败，请重新载入页面后再次尝试。';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    return false;
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            }
        }
    });
}
//加关注/取消关注
function follow(friendUserId, type) {
    $.ajax({
        type: 'GET',
        url: '/usconter/followUser?userId=' + friendUserId + '&type=' + type,
        beforeSend: function() {

            thisDom.after('<span class="white-button  following" style="font-size:14px;color:#999">处理中...</span>');
            thisDom.remove();
        },
        success: function(result) {
            if (result.status == 666) {
                forbiddenAlert();
            }
            if (result == 6) { //加关注
                $(".following").after('<a href="javascript:;" class="white-button un-follow-btn" userid="' + friendUserId + '" type="1"><i></i>取消关注</a>');
                thisDom.remove();
                $(".following").remove();
                return;
            }
            if (result == 4) { //取消关注
                $(".following").after('<a href="javascript:;" class="white-button follow-btn" userid="' + friendUserId + '" type="0"><i></i>关注</a>');
                thisDom.remove();
                thisDom.remove();
                $(".following").remove();
                return;
            }
            if (result == 7) { //互相关注
                $(".following").after('<a href="javascript:;"class="white-button each-follow-btn" userid="' + friendUserId + '" type="2"><i></i>互相关注</a>');
                thisDom.remove();
                thisDom.remove();
                $(".following").remove();
                return;
            }
            if (result == -1) {
                content = '操作失败，您已被对方加入黑名单。';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    window.location.reload();
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                return;
            }
            if (result == 2) { //互相关注
                if (type == 2) {
                    content = '操作失败，您已取消对该用户的关注。';
                } else if (type == 1) {
                    content = '操作失败，您已关注了该用户。';
                }
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    window.location.reload();
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                return;
            }
        },
        error: function() {
            content = '操作失败，请重新载入页面后再次尝试。';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        }
    });
}
//读取黑名单列表
var blackListArray = [];
var thisButtonArea;

function blackList() {
    if ($("#page").val() == 'look-at' || $("#page").val() == 'thread-info' || $("#page").val() == 'search-user') {
        $.ajax({
            type: 'GET',
            url: '/usconter/blacklist',
            data: {
                userId: $("#myid").val()
            },
            success: function(data) {
                $(".left-box").find(".loading").remove();
                $.each(data, function(index, el) {
                    blackListArray.push(el.blackuserid);
                });
                $(".button-area").each(function(index, el) {
                    thisButtonArea = $(this);
                    var userId = parseInt(thisButtonArea.attr('userid'));
                    if (blackListArray.indexOf(userId) >= 0) {
                        afterAddBlackList();
                    } else {
                        $(".button-area").fadeIn(200);
                    }
                });
            }
        });
    }
}
// 加入/移出黑名单方法
function afterAddBlackList() {
    if ($("#page").length > 0) {
        if ($("#page").val() == "look-at") {
            if (thisButtonArea.parent().attr('class') == 'left-box') {
                var html = '<div class="button-area-blacklist">' +
                    '<a href="javascript:;" userid="' + thisButtonArea.attr("userid") + '" class="white-button remove-blacklist-btn remove-blacklist-button" type="1"><i></i>移出黑名单</a>' +
                    '<a href="javascript:;" class="white-button report-btn" userid="' + thisButtonArea.attr("userid") + '" type="4" threadid="1"><i></i>举报</a>' +
                    '<a href="javascript:;" userid="' + thisButtonArea.attr("userid") + '" class="white-button private-btn message-button"><i></i>私信</a>' +
                    '</div>';
                $('.lookat-left').find('.button-area').after(html);
                $('.lookat-left').find('.button-area').remove();
            } else {
                var html = '<a href="javascript:;" style="font-size:12px" class="white-button removed-blacklist-btn">此人被您拉黑</a>';
                thisButtonArea.prepend(html);
                thisButtonArea.find('.follow-btn').remove();
                thisButtonArea.find('.un-follow-btn').remove();
            }
        } else if ($("#page").val() == "thread-info") {
            var html = '<a href="javascript:;" class="white-button removed-blacklist-btn">此人被您拉黑</a>';
            $('.thread-right').find('.button-area').prepend(html);
            $('.thread-right').find('.button-area .follow-btn').remove();
            $('.thread-right').find('.button-area .un-follow-btn').remove();
        } else if ($("#page").val() == "search-user") {
            var html = '<a href="javascript:;" class="white-button removed-blacklist-btn">此人被您拉黑</a>';
            thisButtonArea.prepend(html);
            thisButtonArea.find('.follow-btn').remove();
            thisButtonArea.find('.un-follow-btn').remove();
        }
    }
};

function afterRemoveBlackList() {
    if ($("#page").length > 0) {
        if ($("#page").val() == "look-at") {
            var html = '<div class="button-area" userid="' + $("#userid").val() + '">' +
                '<a href="javascript:;" userid="' + $("#userid").val() + '" type="0" class="white-button follow-btn"><i></i>关注</a>' +
                '<a href="javascript:;" class="white-button report-btn" userid="' + $("#userid").val() + '" type="4" threadid="1"><i></i>举报</a>' +
                '<a href="javascript:;" userid="' + $("#userid").val() + '" class="white-button add-blacklist-btn add-blacklist-button" type="0"><i></i>拉黑</a>' +
                '<a href="javascript:;" userid="' + $("#userid").val() + '" class="white-button private-btn message-button"><i></i>私信</a>' +
                '</div>';
            $('.lookat-left').find('.button-area-blacklist').after(html);
            $('.lookat-left').find('.button-area-blacklist').remove();
        }
    }
}

function optBlackList() {
    $.ajax({
        type: 'POST',
        url: '/usconter/optBlack',
        data: {
            userid: $("#myid").val(),
            blackuserid: thisDom.attr("userid"),
            type: thisDom.attr("type")
        },
        success: function(data) {
            if (thisDom.attr("type") == '0') {
                content = '操作成功，该用户已被您加入黑名单。';
                ok = function() {
                    afterAddBlackList();
                };
            } else if (thisDom.attr("type") == '1') {
                content = '操作成功，该用户已从黑名单中移除。';
                ok = function() {
                    if ($("#page").val() == "blacklist") {
                        window.location.reload();
                    } else {
                        afterRemoveBlackList();
                        $(".button-area").fadeIn(200);
                    }
                };
            }
            confirmBackground = "#2175d0";
            dialogTop = 200;
            confirmText = '确定';
            cancelDisplay = 'none';
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);

        },
        error: function() {
            content = '操作失败，请重新载入页面后再次尝试。';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        }
    });
}
//通用-自定义滚动条方法
function dialogLayerScroll(top) {
    $("#overlay .dialog").mCustomScrollbar({
        theme: "dark",
        callbacks: {
            onInit: function() {
                $(".mCSB_container").css('top', top + 'px');
            }
        }
    });
}
//私信 
var privatePageNo;

function OpenPrivateMessage(userId, isMore) { //打开私信层
    var html = '<div id="overlay" class="overlay private-overlay" uid="' + userId + '">' +
        '<div class="comment-dialog-area">' +
        '<div class="comment-dialog-box private-box" style="margin:auto;padding-bottom:160px">' +
        '<h3>' +
        '私信' +
        '<a href="javascript:;" class="close-dialog">×</a>' +
        '</h3>' +
        '<div class="dialog mCustomScrollbar">' +
        '<div class="dialog-list">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="private-input">' +
        '<textarea placeholder="请输入私信内容" class=""></textarea>' +
        '<div class="button-box" style="height:auto;text-align:right;">' +
        '<div class="char-limit"><em>还可以输入</em> <i style="color: #2175d0;">2000</i> <b>字</b></div>' +
        '<a href="javascript:;" id="private-pickfiles" class="upload-img-btn"><i></i>发图片</a>' +
        '<a href="javascript:;" class="face-btn"><i></i>发表情</a>' +
        '<a href="javascript:;" class="blue-button" id="pub-private-message-btn">发送</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").prepend(html);
    privateMessageAjax(userId, isMore);
    $("body").addClass('body-overlay');
    $("#overlay").fadeIn(200, function() {
        dialogLayerScroll();
        commentDialog = true;
        $(".private-input").find('textarea').focus();
        $("body").on('click', '.load-more-pm', function(event) {
            isMore = true;
            privatePageNo = privatePageNo + 1;
            privateMessageAjax(userId, isMore);
            $(this).remove();
        });
        $("body").on('click', '.private-box .close-dialog', function(event) {
            $("#overlay").fadeOut(200, function() {
                $("#overlay").remove();
                if ($("div#overlay").length <= 1) {
                    $("body").removeClass('body-overlay');
                }
                $("body").off('click', '.load-more-pm');
                privatePageNo = 1;
            });
            if ($("#page").val() == "usercenter-private" && $(".info-private .remind-light").length > 0) {
                window.location.reload();
            }
        });
        $(document).on('keydown', function(e) {
            if (e && e.keyCode == 27) {
                $("#overlay").fadeOut(200, function() {
                    $("#overlay").remove();
                    if ($("div#overlay").length <= 1) {
                        $("body").removeClass('body-overlay');
                    }
                    $("body").off('click', '.load-more-pm');
                    privatePageNo = 1;
                });
                if ($("#page").val() == "usercenter-private" && $(".info-private .remind-light").length > 0) {
                    window.location.reload();
                }
            }
        });
        pickfiles = "private-pickfiles";
        uploadReplyImg(pickfiles);
    });
}

function privateMessageHtml(pm) { //私信条目html
    if (pm.content) {
        pm.content = pm.content.replace(/\n/g, '<br/>');
        pm.content = replaceHashInfo(pm.content);
    }
    var html;
    if (pm.ismysend == 1) {
        html = '<dl class="comment-list my" pmid="' + pm.id + '" style="display:none">';
    } else {
        html = '<dl class="comment-list other" pmid="' + pm.id + '" style="display:none">';
    }
    html +=
        '<dt>';
    if (pm.ismysend == 1) {
        html += '<a href="/center/thread" target="_blank"><img src="' + pm.my.image.url + '?imageMogr2/auto-orient/thumbnail/!40x40r/gravity/Center/crop/40x40"></a>';
    } else {
        html += '<a href="/lookat/home?userId=' + pm.user.id + '" target="_blank"><img src="' + pm.user.image.url + '?imageMogr2/auto-orient/thumbnail/!40x40r/gravity/Center/crop/40x40"></a>';
    }
    html += '</dt>' +
        '<dd>' +
        '<span><em></em></span>';
    if (pm.ismysend == 1) {
        html += '<h5> <a href="/center/thread" target="_blank">我</a> ';
    } else {
        html += '<h5> <a href="/lookat/home?userId=' + pm.user.id + '" target="_blank">' + pm.user.name + '</a> ';
    }
    html += pm.time + '</h5>';
    if (!pm.content) {
        html += '<p></p>';
    } else {
        html += '<p>' + pm.content + '</p>';
    }
    if (pm.imagehash) {
        html += '<a href="' + domain + pm.imagehash + '" target="_blank"><img class="private-img" src="' + domain + pm.imagehash + '?imageView2/2/w/500/q/100|watermark/1/image/aHR0cDovLzd4c2N3NS5jb20wLnowLmdsYi5xaW5pdWNkbi5jb20vd2F0ZXJtYXJrLnBuZw==/gravity/South/dy/5"/></a>';
    }
    html += '<div class="operate" style="padding:0px;height:auto">' +
        '<div class="comment-operate" style="text-align:right">';
    if (pm.ismysend == 0) {
        html += '<a href="javascript:;" class="report-btn" threadid="' + pm.id + '" commentid="' + pm.id + '" userid="' + pm.user.id + '" type="3">举报</a>';
    }
    html += '</div>' +
        '</div>' +
        '</dd>' +
        '<div class="clear">' +
        '</div>' +
        '</dl>';
    return html;
}

function privateMessageAjax(userId, isMore) { //加载私信数据
    $.ajax({
        url: "/center/messagebyuserid",

        data: {
            userId: userId,
            pageNo: privatePageNo
        },
        beforeSend: function() {
            $(".dialog-list").prepend('<div class="loading-private" style="text-align:center;padding:20px 0px;"><img src="/images/loading.gif"></div>')
        },
        success: function(data) {
            var originalDialogListHeight = $(".dialog-list").height();
            $(".loading-private").fadeOut(200, function() {
                $(".loading-private").remove();
                if (privatePageNo <= data[0].pagecount) {
                    for (var i = 0; i < data[0].list.length; i++) {
                        pm = data[0].list[i];
                        var html = privateMessageHtml(pm);
                        $("#overlay .dialog-list").prepend(html);
                        $(".comment-list").fadeIn(1000, function(thisArea) {
                            thisArea = $(this).find('p');
                            linkAutoCreate(thisArea);
                        });
                    }
                    if (privatePageNo < data[0].pagecount) {
                        $("#overlay .dialog-list").prepend('<a href="javascript:;" class="load-more-pm">加载更多私信</a>');
                    } else {
                        $(".load-more-pm").remove();
                    }
                    if (isMore != true) {
                        if ($(".dialog-list").find('.private-img').length > 0) {
                            $(".dialog-list").find('.private-img').each(function(index, el) {
                                $(this).load(function() {
                                    var dialogListHeight = $(".dialog-list").height();
                                    var dialogHeight = $(".dialog").height();
                                    if (dialogListHeight > dialogHeight) {
                                        $(".mCSB_container").css("top", dialogHeight - dialogListHeight - 10 + "px");
                                    }
                                });
                            });
                        } else {
                            var dialogListHeight = $(".dialog-list").height();
                            var dialogHeight = $(".dialog").height();
                            if (dialogListHeight > dialogHeight) {
                                $(".mCSB_container").css("top", dialogHeight - dialogListHeight - 10 + "px");
                            }
                        }
                    } else {

                        var dialogListHeight = $(".dialog-list").height();
                        var dialogHeight = $(".dialog").height();
                        if (dialogListHeight > dialogHeight) {
                            $(".mCSB_container").css("top", originalDialogListHeight - dialogListHeight - 10 + "px");
                        }
                    }
                }
                faceImg();
                $(".my-private-list[userid=" + userId + "]").find('.red-dot').remove();
            });
        }
    });
}

function pubPrivateMessage(userId, content, imageJson) { //发私信
    userId = $("#overlay").attr("uid");
    content = $(".private-input").find('textarea').val();
    thisTextarea = $(".private-input").find('textarea');
    var imgHash = $(".private-input").find('.comment-img-area').attr("imghash");
    var imgUrl = $(".private-input").find('.comment-img-area').attr('imgurl');
    var imgHash = $(".private-input").find('.comment-img-area').attr('imghash');
    var imgMime = $(".private-input").find('.comment-img-area').attr('imgmime');
    var imgSize = $(".private-input").find('.comment-img-area').attr('imgsize');
    var imgWidth = $(".private-input").find('.comment-img-area').attr('imgwidth');
    var imgHeight = $(".private-input").find('.comment-img-area').attr('imgheight');
    imageJson = JSON.stringify({
        'hash': imgHash,
        'url': imgUrl,
        'mime': imgMime,
        'size': imgSize,
        'width': imgWidth,
        'height': imgHeight
    });
    content = replaceFace();
    if(imageJson!=undefined){
    	var imageHash = JSON.parse(imageJson).hash;
		if(imageHash!=undefined){
			content = content==''?('[http://15feng.cn/p/'+imageHash+']'):(content+' [http://15feng.cn/p/'+imageHash+']');
		}
    }
    $.ajax({
        type: 'post',
        url: '/center/sendmessage',
        data: {
            "userId": userId,
            "content": content,
            "imageJson": imageJson
        },
        success: function(data) {
            pm = data[0].list;
            if (data.status == 666) {
                forbiddenAlert();
            }
            if (1 == data[0].tip) {
                $(".private-input").find('textarea').val("");
                $(".comment-img-area").remove();
                $(".private-input").find('.char-limit i').text('2000');
                pm.my.image.url = pm.my.image.url;
                var html = privateMessageHtml(pm, pm.my.image.url);
                $('.dialog-list').append(html);
                $(".my").fadeIn(200, function() {
                    var top = $("#overlay .dialog").find('.dialog-list').height() - 315;
                    $(".mCSB_container").css('top', -top + 'px');
                });
                return true;
            } else if (data[0].tip == -1) {
                content = '请输入私信内容！';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    return false;
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            } else if (data[0].tip == -3) {
                content = '您已被对方列入黑名单，无法发送私信！';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    return false;
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            }
        },
        complete: function() {
            faceImg();
        }
    });
}

function delPrivateMessage() { //删除私信---个人中心预留
    var privateId = thisDom.attr('privatemsgid');
    $.ajax({
        type: 'POST',
        url: '/center/delPrivateMsg',
        data: {
            'privateId': privateId
        },
        success: function(result) {
            if (result.status == 666) {
                forbiddenAlert();
            }
            var code = parseInt(result);
            if (1 == code) {
                window.location.reload();
            } else if (-1 == code) {
                content = '删除私信失败！' + code;
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    return false;
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            } else if (0 == code) {
                content = '删除私信失败！' + code;
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    return false;
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            }
        }
    });
}
// 申请删除/修改帖子
function showApplyShow(threadId, content) {
    if (!content) {
        content = '该帖子已被管理员设为推荐或焦点图，如需修改或删除请注明理由，我们会尽快给你答复。';
    }
    var html = '<div id="overlay" class="showApplySubmitLayer">' +
        '<div class="showApplySubmit">' +
        '<h3>' +
        '对帖子操作失败' +
        '<a href="javascript:;" class="close-dialog">×</a>' +
        '</h3>' +
        '<div class="showApplySubmitBox">' +
        '<p>' + content + '</p>' +
        '<textarea class="reason"></textarea>' +
        '<div class="button-area">' +
        '<a href="javascript:;" class="white-button cancel-apply" style="margin-right:10px">取消</a>' +
        '<a href="javascript:;" class="blue-button submit-apply" threadid="' + threadId + '">提交申请</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    $("body").prepend(html);
    $("body").addClass('body-overlay');
    $(".showApplySubmitLayer").fadeIn(200);
    $("body").on('click', '.showApplySubmitLayer .close-dialog,.cancel-apply,.showApplySubmitLayer', function(event) {
        $(".showApplySubmitLayer").fadeOut(200, function() {
            $(this).remove();
            if ($("div#overlay").length <= 1) {
                $("body").removeClass('body-overlay');
            }
        });
    });
    ESCClose('.showApplySubmitLayer', 'showApplySubmit');
    $("body").on('click', '.showApplySubmitLayer .submit-apply', function(event) {
        dialogText = $(".showApplySubmitLayer").find('textarea').val();
        currentId = $(this).attr("threadid");
        showApplySutmit(currentId, dialogText);
    });
}

function showApplySutmit(currentId, dialogText) {
    $.getJSON('/user/thread/' + currentId + '/apply-edit', {
        info: dialogText
    }, function(result, status) {
        if (result.status == 666) {
            forbiddenAlert();
        }
        if (status == 'success' && typeof result.code !== 'undefined') {
            var code = parseInt(result.code);
            switch (code) {
                case 1: //成功
                    content = '提交申请成功！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#2175d0";
                    cancelDisplay = 'none';
                    ok = function() {
                        location.reload();
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case -1: //重复提交
                    content = '您已提交过申请，请耐心等待！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                    	$(".showApplySubmitLayer").remove()
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                default:
                    content = '提交失败，请确认您已登录并刷新页面重试！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                    	$(".showApplySubmitLayer").remove()
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            }
        } else {
            content = '提交失败，请请确认您已登录并刷新页面重试！';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        }
    });
}
//删除帖子/草稿方法
function deleteThread(isDraft) {
    var currentId = thisDom.attr('threadid');
    $.getJSON('/thread/del', {
        id: currentId,
        isDraft: isDraft
    }, function(data, status) {
        if (status == 'success' && typeof data.status !== 'undefined') {
            var s = parseInt(data.status);
            switch (s) {
                case 1:
                    content = '删除成功！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#2175d0";
                    cancelDisplay = 'none';
                    ok = function() {
                        location.reload();
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case 1001:
                    content = '删除失败：该帖子不存在！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case 666:
                    forbiddenAlert();
                    break;
                case 1002:
                    content = '删除失败：您还没有登录或登录授权已过期！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case 1003:
                    content = '删除失败：该帖子不存在！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case 1004:
                    content = '删除失败：您不能删除其他用户的帖子！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                case -2:
                    threadId = currentId;
                    showApplyShow(threadId);
                    break;
                case -3:
                    content = '删除失败：该帖子已被推荐至选题！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
                    break;
                default:
                    content = '删除失败！';
                    dialogTop = 200;
                    confirmText = '确定';
                    confirmBackground = "#e97171";
                    cancelDisplay = 'none';
                    ok = function() {
                        return false;
                    };
                    dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            }
        } else {
            content = '与服务器通信错误，请稍后重试！';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        }
        //1001编号不存在 1002 用户未登录 1003 帖子不存在 1004 用户不对应 -1 参数不对，-2被推荐，-3被推荐到选题 -4推荐到焦点图 1删除成功
    });
}
// 修改帖子
function modifyThread(currentId,type) { //type 1是修改  2删除
    // $.getJSON('/user/thread/' + currentId + '/is-editable',function(result,status){
    //   if(result.status==666){
    //     alert("您好，您的账号处于禁言状态，无法进行此操作。");
    //     return false;
    //   }
    //   if(status == 'success' && typeof result.editable !== 'undefined'){
    //     var editable = parseInt(result.editable);
    //     switch (editable){
    //       case 1://可操作
    //         window.location = '../../../../thread/update?id=' + currentId;
    //         break;
    //       case -3:
    //         threadId=currentId;
    //         showApplyShow(threadId);
    //         break;
    //       case -4:
    //         threadId=currentId;
    //         showApplyShow(threadId);
    //         break;
    //       case -5:
    //         threadId=currentId;
    //         showApplyShow(threadId);
    //         break;
    //       case -1:
    //         alert("与服务器通信错误，请稍后重试！");
    //         break;        
    //     }

    //   }else{
    //     alert('与服务器通信错误，请稍后重试！');
    //   }
    // }); 
    $.ajax({
        type: 'GET',
        url: '/thread/isEditorOrDel',
        data: {
            'id': currentId
        },
        success: function(result, status) {
            if (result.status == 666) {
                alert("您好，您的账号处于禁言状态，无法进行此操作。");
                return false;
            }
            if (status == 'success') {
                var editable = parseInt(result.status);
                switch (editable) {
                    case 1: //可操作
                        if(type==1){
	                    	window.location = '../../../../thread/update?id=' + currentId;
	                    }else{
	                    	deleteThread();
	                    }
                        break;
                    case -3:
                        threadId = currentId;
                        showApplyShow(threadId);
                        break;
                    case -4:
                        threadId = currentId;
                        showApplyShow(threadId);
                        break;
                    case -5:
                        threadId = currentId;
                        content = '您提交修改或删除帖子的申请正在审核中，请耐心等待。';
                        showApplyShow(threadId);
                        break;
                    case -6: //推荐至laosiji
                        threadId = currentId;
                        showApplyShow(threadId);
                        break;
                    case -7: //申请审核中
                        threadId = currentId;
                        content = '您提交修改或删除帖子的申请正在审核中，请耐心等待。';
                        showApplyShow(threadId);
                        break;
                    case -8: //列入焦点图
                        threadId = currentId;
                        showApplyShow(threadId);
                        break;
                    case -1:
                        alert("与服务器通信错误，请稍后重试！");
                        break;
                }
            } else {
                alert('与服务器通信错误，请稍后重试！');
            }
        }
    });
}
//表情包
function faceImg() {
    var reg = /(\[5X:)([0-9]*)(\])/g;
    $("p").each(function(index, el) {
        var pText = $(this).html();
        pText = pText.replace(reg, '<img src="/images/5xface/$2.png" class="xxxxx-face"/>');
        $(this).html(pText)
    });
}
/************************************************************************/
/*                          Dom加载完毕后                               */
/************************************************************************/
$(document).ready(function() {

    //游客模式广告cookie
    if (!$("#myid").val() && document.cookie.indexOf('deviceid') < 0) {
        var guestUa = navigator.userAgent;
        var guestRandom = Math.random();
        var guestTime = Date.now();
        var deviceId = guestUa + guestRandom + guestTime;
        deviceId = $.md5(deviceId)
        var guestExpdate = new Date(); //初始化时间
        guestExpdate.setTime(guestExpdate.getTime() + 1000 * 60 * 60 * 24); //5分钟过期
        document.cookie = 'deviceid=' + deviceId + ';expires=' + guestExpdate.toGMTString() + ';path=/';
    }
    //遍历p过滤html标签
    // $(".comment-list p").each(function(index, el) {
    //     var pValue=$(this).html();
    //     pValue=pValue.replace(htmlRegLeft,"&lt;");
    //     pValue=pValue.replace(htmlRegRight,"&gt;");  
    //     $(this).html(pValue);      
    // });
    // 搜索历史
    searchHistory(); //获取cookie记录
    $("#header").find('#keyword001').focus(function(event) {
        if ($(".search-record-box ul").find('li').length > 0) {
            $(".search-record").fadeIn(100);
        }
    });
    $("#header").find('#keyword001').blur(function(event) {
        $(".search-record").fadeOut(100);
    });
    $("body").on('mousedown', '.search-record-box ul li a', function(event) {
        event.stopPropagation();
        $(".search-record").css({
            display: "block"
        })
        var thisKeyword = $(this).find('em').text();
        $("#header").find('#keyword001').val(thisKeyword);
        window.location.href = '/search/index?keyword=' + thisKeyword;
    });
    //商城暂时关闭
    $(".user-info-list").find('.building').mouseenter(function(event) {
        $(this).text('敬请期待');
    });
    $(".user-info-list").find('.building').mouseleave(function(event) {
        $(this).text('兑换中心');
    });
    if ($("#myid").val() > 0) {
        blackList();
        remind(); //消息推送
    }
    topicColor();
    //导航高亮设置
    var windowHref = window.location.href;
    if (windowHref.indexOf("/index") > 0) {
        $("#header").find('.homepage a').css("color", "#2175d0");
    } else if (windowHref.indexOf("/interest/") > 0) {
        $("#header").find('.interestpage a').css("color", "#2175d0");
    } else if (windowHref.indexOf("/concerns/") > 0) {
        $("#header").find('.followpage a').css("color", "#2175d0");
    } else if (windowHref.indexOf("/rank/") > 0) {
        $("#header").find('.rankpage a').css("color", "#2175d0");
    } else if (windowHref.indexOf("/center/") > 0) {
        $("#header").find('.centerpage a').css("color", "#2175d0");
    }
    //延迟加载
    if ($(".upload").length > 0) {
        $(".upload").lazyload({
            effect: "fadeIn",
            skip_invisible: false,
            threshold: 200
        });
    }
    //回到顶部
    $(".side-bar").find('.go-top').click(function(event) {
        $("html,body").animate({
            scrollTop: "0px"
        }, 500);
    });
    //创建链接
    $("p").each(function() {
        thisArea = $(this);
        linkAutoCreate(thisArea);
    });
    //表情包
    faceImg();
    //顶部导航
    $("#header .header-row-1-col-2").find('.nav-topic').mouseenter(function(event) {
        $(".header-topic-label").addClass('header-topic-label-slidedown');
    });
    $("#header .header-row-1-col-2").find('.nav-topic').mouseleave(function(event) {
        $(".header-topic-label").removeClass('header-topic-label-slidedown');
    });
    //敲回车搜索结果
    $("#keyword001,#keyword").keydown(function(e) {
        e = e || event;
        if (e.keyCode == 13) {
            searchkey($(this));
        }
    });
    $("#footer .left-footer .sns ul .weixin").click(function(event) {
        var thisTop = $(this).offset().top;
        var thisLeft = $(this).offset().left;
        $(".mm-qrcode-area").css({
            top: thisTop + "px",
            left: thisLeft + "px"
        });
    });
    //举报
    $('body').on('click', '.report-btn', function(event) {
        if ($("#myid").val() <= 0) {
            content = '您尚未登录，请登录后提交举报信息。';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        } else {
            thisDom = $(this);
            openReport();
            if ($("#overlay").length <= 0) {
                $('body').addClass('body-overlay');
            }
        }
    });
    //加关注
    $('body').on('click', '.follow-btn', function(event) {
        thisDom = $(this);
        type = 1;
        friendUserId = thisDom.attr("userid");
        follow(friendUserId, type);
    });
    //取消关注
    $('body').on('click', '.un-follow-btn,.each-follow-btn', function(event) {
        thisDom = $(this);
        type = 2;
        friendUserId = thisDom.attr("userid");
        content = '是否要取消对Ta的关注？';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#2175d0";
        cancelDisplay = 'inline-block';
        ok = function() {
            follow(friendUserId, type);
        };
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    $('body').on('click', '.add-blacklist-btn', function(event) {
        thisDom = $(this);
        content = '确定要将此用户加入黑名单？';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#2175d0";
        cancelDisplay = 'inline-block';
        ok = function() {
            thisButtonArea = thisDom.parent();
            optBlackList();
        }
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    $('body').on('click', '.remove-blacklist-btn', function(event) {
        thisDom = $(this);
        content = '确定要将此用户从黑名单中移除？';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#2175d0";
        cancelDisplay = 'inline-block';
        ok = function() {
            thisButtonArea = thisDom.parent();
            optBlackList();
        }
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    //加入收藏
    $("body").on('click', '.add-favorite', function(event) {
        thisDom = $(this);
        myFavorite(thisDom);
    });
    //取消收藏
    $("body").on('click', '.has-favorite', function(event) {
        thisDom = $(this);
        content = '确定要取消收藏此帖吗？';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#e97171";
        cancelDisplay = 'inline-block';
        ok = function() {
            myFavorite(thisDom);
        };
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    //===================输入评论/回复/私信内容=====================//
    $("body").on('keyup', '.comment-textarea,.comment-list textarea', function(thisLength, thisValue) {
        thisDom = $(this);
        charLen = 1000;
        commentCount(charLen);
    });
    $("body").on('paste cut', '.comment-textarea,.comment-list textarea', function(thisLength, thisValue) {
        thisDom = $(this);
        charLen = 1000;
        commentCount(charLen);
        setTimeout(function() {
            thisDom.blur();
        }, 100);
    });
    $("body").on('blur', '.comment-textarea,.comment-list textarea', function(thisLength, thisValue) {
        thisDom = $(this);
        charLen = 1000;
        commentCount(charLen);
    });
    $("body").on('keyup', '.private-overlay textarea', function(thisLength, thisValue) {
        thisDom = $(this);
        charLen = 4000;
        commentCount(charLen);
    });
    $("body").on('paste cut', '.private-overlay textarea', function(thisLength, thisValue) {
        thisDom = $(this);
        charLen = 4000;
        commentCount(charLen);
        setTimeout(function() {
            thisDom.blur();
        }, 100);
    });
    $("body").on('blur', '.private-overlay textarea', function(thisLength, thisValue) {
        thisDom = $(this);
        charLen = 4000;
        commentCount(charLen);
    });
    //打开私信
    $("body").on('click', '.message-button', function(event) {
        userId = $(this).attr("userid");
        privatePageNo = 1;
        OpenPrivateMessage(userId);
    });
    //发送私信
    $("body").on('click', '#pub-private-message-btn', function(event) {
        var thisTextarea = $(this).parent('.button-box').prev('textarea');
        if ((thisTextarea.attr('class')).indexOf("textarea-error") >= 0) {
            content = '发布私信字数超限。';
            dialogTop = 200;
            confirmText = '确定';
            confirmBackground = "#e97171";
            cancelDisplay = 'none';
            ok = function() {
                return false;
            };
            dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
        } else {
            pubPrivateMessage();
        }
    });
    $("body").on("keydown", ".private-input textarea", function(e) {
        e = e || event;
        if (e.keyCode == 13 && e.ctrlKey) {
            if (($(this).attr('class')).indexOf("textarea-error") >= 0) {
                content = '发布私信字数超限。';
                dialogTop = 200;
                confirmText = '确定';
                confirmBackground = "#e97171";
                cancelDisplay = 'none';
                ok = function() {
                    return false;
                };
                dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
            } else {
                pubPrivateMessage();
            }
        }
    });
    //删除私信
    $("body").on('click', '.private-delete-btn', function(event) {
        thisDom = $(this);
        content = '是否要该条私信？';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#e97171";
        cancelDisplay = 'inline-block';
        ok = function() {
            delPrivateMessage();
        };
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    //打开评论图片
    $('body').on('click', '.comment-imgBox', function(imgW, imgH, imgUrl, imgCut, imgMime) {
        imgUrl = $(this).find("img").attr('data-url');
        imgH = parseInt($(this).find("img").attr('data-height'));
        imgW = parseInt($(this).find("img").attr('data-width'));
        imgMime = $(this).find("img").attr("data-type");
        maxHeight = parseInt(winHeight) - 242;
        maxWidth = parseInt(winWidth) - 242;
        if (imgW > maxWidth) {
            if (imgH > maxHeight) {
                if (maxWidth / imgW * imgH > maxHeight) {
                    boxHeight = maxHeight;
                } else {
                    boxHeight = maxWidth / imgW * imgH;
                }
            } else {
                boxHeight = maxWidth * imgH / imgW;
            }

        } else {
            if (imgH > maxHeight) {
                boxHeight = maxHeight;
            } else {
                boxHeight = imgH;
            }
        }
        if (boxHeight < 350) {
            boxHeight = 350;
        }
        boxWidth = imgW / imgH * boxHeight;
        if (boxWidth > maxWidth) {
            if (imgMime == "image/webp") {
                imgCut = '?imageView2/2/w/' + maxWidth + '/q/100/format/jpg|watermark/1/image/aHR0cDovL3B1YmxpYy54eHh4eGJicy5jb20vaW1hZ2VzL3dhdGVybWFyay5wbmc=/gravity/South/dy/5';
            } else {
                imgCut = '?imageView2/2/w/' + maxWidth + '/q/100|watermark/1/image/aHR0cDovL3B1YmxpYy54eHh4eGJicy5jb20vaW1hZ2VzL3dhdGVybWFyay5wbmc=/gravity/South/dy/5';
            }
            boxWidth = maxWidth;
        } else {
            if (imgMime == "image/webp") {
                imgCut = '?imageView2/2/h/' + boxHeight + '/q/100/format/jpg|watermark/1/image/aHR0cDovL3B1YmxpYy54eHh4eGJicy5jb20vaW1hZ2VzL3dhdGVybWFyay5wbmc=/gravity/South/dy/5';
            } else {
                imgCut = '?imageView2/2/h/' + boxHeight + '/q/100|watermark/1/image/aHR0cDovL3B1YmxpYy54eHh4eGJicy5jb20vaW1hZ2VzL3dhdGVybWFyay5wbmc=/gravity/South/dy/5';
            }
        }
        viewWidth = boxWidth + 40;
        viewHeight = boxHeight + 125;
        commentImgLayer(imgW, imgH, imgUrl, imgCut, imgMime);
    });
    //点赞
    $(".praise-btn").click(function(event) {
        thisDom = $(this);
        praise();
    });
    //删除帖子
    $("body").on('click', '.thread-delete-btn', function(event) {
        currentId = $(this).attr('threadid');
    	thisDom = $(this);
        content = '是否要删除这篇帖子？';
        dialogTop = 200;
        confirmText = '确定';
        confirmBackground = "#e97171";
        cancelDisplay = 'inline-block';
        ok = function() {
        	modifyThread(currentId,2);
        };
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    //修改帖子
    $("body").on('click', '.thread-modify-btn', function(event) {
        currentId = $(this).attr('threadid');
        modifyThread(currentId,1);
    });
    //删除草稿
    $("body").on('click', '.draft-delete-btn', function(event) {
        thisDom = $(this);
        content = '是否要删除这篇草稿？';
        dialogTop = 200;
        isDraft = -1;
        confirmText = '确定';
        confirmBackground = "#e97171";
        cancelDisplay = 'inline-block';
        ok = function() {
            deleteThread(isDraft);
        };
        dialog(content, confirmText, confirmBackground, dialogTop, cancelDisplay, ok);
    });
    //============================== 页脚微博/二维码切换=====================================//
    $("#footer").find('.footer-weibo-btn').mouseenter(function(event) {
        $(this).addClass('footer-weibo-btn-active');
        $('.footer-weixin-btn').removeClass('footer-weixin-btn-active');
        $('.footer-taobao-btn').removeClass('footer-taobao-btn-active');
        $("#footer").find('.qrcode').addClass('qrcode-hide');
        $("#footer").find('.weibo-list').addClass('weibo-list-show');
        $("#footer").find('.shop-qrcode').removeClass('shop-qrcode-show');
    });
    $("#footer").find('.footer-weixin-btn').mouseenter(function(event) {
        $(this).addClass('footer-weixin-btn-active');
        $('.footer-weibo-btn').removeClass('footer-weibo-btn-active');
        $('.footer-taobao-btn').removeClass('footer-taobao-btn-active');
        $("#footer").find('.qrcode').removeClass('qrcode-hide');
        $("#footer").find('.weibo-list').removeClass('weibo-list-show');
        $("#footer").find('.shop-qrcode').removeClass('shop-qrcode-show');
    });
    $("#footer").find('.footer-taobao-btn').mouseenter(function(event) {
        $(this).addClass('footer-taobao-btn-active');
        $('.footer-weixin-btn').removeClass('footer-weixin-btn-active');
        $('.footer-weibo-btn').removeClass('footer-weibo-btn-active');
        $("#footer").find('.qrcode').addClass('qrcode-hide');
        $("#footer").find('.weibo-list').removeClass('weibo-list-show');
        $("#footer").find('.shop-qrcode').addClass('shop-qrcode-show');
    });
    if ($(".usercenter-left").length > 0) {
        usercenterLeftTop = $(".usercenter-left").find('.nav').offset().top;
    }
    if ($(".lookat-left").length > 0) {
        lookAtLeftTop = $('.lookat-left').offset().top;
    }
    if ($(".rank-nav").length > 0) {
        rankNavTop = $('.rank-nav').offset().top;

    }
    if ($(".small-topic-box").length > 0) {
        smallTopicBoxTop = $('.small-topic-box').offset().top;
    }
    if ($("#topicLabel").length > 0) {
        homepageTopicLabelTop = $(".topic-list").offset().top;
    }
    $("#footer").find('.turn-mobile').click(function(event) {
        if (browser.versions.android || browser.versions.iPhone || browser.versions.iPad) {
            if (isThreadInfo) {
                window.location.href = "http://m.xxxxxbbs.com/th/info?id=" + threadID;
            } else if (threadURL.indexOf(indexFix) >= 0) {
                window.location.href = "http://m.xxxxxbbs.com/index";
            }
        } else {
            window.open("/html/mobile.html");
        }
    });
});
/************************************************************************/
/*                          窗口尺寸变化                                */
/************************************************************************/
// 帖子最终页右侧固定方法
function threadRight() {
    var threadRightHeight = $(".thread-right").height();
    var threadRightUserInfoHeight = $(".thread-right").find('.user-info').height();
    var threadRightGoodsHeight = $(".thread-right").find('.goods').height();
    var threadRightTmallHeight = $(".thread-right").find('.tmall').height();
    if (winHeight > threadRightUserInfoHeight + 350) {
        if (winScrollTop >= threadRightHeight + 100) {
            $(".thread-right .user-info").addClass('user-info-fixed');
            if (winHeight > threadRightUserInfoHeight + threadRightGoodsHeight + 350) {
                $(".thread-right").find('.goods').addClass('goods-fixed');
            } else {
                $(".thread-right").find('.goods').removeClass('goods-fixed');
            }
            if (winHeight < threadRightUserInfoHeight + threadRightGoodsHeight + 350 && winHeight > threadRightUserInfoHeight + threadRightTmallHeight + 350) {
                $(".thread-right").find('.tmall').addClass('tmall-fixed');
            } else {
                $(".thread-right").find('.tmall').removeClass('tmall-fixed');
            }
            if ($('.goods').length < 1 && winHeight > threadRightUserInfoHeight + threadRightTmallHeight + 350) {
                $(".thread-right").find('.tmall').addClass('tmall-fixed');
            }
        } else {
            $(".thread-right .user-info").removeClass('user-info-fixed');
            $(".thread-right").find('.goods').removeClass('goods-fixed');
            $(".thread-right").find('.tmall').removeClass('tmall-fixed');
        }
    } else {
        $(".thread-right .user-info").removeClass('user-info-fixed');
        $(".thread-right").find('.goods').removeClass('goods-fixed');
        $(".thread-right").find('.tmall').removeClass('tmall-fixed');
    }
}
window.onresize = function() {
    winHeight = $(window).height();
    footerBottom();
    sideBar();
    if ($('.thread-right').length > 0) {
        threadRight();
    }
}
window.onload = function() {
        if ($(".related-thread").length > 0) {
            //相关推荐
            if (liLength > 4) {
                for (var i = 1; i < screenCount; i++) {
                    $(".related-thread").find('.slide-dot').append('<a href="javascript:;" order="' + i + '"></a>');
                }
                $(".related-thread").find('.slide-dot').find('a:first').addClass('active');
            }
            var relatedThreadAutoSlide = setInterval(function() {
                setTimeout(relatedThreadSlide, 500);
            }, 5000);
            $(".related-thread").mouseenter(function(event) {
                clearInterval(relatedThreadAutoSlide);
            });
            $(".related-thread").mouseleave(function(event) {
                relatedThreadAutoSlide = setInterval(function() {
                    setTimeout(relatedThreadSlide, 500);
                }, 5000);
            });
            $(".related-thread").on('click', '.slide-dot a', function() {
                var order = parseInt($(this).attr("order"));
                times = order - 2;
                relatedThreadSlide();
            });
        }
        //页脚置底
        footerBottom();
        sideBar();
        //全站打赏
        var regRewards = /(allReward\=\")(.*)(\")/g;
        var allRewardList = [];
        var mentionCookie;
        //记一cookie，5分钟之内不再请求
        function requestLimitCookie() {
            var requestExpdate = new Date(); //初始化时间
            requestExpdate.setTime(requestExpdate.getTime() + 1000 * 60 * 5); //5分钟过期
            document.cookie = 'requestReward=off;expires=' + requestExpdate.toGMTString() + ';path=/';

        }
        //打赏数据id记入cookie
        function rewardCookie() {
            var rewardExpdate = new Date(); //初始化时间
            rewardExpdate.setTime(rewardExpdate.getTime() + 1000 * 60 * 60 * 24); //24小时过期
            if (document.cookie.indexOf("allReward=") < 0) {
                allRewardList = allRewardList.toString();
                document.cookie = 'allReward="' + allRewardList + '";expires=' + rewardExpdate.toGMTString() + ';path=/';
            } else {
                var allRewardKey = document.cookie.match(regRewards);
                if (allRewardKey !== null) {
                    allRewardKey = allRewardKey.toString();
                    allRewardKey = allRewardKey.replace('allReward="', '');
                    allRewardKey = allRewardKey.replace('"', '');
                    allRewardKey = allRewardKey.split(",");
                    for (var i = 0; i < allRewardList.length; i++) {
                        allRewardList[i] = allRewardList[i].toString();
                        if (allRewardKey.indexOf(allRewardList[i]) < 0) {
                            allRewardKey.push(allRewardList[i]);
                        }
                    }
                    allRewardKey = allRewardKey.toString();
                    document.cookie = 'allReward="' + allRewardKey + '";expires=' + rewardExpdate.toGMTString() + ';path=/';
                }
            }
        }
        var allReward = {
            init: function() {
                this.speed = 5;
                this.winWidth = $(window).width();
                this.html = '';
                this.timer;
                if (document.cookie.indexOf("requestReward=off") < 0) {
                    allReward.addData();
                }
                allReward.clickEvent();
            },
            addData: function() {
                $.ajax({
                    type: "post",
                    url: "/user/notice",
                    async: true,
                    success: function(res) {
                        var allRewardListKey = document.cookie.match(regRewards);
                        if (allRewardListKey !== null) {
                            allRewardListKey = allRewardListKey.toString();
                            allRewardListKey = allRewardListKey.replace('allReward="', '');
                            allRewardListKey = allRewardListKey.replace('"', '');
                            allRewardListKey = allRewardListKey.split(",");
                        } else {
                            allRewardListKey = [];
                        }
                        if (res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                if (allRewardListKey.indexOf(res[i].id.toString()) < 0 && allRewardList.indexOf(res[i].id) < 0) {
                                    allReward.html += '<div class="re-item-box"><div class="re-item">' +
                                        '<a style="display:inline-block;color:#fff" href="/thread/' + res[i].thread.id + '.html" target="_blank">' +
                                        '<i class="re-horn"></i>' +
                                        '<b class="uname">' + (res[i].user.nickname == '' ? res[i].user.defaultNiceName : res[i].user.nickname) + '</b><span>送给</span>' +
                                        '<b class="uname">' + (res[i].gratuityuser.nickname == '' ? res[i].gratuityuser.defaultNiceName : res[i].gratuityuser.nickname) + '</b>' +
                                        '<img src="' + res[i].imageurl + '?imageMogr2/auto-orient/thumbnail/!30x30r/gravity/Center/crop/30x30/quality/100"></a>' +
                                        '<em class="close">×</em>' +
                                        '</div></div>';
                                }
                                allRewardList.push(res[i].id);
                            }
                            $('.re-aside-cur').append(allReward.html);
                            allReward.run();
                            rewardCookie();
                        }
                        $('.re-aside').removeClass('re-aside-active');
                        $(".re-aside-mention").css('display', 'none');
                        $('.re-aside-metion').remove();
                        requestLimitCookie();
                    }
                });
            },
            run: function() {
                this.widthFir = $('.re-aside-cur .re-item-box').eq(0).find('.re-item').width();
                allReward.Marquee();
            },
            Marquee: function() {
                var items = $('.re-aside-cur .re-item-box');
                var items = $('.re-aside-cur .re-item-box');
                var moveDistence = parseFloat(allReward.winWidth) + parseFloat(allReward.widthFir) + 120;
                if (items.length != 0) {
                    var itemFir = items.eq(0);
                    itemFir.css({
                        'transform-style': 'preserve-3d',
                        'backface-visibility': 'hidden',
                        'transition': '15000ms linear',
                        'transform': 'translateX(' + (-moveDistence) + 'px)'
                    });
                    var speed = 0;
                    var time = 15000;
                    var speeds = function() {
                        speed = speed + moveDistence / 750;
                        time = time - 20;
                        if (speed >= moveDistence) {
                            speed = 0;
                            time = 15000;
                            itemFir.remove();
                            allReward.run();
                        }
                    }
                    var speedFunc = setInterval(speeds, 20);
                    $('.re-aside-cur .re-item').on('mouseenter', function() {
                        clearInterval(speedFunc);
                        itemFir.css({
                            'transition': '0ms linear',
                            'transform': 'translateX(' + (-speed) + 'px)'
                        });
                    });
                    $('.re-aside-cur .re-item').on('mouseleave', function() {
                        speedFunc = setInterval(speeds, 20);
                        itemFir.css({
                            'transform': 'translateX(' + (-moveDistence) + 'px)',
                            'transition': time + 'ms linear'
                        });
                    });
                } else {
                    allReward.close();
                    $('.re-aside').removeClass('re-aside-active');
                    $(".re-aside-mention").hide();
                }
            },
            clickEvent: function() {
                $('body').on('click', '.re-aside', function() {
                    $('.re-aside').removeClass('re-aside-active');
                    $(".re-aside-mention").remove();
                    $('.re-aside-cur').append(allReward.html);
                    allReward.run();
                });
                $('body').on('click', '.re-aside-cur .close', function() {
                    allReward.close();
                    var mentionExpdate = new Date(); //初始化时间
                    mentionExpdate.setTime(mentionExpdate.getTime() + 1000 * 60 * 60 * 24 * 7); //5分钟过期
                    document.cookie = 'mentionCookie=off;expires=' + mentionExpdate.toGMTString() + ';path=/';
                });
                $(".re-aside-mention").find('a').click(function(event) {
                    $(".re-aside-mention").fadeOut(200, function() {
                        $(this).remove();
                    });
                });
            },
            close: function() {
                clearInterval(allReward.timer);
                $('.re-aside-cur').empty();
                $('.re-aside').addClass('re-aside-active');
                if (document.cookie.indexOf("mentionCookie") < 0 && $('.re-aside-cur').find('.re-item-box').length > 0) {
                    $(".re-aside-mention").fadeIn(200);
                }
            }
        }
        allReward.init();
    }
    /************************************************************************/
    /*                            页面滚动时                                */
    /************************************************************************/
window.onscroll = function() {
    sideBar();
    winScrollTop = $(window).scrollTop();
    winHeight = $(window).height();
    bodyHeight = $(document).height();
    //头部导航
    if (winScrollTop >= 140) {
        $("#header").find('.header-row-1').addClass('header-row-1-show');
    } else {
        $("#header").find('.header-row-1').removeClass('header-row-1-show');
    }
    if ($("#topicLabel").length > 0) {
        if (winScrollTop >= homepageTopicLabelTop) {
            $(".header-topic-label").addClass('header-topic-label-autoslidedown');
            $(".nav-topic").addClass('nav-topic-active');
        } else {
            $(".header-topic-label").removeClass('header-topic-label-autoslidedown');
            $(".nav-topic").removeClass('nav-topic-active');
        }
    }
    //帖子最终页右侧固定
    if ($('.thread-right').length > 0) {
        threadRight();
    }
    if ($(".pubThreadContainer").length > 0) { //发帖页右侧
        domFixed();
    }
    // 个人中心左侧
    if ($(".usercenter-left").length > 0) {
        if (winScrollTop >= usercenterLeftTop) {
            $(".usercenter-left").find('.nav').addClass('nav-fixed');
            if ($(".usercenter-left").find('.nav').height() > winHeight - 286) {
                if (winScrollTop >= bodyHeight - winHeight - 236) { //侧边栏定位
                    $(".usercenter-left").find('.nav-fixed').css({
                        "top": "auto",
                        "bottom": winHeight + winScrollTop + 256 - bodyHeight,

                    });
                } else {
                    $(".usercenter-left").find('.nav-fixed').css("top", "50px");
                }
            }
        } else {
            $(".usercenter-left").find('.nav').removeClass('nav-fixed');
            $(".usercenter-left").find('.nav').attr('style', '');
        }
    }
    //排行榜顶部
    if ($(".rank-nav").length > 0) {
        if (winScrollTop >= rankNavTop) {
            $(".rank-nav").addClass('rank-nav-fixed');
        } else {
            $(".rank-nav").removeClass('rank-nav-fixed');
        }
    }
    // 看Ta的主页左侧
    if ($(".lookat-left").length > 0) {
        if (winScrollTop >= lookAtLeftTop) {
            $(".left-box").addClass('lookat-left-fixed');
            if ($(".left-box").height() > winHeight - 286) {
                if (winScrollTop >= bodyHeight - winHeight - 236) { //侧边栏定位
                    $('.lookat-left-fixed').css({
                        "top": "auto",
                        "bottom": winHeight + winScrollTop + 256 - bodyHeight,

                    });
                } else {
                    $('.lookat-left-fixed').css("top", "50px");
                }
            }
        } else {
            $(".left-box").removeClass('lookat-left-fixed');
            $('.left-box').attr('style', '');
        }
    }
    // 小话题最终页右侧
    if ($(".small-topic-box").length > 0) {
        if (winScrollTop >= smallTopicBoxTop) {
            $(".small-topic-box").addClass('small-topic-box-fixed');
        } else {
            $(".small-topic-box").removeClass('small-topic-box-fixed');
        }
    }
}

/************************************************************************/
/*                          esc按键或空白处关闭浮层                                  */
/************************************************************************/
function ESCClose(obj1, obj2, fn) {
    $(document).on('keydown', function(e) {
        if (e && e.keyCode == 27) {
            $("." + obj1).fadeOut(200, function() {
                if ($("div#overlay").length <= 1) {
                    $("body").removeClass('body-overlay');
                }
                $(this).remove();
                if (fn) {
                    fn();
                }
            });
        }
    });
    $("body").on('click', '.' + obj2, function(event) {
        event.stopPropagation();
    });
}

/************************************************************************/
/*                          广告位:查询追加广告                                   */
/************************************************************************/
//
function reloadAd(page, size, listSize, type, info) { //page当前加载页数 size当前一次加载个数 listSize一行的个数 type广告类型  info[分类，ulbox]
    var adHtml, itemTopicid, itemSortid, ulBox;
    if (type == 7) { //pc首页+pc选题页
        var topicIdSelected = info[0];
    } else if (type == 9) { //pc兴趣页
        var isAllinterest = info[0];
        page -= 1;
    }
    ulBox = info[1];
    var maxSort = ((page + 1) * size) / listSize;
    var minSort = (page * size) / listSize;
    var oldSort = (page - 1) * size;
    $.ajax({
        type: "get",
        url: "/ad/list",
        async: true,
        success: function(res) {
            var data = eval(res);
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if ((topicIdSelected <= 0 && item.seat == 7) || (topicIdSelected > 0 && item.seat == 8) || (isAllinterest == 1 && item.seat == 9)) {
                    itemTopicid = 0;
                    itemSortid = parseInt(item.sortid);
                    if (item.seat == 8) {
                        itemTopicid = parseInt(item.sortid.substring(0, 3));
                        itemSortid = parseInt(item.sortid.substring(3, 6));
                    }
                    if ((itemTopicid == topicIdSelected || isAllinterest == 1) && itemSortid < maxSort && itemSortid >= minSort) {
                        itemSortid = itemSortid * listSize;
                        adHtml = '<div class="clear"></div><div class="ad-box" adId="' + item.id + '"><a href="' + item.url + '" target="_blank">' +
                            '<img src="http://imageqiniu.xxxxxbbs.com/' + item.imageInfo.imageurl + '?imageMogr2/auto-orient/thumbnail/!1100x110r/gravity/Center/crop/1100x110"  alt="' + item.title + '" title="' + item.title + '"/>' +
                            '</a></div><div class="clear"></div>'
                        $(ulBox).find('li').eq(itemSortid).before(adHtml);
                    }
                }
            }
        }
    })
}

function reloadSortad(ulBox, repeatCount) {
    if (repeatCount != 0) {
        var adList = $('.topic-list .ad-box');
        adList.each(function() {
            var sortNum = $(this).next().next().index('.topic-list li');
            var that = $(this).prev().prop('outerHTML') + $(this).prop('outerHTML') + $(this).next().prop('outerHTML');
            $(this).prev().remove();
            $(this).next().remove();
            $(this).remove();
            $(ulBox).find('li').eq(sortNum - repeatCount).before(that);
        })
    }
}
//15feng图片转换
function replaceHashInfo(content) {
	return content.replace(/\[http\:\/\/15feng\.cn\/[p|v]\/.+?\]/g,'');
}

//设置已读站内公告
function setNoticeIsRead(obj,id){
	$(obj).siblings('.red').remove();
	$.ajax({
		type:"post",
		url:"/center/remNotice?noticeId="+id,
		async:true,
		success:function(res){
//			if(restype==0){
//				window.open('/thread/'+resid+'.html');
//			}else{
//				window.open('/small/topic/list/'+resid+'/');
//			}
		}
	});
}

