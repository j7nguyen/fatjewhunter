WATCHED_ACCOUNTS = ['3178995865', '42061404']
var watchedAccountsString = "";
WATCHED_ACCOUNTS.forEach(function(acct) {
  watchedAccountsString += (acct + ",");
});
console.log(watchedAccountsString);
console.log('app running');
var Twit = require('twit');
var express = require('express');
var app = express();
app.get('/', function (req, res) {
  res.send("The Fat Jew Hunter will catch you joke thieves!");
});
var port = process.env.PORT || 3000;
app.listen(port);


var T = new Twit(require('./config.js'));

function postTweet(message) {
  T.post('statuses/update', { status: message }, function(err, data, response) {
    console.log(data);
  })
}

function retweet(tweetID) {
  T.post('statuses/retweet/:id', { id: tweetID }, function (err, data, response) {
  console.log(data)
  })
}

function watchAccount(accountString) {
    console.log("watching " + accountString);
    var stream = T.stream('statuses/filter', {follow: accountString});
    stream.on('tweet', function(tweet){
      console.log("USER TWEETED");
      processTweet(tweet);
    })
}

function processTweet(status) {
  console.log("tweet detected!!");
  if (!!status.retweeted_status) {
    console.log("Retweet");
  } else {
    var scrutinizedID = status.id_str;
    var joke = status.text;
    console.log("joke: " + status.text);
    searchTwitter(joke, scrutinizedID);
  }
}

function monitorAccount(screenName) {
  var userID;
  T.get('users/lookup', {screen_name: screenName},
    function(err, data, response) {
      userID = data[0].id_str;
      console.log("user id: " + userID);
      watchAccount(userID);
    });
}

function searchTwitter(joke, scrutinizedID) {
  T.get('search/tweets', {q: joke}, function(err, data, response){
    var statuses = data.statuses;
    console.log(statuses);
    processResults(statuses, joke, scrutinizedID);
  });
}

function processResults(statuses, joke, scrutinizedID) {
  console.log("attempting to process results");
  statuses.forEach(function(status){
    var statusText = status.text;
    if (statusText == joke) {
      var originalStatusID = status.id_str;
      var originalPoster = status.user.screen_name;
      console.log("MATCH FOUND!!!! Original tweet: " + originalStatusID);
      console.log("Original user: " + originalPoster);
      retweet(originalStatusID);
      retweet(scrutinizedID);
    }
  });
}

function retweet(tweetID) {
  T.post('statuses/retweet/:id', { id: tweetID }, function (err, data, response) {
    console.log(data);
  });
}

// monitorAccount('joenguyentester');
watchAccount(watchedAccountsString);
