WATCHED_ACCOUNTS = ['3178995865', '42061404']
var watchedAccountsString = "";
WATCHED_ACCOUNTS.forEach(function(acct) {
  watchedAccountsString += (acct + ",");
});
console.log(watchedAccountsString);
console.log('app running');
var Twit = require('twit');
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

// var atMe = T.stream('statuses/filter', {track: '@joenguyentester'});
// atMe.on('tweet', function(tweet){
//   console.log(tweet);
// });

// watch(watchedAccountsString.slice(0,-1));
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

monitorAccount('joenguyentester');

// var testSearch = "the weirdest testing bot at this event right now";
// var testSearch2 = "I%20forgot%20to%20shower%20before%20this%20dinner%20party%2C%20but%20I%20sat%20near%20the%20cheese%20plate%20so%20it%27s%20all%20good.";
// var testSearch3 = "the weirdest testing bot at this event right now FINDTHISTWEETOMGDLKFJD"
// searchTwitter(testSearch3);

// @joenguyentester: '3178995865',
// @vietjew: '42061404'


// { metadata: { iso_language_code: 'en', result_type: 'recent' },
//   created_at: 'Sat Aug 22 19:41:19 +0000 2015',
//   id: 635174932649906200,
//   id_str: '635174932649906176',
//   text: 'I\'m the weirdest testing bot at this event right now FINDTHISTWEETOMGDLKFJDLKSFJDSKLFJDKLSFJKSDL',
//   source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
//   truncated: false,
//   in_reply_to_status_id: null,
//   in_reply_to_status_id_str: null,
//   in_reply_to_user_id: null,
//   in_reply_to_user_id_str: null,
//   in_reply_to_screen_name: null,
//   user:
//    { id: 3178995865,
//      id_str: '3178995865',
//      name: 'Joseph Nguyen',
//      screen_name: 'joenguyentester',
//      location: '',
//      description: '',
//      url: null,
//      entities: [Object],
//      protected: false,
//      followers_count: 0,
//      friends_count: 1,
//      listed_count: 0,
//      created_at: 'Wed Apr 29 05:30:25 +0000 2015',
//      favourites_count: 0,
//      utc_offset: null,
//      time_zone: null,
//      geo_enabled: false,
//      verified: false,
//      statuses_count: 25,
//      lang: 'en',
//      contributors_enabled: false,
//      is_translator: false,
//      is_translation_enabled: false,
//      profile_background_color: 'C0DEED',
//      profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
//      profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
//      profile_background_tile: false,
//      profile_image_url: 'http://pbs.twimg.com/profile_images/593286474826547201/Mg4Euv3X_normal.jpg',
//      profile_image_url_https: 'https://pbs.twimg.com/profile_images/593286474826547201/Mg4Euv3X_normal.jpg',
//      profile_link_color: '0084B4',
//      profile_sidebar_border_color: 'C0DEED',
//      profile_sidebar_fill_color: 'DDEEF6',
//      profile_text_color: '333333',
//      profile_use_background_image: true,
//      has_extended_profile: false,
//      default_profile: true,
//      default_profile_image: false,
//      following: false,
//      follow_request_sent: false,
//      notifications: false },
//   geo: null,
//   coordinates: null,
//   place: null,
//   contributors: null,
//   is_quote_status: false,
//   retweet_count: 0,
//   favorite_count: 0,
//   entities: { hashtags: [], symbols: [], user_mentions: [], urls: [] },
//   favorited: false,
//   retweeted: false,
//   lang: 'en' }
