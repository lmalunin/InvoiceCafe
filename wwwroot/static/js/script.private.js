/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
	initialDate = new Date(),
	$document = $(document),
	isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,

	plugins = {
		rdNavbar: $(".rd-navbar"),
		progressBar: $(".progress-bar"),
		responsiveTabs: $(".responsive-tabs"),
	};

/**
 * Initialize All Scripts
 */
$document.ready(function () {


	/**
	 * isScrolledIntoView
	 * @description  check the element whas been scrolled into the view
	 */
	function isScrolledIntoView(elem) {
		var $window = $(window);
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}


	/**
	 * Copyright Year
	 * @description  Evaluates correct copyright year
	 */
	var o = $("#copyright-year");
	if (o.length) {
		o.text(initialDate.getFullYear());
	}









	/**
	 * RD Navbar
	 * @description Enables RD Navbar plugin
	 */
	if (plugins.rdNavbar.length) {
		plugins.rdNavbar.RDNavbar({
			stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone")) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false
		});
		if (plugins.rdNavbar.attr("data-body-class")) {
			document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
		}
	}



	/**
	 * Responsive Tabs
	 * @description Enables Responsive Tabs plugin
	 */
	if (plugins.responsiveTabs.length > 0) {
		var i;
		for (i = 0; i < plugins.responsiveTabs.length; i++) {
			var responsiveTabsItem = $(plugins.responsiveTabs[i]);
			responsiveTabsItem.easyResponsiveTabs({
				type: responsiveTabsItem.attr("data-type") === "accordion" ? "accordion" : "default"
			});
		}
	}

	/*function Auction(){
		var _this = this;
		_this.btn =  $(".auctionBtn");
		_this.up = $('.auctionPopup');
		console.log()
		_this.btn.on('click',function(){
			_this.up.addClass('show')
		})
	}
	var auction = new Auction()
*/



});

