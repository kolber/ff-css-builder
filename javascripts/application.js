// onDOMReady
$(function () {

	/*
	*
	*	Search
	*
	*/

	// clear input to counter form content caching
	if($('#search-projects').length > 0) {
		$('#search-projects')[0].value = "";
	}
	// delimiting search event
	$('#search-projects').keyup(function () {
		// hide empty text
		$(".empty-result").remove();
		// setup target and regular expression for search term
		var target = $('.project');
		var search_term = new RegExp(this.value.replace(/\\/g, ''), "i");
		// hide all delimitable elements (& corresponding dates)
		target.parent().hide().prev("p.duplicate-year").css("display", "none");
		// show elements which contain search term (& corresponding dates)
		target.filter(function() {
			return ($(this).text() + $(this).prev("p.month").text() + $(this).parent().prev("p.year, p.duplicate-year").text()).match(search_term);
		}).parent().show().prev("p.duplicate-year").show().prevAll("p.year").show();
		
		// hide any duplicate year which sits directly next to a visible year
		$('p.duplicate-year').filter(function() {
			return ($(this).prevAll(":visible")[0].className == "year");
		}).css("display", "none");

		// above code removes focus from the input, so refocus it
		this.focus();
	});
	
	/*
	*
	*	Keyword truncation
	*
	*/
	
	var h4s = $(".project h4");
	for(var i=0; i < h4s.length; i++) {
		// one line of javascript that proves there is a god
		$(h4s[i]).html($(h4s[i]).text().replace(/(.+?,){8}/, function($1){return "<span>"+$1.slice(0, -1)+"...</span>"}));
	}
	
	/*
	*
	*	Scroll-loading
	*
	*/
	
	// FIXME: Pull out into it's own include
	var scrollLoad = {
		offset: 0,
		loading: false,
		// FIXME: Why does currentPage need to start at 2?
		currentPage: 2,
		totalPages: 3,
		
		// FIXME: Clean up to allow loadProjects function to be passed through
		init: function(offset) {
			this.offset = offset;
			this.registerEvents();
			this.checkScrollLimitReached();
		},
		
		registerEvents: function() {
			var _this = this;
			$(window).bind('scroll', function() { _this.checkScrollLimitReached.call(_this); });
		},
		
		checkScrollLimitReached: function() {
			if(($(document).height()-$(window).scrollTop()-$(window).height()) < this.offset && !this.loading) {
				if(this.currentPage <= this.totalPages) {
					this.loading = true;
					this.loadProjects.call(this);
				} else {
					$(window).unbind('scroll');
				}
			}
		},
		
		loadProjects: function() {
			var _this = this;
			$.ajax({
				type: "GET",
				dataType: 'json',
				url: "/projects",
				data: { page: _this.currentPage++ },
				complete: function(response){
					if(response.responseText != ' ') {
						$("div.projects").append(response.responseText);
						hideDuplicateYears();
						_this.loading = false;
					}
				}
			});
		}
	}
	
	// scrollLoad.init(40);
});