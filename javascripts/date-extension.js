// hide pagination div if js is enabled (before jquery loads)
//var divs = document.getElementsByTagName("div");
//for(var i in divs) if (divs[i].className == 'pagination') divs[i].style.display = 'none';

// hide all duplicate years (removed from jquery blocks to prevent flickering)
hideDuplicateYears = function() {
	var ps = document.getElementsByTagName("p");
	var years = [];
	for(var i in ps) if (ps[i].className == 'year') years.push(ps[i]);
	var lastYear = '';
	for(var i in years) {
		if(lastYear == years[i].innerHTML) years[i].className = 'duplicate-year';
		else years[i].className = 'year';
		lastYear = years[i].innerHTML;
	}
}

// function calls
hideDuplicateYears();