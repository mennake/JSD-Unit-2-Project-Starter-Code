/*
  Please add all Javascript code to this file.
*/
$(function() {


	//set up my configuration
	var nytUrl = "https://api.nytimes.com/svc/topstories/v2/home.json";
	//The regular feed did not have photos so I had to use the top stories feed
	var nytSecretKey = config.nyt_sdk_key;
	nytUrl += '?' + $.param({
	  'api-key': nytSecretKey
	});

	var gdUrl = "http://content.guardianapis.com/search?show-fields=all";
	//I had to query the show fields parameter so I can access thumbnails and bylines
	var gdSecretKey = config.gd_sdk_key;
	gdUrl += '&' + $.param({
	  'api-key': gdSecretKey
	});

	var buzzUrl = "https://newsapi.org/v1/articles?source=buzzfeed&sortBy=top";
	var buzzSecretKey = config.buzz_sdk_key;
	buzzUrl += '&' + $.param({
	  'apiKey': buzzSecretKey
	});

	//get all the data
	//I am sure there is a more succinct way to do this
	//There were not ways to access information about impressions/count
	function handleResponseSuccessNYT(result){
      var data = result.results;
      $.each(data, function(i, item){

       	$('#one').append("<article class=\"article\"><section class=\"featuredImage\"><img src=\""+result.results[i].multimedia[0].url+"\" alt=\"\" /></section><section class=\"articleContent\"><a class=\"popUpLink\" href=\"#\"><h3>"+result.results[i].title+"</h3></a><h6>"+result.results[i].byline+"</h6></section><section class=\"impressions\">"+result.results[i].section+"</section><div class=\"clearfix\"></div></article>");
        //multimedia was an array so I had to access one of the photos, in this case - the first one   
        $('.popUpLink').click( function() {
	        showPopupBox();
	        return false;
	    }); 
	    //pop up needs to be in iteration      
	    $('.closePopUp').click( function() {
	        closePopupBox();
	        return false;
	    });      
      });
    }

	function handleResponseSuccessGuardian(result){
      var data = result.response.results;
      $.each(data, function(i, item){
       	
        $('#two').append("<article class=\"article\"><section class=\"featuredImage\"><img src=\""+result.response.results[i].fields.thumbnail+"\" alt=\"\" /></section><section class=\"articleContent\"><a class=\"popUpLink\" href=\"#\"><h3>"+result.response.results[i].webTitle+"</h3></a><h6>"+result.response.results[i].fields.byline+"</h6></section><section class=\"impressions\">"+result.response.results[i].sectionName+"</section><div class=\"clearfix\"></div></article>");
         $('.popUpLink').click( function() {
	        showPopupBox();
	        return false;
	    });  
	    $('.closePopUp').click( function() {
	        closePopupBox();
	        return false;
	    });             
      });
    }

    function handleResponseSuccessBuzz(result){
      var data = result.articles;
      $.each(data, function(i, item){
       	
        $('#three').append("<article class=\"article\"><section class=\"featuredImage\"><img src=\""+result.articles[i].urlToImage+"\" alt=\"\" /></section><section class=\"articleContent\"><a class=\"popUpLink\" href=\"#\"><h3>"+result.articles[i].title+"</h3></a><h6>"+result.articles[i].description+"</h6></section><section class=\"impressions\">"+result.articles[i].author+"</section><div class=\"clearfix\"></div></article>");
        //limited amount of accessible items passed in this array - switched author to impressions div   
         $('.popUpLink').click( function() {
	        showPopupBox();
	        return false;
	    }); 
	    $('.closePopUp').click( function() {
	        closePopupBox();
	        return false;
	    });          
      });
    }


	//show the data
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

	//popup
    function showPopupBox() {   
        $('#popUp').removeClass('hidden');
        $('#popUp').removeClass('loader');
        $('#popUp.loader .container').css({         
            "display": 'block'  
        }); 
    } 
    function closePopupBox() {   
        $('#popUp').addClass('hidden');
        $('#popUp').addClass('loader');
        $('#popUp.loader .container').css({         
            "display": 'hidden'  
        }); 
    }       


	//toggle dropdown
	 $("#dropdown li a").click(function(e) {
        e.preventDefault();
        
        $('.source').hide();
 
        $($(this).attr('href')).fadeToggle("slow","linear");;
       
    });


	//toggle search
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