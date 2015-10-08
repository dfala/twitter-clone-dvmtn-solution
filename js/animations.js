$( document ).ready(function() {
  // INIT
  var textarea = $('#main-compose'),
      tweetControls = $('#tweet-controls'),
      charCount = $('#char-count'),
      tweetSubmit = $('#tweet-submit'),
      charLeft,
      tweet = $('.tweet'),
      tweetCompose = $('.tweet-compose'),
      tweetActions = $('.tweet-actions');

  var localTweets = JSON.parse(localStorage.getItem("tweet")) || [];

  if (localTweets.length) {
    localTweets.forEach(function (tweet) {
      createTweet(tweet.text, tweet.date);
    });
  };


  textarea.click(function (e) {
    textarea.css('min-height', '5rem');
    tweetControls.css('display', 'inherit');
  })


  textarea.keyup(function (e) {
    console.warn(e);
    charLeft = 140 - e.target.value.length;
    charCount.text(charLeft);

    if (charLeft < 0) {
      makeCharCountRed();
      tweetSubmit.attr('disabled', 'disabled');
    } else if (charLeft < 10) {
      makeCharCountRed();
    } else if (charLeft > 10) {
      makeCharCountBlack();
      tweetSubmit.removeAttr('disabled');
    } else if (charLeft > 0) {
      tweetSubmit.removeAttr('disabled');
    }

  })

  textarea.keyup(function(e){
    if(e.keyCode == 8) {
      charLeft = 140 - e.target.value.length;

      if (charLeft > 139) {
        tweetSubmit.attr('disabled', 'disabled');
      } else if (charLeft > 0) {
        makeCharCountBlack();
        tweetSubmit.removeAttr('disabled');
      }
    }
  });

  function makeCharCountRed () {
    charCount.css('color', 'red');
  }

  function makeCharCountBlack () {
    charCount.css('color', 'inherit');
  }

  // TOOLTIPS
  $('[data-toggle="tooltip"]').tooltip();

  // ADDING A NEW TWEET
  tweetSubmit.click(function (e) {
    if (charLeft && charLeft < 140 && charLeft > -1) {
      var tweetVal = textarea.val();
      var tweetDate = new Date();

      createTweet(tweetVal, tweetDate);
      localTweets.push({
        text: tweetVal,
        date: tweetDate
      });
      localStorage.setItem('tweet', JSON.stringify(localTweets));

      // Reset normal compose tweet
      textarea.val('');
      charCount.text(140);
      tweetSubmit.attr('disabled', 'disabled');
    }
  });

  function createTweet (tweet, postedDate) {
    var stream = $('#stream');
    if (! postedDate) postedDate = new Date();

    stream.prepend(
      '<div class="tweet">'
        + '<div class="content">'
          + '<img class="avatar" src="img/alagoon.jpg" data-toggle="tooltip" data-placement="top" title="Daniel Falabella" />'
          + '<strong class="fullname">Daniel Falabella </strong>'
          + '<span class="username">@dnlfala</span>'

          + '<p class="tweet-text">' + tweet + '</p>'

          + '<div class="tweet-actions">'
            + '<ul>'
              + '<li><span class="icon action-reply"></span> Reply</li>'
              + '<li><span class="icon action-retweet"></span> Retweet</li>'
              + '<li><span class="icon action-favorite"></span> Favorite</li>'
              + '<li><span class="icon action-more"></span> More</li>'
          + '</ul>'
          + '</div>'

          + '<div class="stats">'
            + '<div class="retweets">'
              + '<p class="num-retweets">0</p>'
              + '<p>RETWEETS</p>'
            + '</div>'
            + '<div class="favorites">'
              + '<p class="num-favorites">0</p>'
              + '<p>FAVORITES</p>'
            + '</div>'

            + '<div class="time">'
              // + '1:04 PM - 19 Sep 13'
              + jQuery.timeago(postedDate)
            + '</div>'
          + '</div>'
          + '<div class="reply hide">'
            + '<img class="avatar" src="img/alagoon.jpg"/>'
            + '<textarea class="tweet-compose" placeholder="Reply to @mybff"/></textarea>'
          + '</div>'
        + '</div>'
      + '</div>'
    );

    resetSteps();

  };



  function resetSteps () {
  	actionTweets($('.tweet'), $('.tweet-compose'));
  	$('#tweet-content textarea').val('');
  	$('#tweet-content textarea').css('height', '2.5em');
  	//$('#tweet-controls').css('display', 'none');

    $('[data-toggle="tooltip"]').tooltip();
  };


  function actionTweets (myTweets, replyTextareas) {
   myTweets
    .mouseenter(function() {
      $( this ).find( ".tweet-actions" ).css('visibility', 'inherit');
    })
    .mouseleave(function() {
      $( this ).find( ".tweet-actions" ).css('visibility', 'hidden');
    })
    //The Retweets/timestamp/Reply areas should also be hidden by default. These should
    //only expand if you click on the tweet. Have the students use a jQuery animation to
    //accomplish the reveal, similar to how it’s done on Twitter.com
    .on('click', function (e) {
    	if ($(this).hasClass('expanded-tweet')) {
    		$(this).removeClass('expanded-tweet', 150, 'swing');
    	} else {
    		$(this).addClass('expanded-tweet', 150, 'swing');
    	}
    });

	//prevent closing when clicking on reply textarea
	$(replyTextareas).click(function (event) {
		event.stopPropagation();
	})
}

actionTweets(tweet, tweetCompose);

});
