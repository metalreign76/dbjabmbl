import { combineReducers } from 'redux';

const INITIAL_STATE = {
  titles: [],
  posts: []
};

const decodeChar = (match) => {
    return String.fromCharCode(match.substr(2,4));
}

const postsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_POSTS':
        // const {
        //     titles,
        //     posts
        // } = state;

        var titles = [];
        var posts = [];
        var unicodeChars ;

        action.payload.forEach(post => {
            var decodedString = post.title.rendered.replace(/&#[0-9]{4};/g, decodeChar)
            titles.push({id: post.id, key: decodedString});
            posts.push({id: post.id, content: post.content.rendered });
        });

       const newState = { titles, posts };
        return newState;

    default:
      return state
  }
};

export default combineReducers({
  posts: postsReducer
});