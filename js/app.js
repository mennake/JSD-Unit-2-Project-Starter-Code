/*
  Please add all Javascript code to this file.
*/
$(function() {


	//****************************************
	//	
	//	BORING OLD CONFIG STUFF
	//
	//*****************************************

	var nytUrl = 'https://api.nytimes.com/svc/topstories/v2/home.json';
	//The regular feed did not have photos so I had to use the top stories feed
	var nytSecretKey = config.nyt_sdk_key;
	nytUrl += '?' + $.param({
	  'api-key': nytSecretKey
	});

	var gdUrl = 'http://content.guardianapis.com/search?show-fields=all';
	//I had to query the show fields parameter so I can access thumbnails and bylines
	var gdSecretKey = config.gd_sdk_key;
	gdUrl += '&' + $.param({
	  'api-key': gdSecretKey
	});

	var buzzUrl = 'https://newsapi.org/v1/articles?source=buzzfeed&sortBy=top';
	var buzzSecretKey = config.buzz_sdk_key;
	buzzUrl += '&' + $.param({
	  'apiKey': buzzSecretKey
	});


	//****************************************
	//	
	//	GET ALL THE THINGS
	//
	//*****************************************

	//There were not ways to access information about impressions/count
	var data = [];

	function handleResponseSuccessNYT(result){
      data = result.results;
      $.each(data, function(i, item){

		    var source = document.getElementById('nty_articles').innerHTML;
			var template = Handlebars.compile(source); 
			var views = 0;
			 
			// data
			var dataFeed = {
	  		'articles': [
	  			{
  				'source_img': result.results[i].multimedia[0].url,
	  			'source_title': result.results[i].title,
	  			'source_url': result.results[i].url,
	  			'source_subtitle': result.results[i].byline,
	  			'source_desc': result.results[i].abstract,
	  			'source_views': views
	  			//added for more content
	  			}
			]};
			 
			$('#one').append (template (dataFeed));

        	//multimedia was an array so I had to access one of the photos, in this case - the first one      
    	
      });          
    }

	function handleResponseSuccessGuardian(result){
      data = result.response.results;
      $.each(data, function(i, item){
		    
		    var source = document.getElementById('gd_articles').innerHTML;
			var template = Handlebars.compile(source); 
			var views = 0;
			 
			// data
			var dataFeed = {
	  		'articles': [
	  			{
				'source_img': result.response.results[i].fields.thumbnail,
	  			'source_title': result.response.results[i].webTitle,
	  			'source_url': result.response.results[i].webUrl,
	  			'source_subtitle': result.response.results[i].fields.byline,
	  			'source_desc': result.response.results[i].fields.trailText,
	  			//added for more content
	  			'source_views': views
	  			}
			]};
			 
			$('#two').append (template (dataFeed));
			
			//had to access fields to get to thumbnail
        
           
      });
         
    }

    function handleResponseSuccessBuzz(result){
      data = result.articles;
      $.each(data, function(i, item){
       	

		    var source = document.getElementById('buzz_articles').innerHTML;
			var template = Handlebars.compile(source); 
			var views = 0;
			 
			// data
			var dataFeed = {
	  		'articles': [
	  			{
				'source_img': result.articles[i].urlToImage,
	  			'source_title': result.articles[i].title,
	  			'source_url': result.articles[i].url,
	  			'source_subtitle': result.articles[i].author,
	  			'source_desc': result.articles[i].description,
	  			'source_views': views
	  			}
			]};
			 
			$('#three').append (template (dataFeed));
        
        	//limited amount of accessible items passed in this array - switched author to impressions div           
      });
         
    }


	//****************************************
	//	
	//	SHOW ALL THE THINGS
	//
	//*****************************************

	//cannot handle multiple URLs?
	$.ajax({
	  url: nytUrl,
  	  dataType: 'json',
	  method: 'GET',
	}).done(function(result) {
	  console.log(result);
	  handleResponseSuccessNYT(result);
	}).fail(function(err) {
	  throw err;
	});

	$.ajax({
	  url: gdUrl,
  	  dataType: 'jsonp',
  	  //this is for CORS issues
	  method: 'GET',
	}).done(function(result) {
	  console.log(result);
	  handleResponseSuccessGuardian(result);
	}).fail(function(err) {
	  throw err;
	});

	$.ajax({
	  url: buzzUrl,
  	  dataType: 'json',
	  method: 'GET',
	}).done(function(result) {
	  console.log(result);
	  handleResponseSuccessBuzz(result);
	}).fail(function(err) {
	  throw err;
	});


	//****************************************
	//	
	//	WAITING
	//
	//*****************************************
 


	//****************************************
	//	
	//	POPUP
	//
	//*****************************************

	//close popup
	//links being appended dynamically to the page, need to use document.on() to capture the click events

	$(document).on('click','.closePopUp',function(e){
    	e.preventDefault();
        $('#popUp').addClass('hidden');
        $('#popUp').addClass('loader');
        $('#popUp.loader .container').css({         
            'display': 'hidden'  
        }); 
        //clear the popup so it doesn't aggregate content
        $('#popUp').html('');
        return false;
    });  


    //Open popup
    //links being appended dynamically to the page, need to use document.on() to capture the click events

	$(document).on('click','.article',function(e){

		e.preventDefault();
		//how many times have I've been clicked on
		//how do I prevent refresh
		var count = parseInt($(this).data('click'), 10) || 0;
		count++;
		$(this).data('click',count);
		console.log(count);    

		$('#popUp').removeClass('hidden');
		$('#popUp').removeClass('loader');
		$('#popUp.loader .container').css({         
			'display': 'block'  
		}); 

		var targetUrl = $(this).find('a').attr('href'); 
		var title = $(this).find('h3').text();
		var subtitle = $(this).find('h6').text();
		var abstract = $(this).find('p.full').text();

        var source = document.getElementById('popUpTemplate').innerHTML;
		var template = Handlebars.compile(source); 	 
		
		var context = { 'popup_title' : title, 'popup_content' : subtitle, 'popup_url': targetUrl, 'popup_abstract': abstract, 'popup_views': count };

		$('#popUp').append (template (context));

		return false;

	}); 

	
	//****************************************
	//	
	//	TOGGLE DROP DOWN
	//
	//*****************************************

	 $('#dropdown li a').click(function(e) {
        e.preventDefault();
        
        $('.source').hide();
 
        $($(this).attr('href')).fadeToggle('slow','linear');;
       
    });

	//****************************************
	//	
	//	TAKE ME BACK
	//
	//***************************************** 

	$('.home').click(function(e) {
		$('.source').show();
	});

	//****************************************
	//	
	//	TOGGLE SEARCH
	//
	//*****************************************

	var submitIcon = $('#search a');
	var submitInput = $('#search input');
	var searchBox = $('#search');
	var navBox = $('nav ul');
	var navBoxSub = $('ul#dropdown');
	var isOpen = false;

	submitIcon.mouseup(function(){
		return false;
	});

	searchBox.mouseup(function(){
		return false;
	});
			
	submitIcon.click(function(e){
		if(isOpen == false){
			searchBox.addClass('active');
			navBox.animate({marginRight: '220px'}, 200 );
			navBoxSub.animate({marginRight: '30px'}, 200 );
			isOpen = true;
		} else {
			searchBox.removeClass('active');
			navBox.animate({marginRight: '30px'}, 200 );
			isOpen = false;
		}
	});
});

