export const getPosts = postsArray => (
    {
      type: 'GET_POSTS',
      payload: postsArray
    }
);

export const showNewsItem = selectedNewsItem => (
  {
      type: 'SHOW_NEWS_ITEM',
      payload: selectedNewsItem
  }
);

export const hideNewsItem = () => (
  {
      type: 'HIDE_NEWS_ITEM'
  }
);