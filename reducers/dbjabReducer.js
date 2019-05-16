import { combineReducers } from 'redux';
import stripHtml from 'string-strip-html';
import moment from 'moment';

var triggerDate = "2018-06-09 20:30";
//var triggerDate = "";

const imageReductionPercantage=20;

const INITIAL_STATE = {
    newsIsLoaded: false,
    newsData: [],
    newsItemVisible: false,
    newsSelectedItem: null,
    eventsError: false,
    eventData: [],
    eventItemVisible: false,
    eventSelectedItem: null,
    eventsOnNowOnNext: []    
};

const decodeChar = (match) => {
    return String.fromCharCode(match.substr(2,4));
}

removeImageSizes = (fullPost) => {
  var removeWidths = fullPost.replace(/width="[0-9]{2,4}" /g, "")
  var removeHeights = removeWidths.replace(/height="[0-9]{2,4}"/g, "")
  return removeHeights;
}

extractImage = (postContent) => {
  var firstImageLoc=postContent.indexOf('<img ')
  var firstSrcLoc=postContent.indexOf(' src=\"', firstImageLoc)
  var endOfSrcLoc=postContent.indexOf('\" ', firstSrcLoc+8);
  var imageURI = postContent.substring(firstSrcLoc+6, endOfSrcLoc);
  return imageURI;
}

const dbjabReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_POSTS':

      var updatedNews = [];
      action.payload.forEach(post => {
          var decodedTitle = post.title.rendered.replace(/&#[0-9]{2,4};/g, decodeChar)
          var decodedExcerpt = post.excerpt.rendered.replace(/&#[0-9]{2,4};/g, decodeChar)
          updatedNews.push({
              key: post.id.toString(),
              title: decodedTitle,
              excerpt: stripHtml(decodedExcerpt),
              fullPost: removeImageSizes(post.content.rendered),
              featuredImage: extractImage(post.content.rendered)
          });
      });

      const newState = { 
        ...state, 
        newsIsLoaded: true,
        newsData: updatedNews
      }
      return newState;

    case 'SHOW_NEWS_ITEM':
      const newStateVis = { 
        ...state, 
        newsItemVisible: true, 
        newsSelectedItem: action.payload 
      };
      return newStateVis;

    case 'HIDE_NEWS_ITEM':
      const newStateInVis = { ...state, newsItemVisible: false };
      return newStateInVis;

    case 'GET_EVENTS':
      const fullEventList = action.payload;
      var eventsOnNow = fullEventList.filter(e => {
        return moment(triggerDate).isBetween(e.eventStart, e.eventEnd)
      })
      var formattedEventsOnNow, formattedEventsOnNext;
      if(eventsOnNow.length == 0) {
        formattedEventsOnNow = [{key: 1, gigDetails: "No Gigs on currently"}];
      }
      else {
        formattedEventsOnNow = eventsOnNow.map((e, i) => {
          return { key: i+1, gigDetails: e.eventName + " @ " + e.eventVenue}
        })
      }
      var countOfOnNext = 0;
      var maxOnNext = 5;
      var lastStartTime;
      var eventsOnNext = fullEventList.filter(e => {
        if(moment(triggerDate).isBefore(e.eventStart)) {
          countOfOnNext++;
          if(countOfOnNext <= maxOnNext) {
            lastStartTime = e.eventStartTime
            return true;
          } 
          if(lastStartTime == e.eventStartTime) {
            return true;
          } 
        }
        return false;
      })
      if(eventsOnNext.length == 0) {
        formattedEventsOnNext = [{key: 1, gigDetails: "I'm afraid thats all folks! See you all next year"}];
      }
      else {
        formattedEventsOnNext = eventsOnNext.map((e, i) => {
          return { key: i+1, gigDetails: e.eventStartTime + " - " + e.eventName + " @ " + e.eventVenue}
        })
      }
      const newEventState = { 
        ...state, 
        eventsError: false,
        eventData: fullEventList,
        eventsOnNowOnNext: 
        [
          {
            title: 'On Now',
            data: formattedEventsOnNow
          },
          {
            title: 'Up Next',
            data: formattedEventsOnNext
          }
        ]    
      }
      console.log("On Now", formattedEventsOnNow)
      console.log("On Next", formattedEventsOnNext)
      return newEventState;

      case 'RESET_EVENTS':
        const resetEventsState = {
          ...state,
          eventsOnNowOnNext: []    
        }
        return resetEventsState;

      case 'PROBLEM_EVENTS':
        const problemEventsState = {
          ...state,
          eventsError: true,
          eventsOnNowOnNext: 
          [
            {
              title: 'On Now',
              data: [ { key:1, gigDetails: 'Problems retrieving gig info, please try again!' }]
            },
            {
              title: 'Up Next',
              data: [ { key:2, gigDetails: 'Problems retrieving gig info, please try again!' }]
            }
          ]    
        }
        return problemEventsState;

      case 'SHOW_EVENT_ITEM':
        const newEventStateVis = { 
        ...state, 
        eventItemVisible: true, 
        eventSelectedItem: action.payload 
      };
      return newEventStateVis;

    case 'HIDE_EVENT_ITEM':
      const newEventStateInVis = { ...state, eventItemVisible: false };
      return newEventStateInVis;

    default:
      return state
  }
};

export default combineReducers({
  dbjab: dbjabReducer
});