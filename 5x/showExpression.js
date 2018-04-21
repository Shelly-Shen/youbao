$(function(){
	emojify.setConfig({
		emojify_tag_type : 'div,a,p,span,figcaption',
		img_dir          : '/images/emoji',  // Directory for emoji images
		ignored_tags     : {                // Ignore the following tags
			'SCRIPT'  : 1,
			'PRE'     : 1,
			'CODE'    : 1
		}
	});
	emojify.run();
});


