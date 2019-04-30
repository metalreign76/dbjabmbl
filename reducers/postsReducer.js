import { combineReducers } from 'redux';
import stripHtml from "string-strip-html";

const imageReductionPercantage=20;

const INITIAL_STATE = {
  news: [],
  newsItemVisible: false,
  selectedNewsItem: null
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

const postsReducer = (state = INITIAL_STATE, action) => {
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

      const newState = { ...state, news: updatedNews };
      return newState;

    case 'SHOW_NEWS_ITEM':
      const newStateVis = { 
        ...state, 
        newsItemVisible: true, 
        selectedNewsItem: action.payload 
      };
      return newStateVis;

    case 'HIDE_NEWS_ITEM':
      const newStateInVis = { ...state, newsItemVisible: false };
      return newStateInVis;

    default:
      return state
  }
};

export default combineReducers({
  posts: postsReducer
});