$(document).ready(function(){
	if(!$('#b900 #categories').length) return false;

	$('#b900').prepend('<style type="text/css">.gh-buttons{margin: 1.5em;}.gh-buttons a, .gh-save-button,.gh-saved-search{margin:0!important;}.gh-filter-buttons{width:90%!important;}.gh-saved-search a{display:inline-block!important;}.gh-delete-buttons{width:10%!important;}.gh-col{width:45%;display:inline-block;vertical-align:top;margin-right:1em;}.gh-new-filter,.gh-live-search{margin-bottom: 0.5em;width:90%;}#gh-error{color:red;}</style><div class="gh-buttons"><div class="gh-col"><h4>Save a filter</h4><input class="gh-new-filter" /><div id="actionlinks" class="gh-save-button"><a id="gh-save" href="#">SAVE</a></div><div id="gh-error"></div></div></div>');
	$('.gh-buttons').append('<div class="gh-col"><h4>Saved Filters</h4><input class="gh-live-search" /></div>');
	getSaved();

	$('#gh-save').click(function(){
		var title = $('.gh-new-filter').val();
		if(!checkTitle(title)) return false;
		$('.gh-new-filter').val('');
		var category = getIDs('.catlinks', '.selected');
		var designer = getIDs('.deslinks', '.designerselected');
		var size = getIDs('.sizelinks', '.sizeselected');
		var location = getIDs('.loclinks', '.locationselected');
		// console.log(category);
		// console.log(designer);
		// console.log(size);
		var savedSearch = {
						   'title': title,
						   'category': category, 
						   'designer': designer, 
						   'size': size,
						   'location': location
						  };

		chrome.storage.sync.get('grailedSearch', function (obj) {
			console.log('yo');
			if(typeof obj === undefined)
				var grailedSearch = {'grailedSearch': []};
			else
		    	var grailedSearch = obj;
		    storeSearch(grailedSearch, savedSearch);
		    clearSaved();
		    getSaved();
		})
	})

	function getSaved(){
		chrome.storage.sync.get('grailedSearch', function (obj) {
		    console.log(obj['grailedSearch']);
		    var arr = obj['grailedSearch'];
		    for(var i = 0; i < arr.length; i++){
		    	var htmlButton = '<div class="gh-saved-search" id="actionlinks"><a class="gh-filter-buttons" id="gh-button-' + i +'" href="#">' + arr[i]["title"] + '</a><a class="gh-delete-buttons" id="gh-delete-' + i +'" href="#">X</a></div>';
		    	$('.gh-live-search').after(htmlButton);
		    }
		    $('.gh-filter-buttons').click(function(){
		    	var buttonID = /\d/.exec($(this).attr('id'))[0];
				console.log(buttonID);
				chrome.storage.sync.get('grailedSearch', function (obj) {
					var filters = obj['grailedSearch'][buttonID];
					console.log(filters);
					window.history.pushState({}, "", "/");
					$('.removeall').trigger('click');
					$('.dremoveall').trigger('click');
					$('.sremoveall').trigger('click');
					filters["category"].forEach(function(element){
						triggerClick('.catlinks', element);
					})
					filters["designer"].forEach(function(element){
						triggerClick('.deslinks', element);
					})
					filters["size"].forEach(function(element){
						triggerClick('.sizelinks', element);
					})	
					

				})
			})
			$('.gh-delete-buttons').click(function(){
				var buttonID = /\d/.exec($(this).attr('id'))[0];
				$(this).parent().remove();
				obj['grailedSearch'].splice(buttonID, 1);
		        chrome.storage.sync.set(obj, function() {
		          console.log('removed');

		        });
			})


		});
	}
	function clearSaved(){
		$('.gh-saved-search').remove();
	}

	function getIDs(catName, selectedName){
		var arr = $(catName + ' ' + selectedName);
		var res = [];
		for(var i = 0; i < arr.length; i++){
			res.push(arr[i].id);
		}
		return res;
	}
	function storeSearch(grailedSearch, newSearch){
		grailedSearch["grailedSearch"].push(newSearch);
		console.log(grailedSearch["grailedSearch"]);
        chrome.storage.sync.set(grailedSearch, function() {
          console.log(grailedSearch + ' saved');
        });
	}
	function triggerClick(catName, id){
		$(catName + ' #' + id).trigger('click');
	}

	/* live search of filters */
	function filter(element) {
	    var $savedSearches = $('.gh-buttons .gh-saved-search').hide();
	    var regexp = new RegExp($(element).val(), 'i');

	    var $valid = $savedSearches.filter(function () {
	        return regexp.test($(this).find('a').text())
	    }).show();

	    $savedSearches.not($valid).hide()
	}

	$('.gh-live-search').on('keyup change', function () {
	    filter(this);
	})

	/* input validation */
	function checkTitle(title){
		if(title.length > 20){
			$('#gh-error').text('Title must be fewer than 20 characters.');
			return 0;
		}else if(title.length == 0){
			$('#gh-error').text('Enter a title.');
			return 0;
		}
		return 1;
	}
})





