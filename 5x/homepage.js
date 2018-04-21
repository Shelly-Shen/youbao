var retPageCount = parseInt($("#retPageCount").val());
var retPageNo = parseInt($("#retPageNo").val());
var retMainPage = parseInt($("#retMainPage").val());
var retPageSize = parseInt($("#retPageSize").val());
var topicIds = parseInt($("#retTopicId").val());
var orderid = parseInt($("#orderid").val());
var loadingTimes = 0;
var loadFlag = true;

function getTopicHtml(topic) {
	var html = '<li threadid="' + topic.rtopicThread.threadid + '" style="opacity:0">' +
		'<a href="/thread/' + topic.rtopicThread.threadid + '.html" target="_blank" class="img-box">' +
		'<img src="' + topic.rtopicThread.editorcoverimageInfo.defaultImageurl + '?imageMogr2/auto-orient/thumbnail/!346x195r/gravity/Center/crop/346x195/quality/100" >' +
		'</a>' +
		'<span class="topic-info-box">' +
		' <a href="/topicinfo?topicId=' + topic.rtopicThread.topicid + '&creatorTime=2" target="_blank" class="topic-lab" topicid="' + topic.rtopicThread.topicid + '">' + topic.topicname + '<i></i></a>' +
		'<em class="topic-pub-time">' + topic.updatetime + '</em>' +
		'</span>' +
		'<h3 class="topic-title"><a href="/thread/' + topic.rtopicThread.threadid + '.html" target="_blank">' + topic.rtopicThread.editortitle + '</a></h3>' +
		'<div class="topic-user-info">' +
		'<a href="/lookat/home?userId=' + topic.rtopicThread.userid + '" target="_blank" class="user-info">' +
		'<i><img src="' + topic.userimage.url + '?imageMogr2/auto-orient/thumbnail/!25x25r/gravity/Center/crop/25x25"></i>' +
		' <span>' +
		topic.nickName;
	// if(topic.rtopicThread.threadExpand.userInfo.isadministrator==1){          
	// html+='<b class="adminIco"></b> ';
	// }
	html += '</span>' +
		'</a>' +
		'<div class="about-count">' +
		'<span class="click-count"><i></i><b>' + topic.rtopicThread.threadExpand.cilckcount + '</b></span>' +
		'<span class="comment-count"><i></i><b>' + topic.rtopicThread.threadExpand.commentcount + '</b></span>' +
		'<span class="praise-count"><i></i><b>' + topic.rtopicThread.threadExpand.praisecount + '</b></span>' +
		'</div>' +
		'</div>' +
		'</li> ';
	return html;
}
//处理异步加载过程中重复的帖子
var existThreadArr = new Array();
var repeatCount = 0;
var repeatPage = parseInt($("#retMainPage").val());

function existThread() { //已存在的帖子id序列
	existThreadArr = [];
	$(".topic-list").children('li').each(function(index, el) {
		existThreadArr.push(parseInt($(this).attr("threadid")));
	});
}

function reloadThread() { //查询并追加新推选题的帖子
	$.ajax({
		type: 'POST',
		url: '/threadJson',
		data: {
			'pageCount': retPageCount,
			'pageSize': retPageSize,
			'mainPage': repeatPage - 1, //当前页码的前一页
			'topicId': topicIds,
			'orderid': orderid,
			'pageNo': retPageNo
		},
		success: function(data) {
			var reLength = data.threadMap.length;
			var threadNum = 0;
			var dataCount = 0;
			var resFirst = 0;
			for(var i = 0;i < repeatCount;i++) {
				for(var j = dataCount; j < reLength; j++) { 
					dataCount++;  
					var findResult = existThreadArr.indexOf(data.threadMap[j].rtopicThread.threadid);
					if(findResult >= 0) {
						threadNum = findResult; 
						resFirst =1;
					} else {
						if(resFirst!=0)threadNum++;
						break
					}
				}
				var topic = data.threadMap[dataCount-1];
				var repeatHtml = getTopicHtml(topic);
				$(".topic-list").find('li').eq(threadNum+i).before(repeatHtml);
				$(".topic-list").find('li').css("opacity", "1");
				if($("#topicid").val() <= 0&&(threadNum+i)<=8) {
					var lastHtml = $(".small-topic-up").prev("li").prop("outerHTML");
					$(".small-topic-up").prev("li").remove();
					$(".small-topic-down").after(lastHtml);
				}
			}
			topicColor();
			reloadSortad('.topic-list',repeatCount);
			repeatCount=0;
		}
	});
}

function getTopicAjax(topic) {
	$.ajax({
		type: 'POST',
		url: '/threadJson',
		data: {
			'pageCount': retPageCount,
			'pageSize': retPageSize,
			'mainPage': retMainPage,
			'topicId': topicIds,
			'orderid': orderid,
			'pageNo': retPageNo
		},
		beforeSend: function() {
			$(".topic-list").find('#topic-line').before('<div class="loading-more"><img src="/images/xxxxx-loading.gif"></div>');
			loadFlag = false;
		},
		success: function(data) {
			repeatCount = 0;
			$.each(data.threadMap, function(index, topic) {
				if(existThreadArr.indexOf(topic.rtopicThread.threadid) >= 0) {
					// $(".topic-list").find('li[threadid='+topic.rtopicThread.threadid+']').remove();
					repeatCount = repeatCount + 1;
				} else {
					thisCount = topic.rtopicThread.threadExpand.cilckcount;
					topic.rtopicThread.threadExpand.cilckcount = countFormat(thisCount);
					var html = getTopicHtml(topic);
					$(".topic-list").find('#topic-line').before(html);
					topicColor();
				}
			});
			reloadThread();
			$(".loading-more").remove();
			setTimeout(function() {
				$(".topic-list").find('li').css('opacity', '1');
				loadingTimes = loadingTimes + 1;
				retMainPage = retMainPage + 1;
				if(loadingTimes >= 5 || retMainPage >= retPageNo) {
					$("#load-more-topic").fadeOut(200, function() {
						$(this).remove();
					});
					$("#pageNum").fadeIn(200);
				}
				loadFlag = true;
			}, 300);
		},
		complete: function() {
			//add--10.17
			reloadAd(retMainPage,retPageSize,3,7,[topicIds,'.topic-list']);
			if(!browser.versions.ie10 && !browser.versions.ie11) {
				emojify.run();
			}
			sideBar();
		}
	});
}
//焦点图切换
var slideIndex = 1;
var sideIndex = 1;
var beforeIndex = 1;

function mainSlide() {
	$(".slide-main ul").find('li').css({
		'z-index': '0'
	});
	$(".slide-list").find('li').removeClass('active');
	$(".slide-list").find('li:eq(' + sideIndex + ')').addClass('active');
	$(".slide-main ul").find('li:eq(' + slideIndex + ')').css({
		'z-index': '5',
		'display': 'none'
	});
	$(".slide-main ul").find('li:eq(' + beforeIndex + ')').css({
		'z-index': '4',
	});
	$(".slide-main ul").find('li:eq(' + slideIndex + ')').fadeIn(800);
	slideIndex = slideIndex + 1;
	sideIndex = sideIndex + 1;
	beforeIndex = slideIndex - 1;
	if(sideIndex > 4) {
		sideIndex = 0;
	}
	if(slideIndex > 5) {
		slideIndex = 1;
	}
}
$(document).ready(function() {
	existThread();
	//焦点图
	var autoSlide = setInterval(mainSlide, 5000);
	$(".slide-list").find('li').click(function(event) {
		beforeIndex = slideIndex - 1;
		slideIndex = $(this).index();
		sideIndex = $(this).index();
		mainSlide();
	});
	$(".picture-wrapper").mouseenter(function(event) {
		clearInterval(autoSlide);
	});
	$(".picture-wrapper").mouseleave(function(event) {
		autoSlide = setInterval(mainSlide, 5000);
	});
	//3D透视
	// $(".slide-main").mousemove(function(e) {
	//   var offset = $(this).offset();
	//   var relativeX = (e.pageX - offset.left);
	//   var relativeY = (e.pageY - offset.top);
	//   var degX=(238-relativeY)/238*8;
	//   var degY=(relativeX-457)/457*8;
	//   $(this).find('ul').css({
	//     'transition':'0.4s ease-out all',
	//     'transform': 'perspective(3000px)  rotateX('+degX+'deg) rotateY('+degY+'deg)',
	//     'box-shadow':'0px 0px 10px 1px rgba(0,0,0,0.4)'
	//   });
	// });
	// $(".slide-main").mouseleave(function(e) {
	//   $(this).find('ul').css({
	//     'transition':'0.4s ease-out all',
	//     'transform': 'perspective(3000px)  rotateX(0deg) rotateY(0deg)',
	//     'box-shadow':'0px 0px 0px 0px rgba(0,0,0,0)'
	//   }); 
	// });
	//单独选题页头图显示
	var topicBannerImg = $(".topic-label").find('.active').find('a').attr('topicimg');
	$(".banner").find('#topic_id_imgs').attr('src', topicBannerImg);
	// 头部通用选题标签高亮
	var thisTopicId = $("#topicid").val();
	$(".header-topic-label").find('li').removeClass('active');
	if(thisTopicId <= 0) {
		$(".header-topic-label").find('.all').addClass('active');
	} else {
		$(".header-topic-label").find('#topic_id_img_' + thisTopicId).parent('li').addClass('active');
	}
	//页码显示
	if(retPageNo == retMainPage) {
		$("#load-more-topic").remove();
		$("#pageNum").css('display', 'block');
	}
	//加载更多帖子
	$("#load-more-topic").click(function(event) {
		existThread();
		if(loadFlag == true) {
			getTopicAjax();
		}
	});

});

function showtoppicimage(obj) {
	// var url=obj.attr("topicimg");
	// $("#topic_id_imgs").attr("src",url);
}

