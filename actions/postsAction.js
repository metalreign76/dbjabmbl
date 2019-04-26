export const getPosts = postsArray => (
    {
      type: 'GET_POSTS',
      payload: postsArray
    }
  );