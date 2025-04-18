import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';


axios.interceptors.request.use(request => {
  console.log('Starting Request:', request.url);
  return request;
});


axios.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.message, error.response?.data);
    return Promise.reject(error);
  }
);

export const api = {
  async getUsers() {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers : {
            Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTYxMzM0LCJpYXQiOjE3NDQ5NjEwMzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjVmZGFhNTQ4LTVmYzktNDM5My1iNDBiLTFlOGUyYTU5ODA0MSIsInN1YiI6InRhbnlhLmphZG91bl9jcy5jc2YyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJ0YW55YS5qYWRvdW5fY3MuY3NmMjJAZ2xhLmFjLmluIiwibmFtZSI6InRhbnlhIHNpbmdoIGphZG91biIsInJvbGxObyI6IjIyMTUzMDAwMzYiLCJhY2Nlc3NDb2RlIjoiQ05uZUdUIiwiY2xpZW50SUQiOiI1ZmRhYTU0OC01ZmM5LTQzOTMtYjQwYi0xZThlMmE1OTgwNDEiLCJjbGllbnRTZWNyZXQiOiJwY3NlRnNnYkh0YUZFV3JkIn0.3kvtezO1ZkwJjKj8gBJH7t9SB-Xl3lkQqeiz8ngnm2w"
        }
      });
      console.log('Users data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUserPosts(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}/posts`, {
        
            headers : {
                Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ0OTYxMzM0LCJpYXQiOjE3NDQ5NjEwMzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjVmZGFhNTQ4LTVmYzktNDM5My1iNDBiLTFlOGUyYTU5ODA0MSIsInN1YiI6InRhbnlhLmphZG91bl9jcy5jc2YyMkBnbGEuYWMuaW4ifSwiZW1haWwiOiJ0YW55YS5qYWRvdW5fY3MuY3NmMjJAZ2xhLmFjLmluIiwibmFtZSI6InRhbnlhIHNpbmdoIGphZG91biIsInJvbGxObyI6IjIyMTUzMDAwMzYiLCJhY2Nlc3NDb2RlIjoiQ05uZUdUIiwiY2xpZW50SUQiOiI1ZmRhYTU0OC01ZmM5LTQzOTMtYjQwYi0xZThlMmE1OTgwNDEiLCJjbGllbnRTZWNyZXQiOiJwY3NlRnNnYkh0YUZFV3JkIn0.3kvtezO1ZkwJjKj8gBJH7t9SB-Xl3lkQqeiz8ngnm2w"
            }
        
      });
      console.log(`Posts for user ${userId}:`, response.data);
      return response.data.posts || [];
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      return [];
    }
  },

  async getPostComments(postId) {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
      console.log(`Comments for post ${postId}:`, response.data);
      return response.data.comments || [];
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      return [];
    }
  },

  
  async getAllPosts() {
    try {
      const usersResponse = await this.getUsers();
      console.log('Fetched users:', usersResponse);
  
      const users = usersResponse.users;
  
      if (!users || Object.keys(users).length === 0) {
        console.error('No users found');
        return [];
      }
  
      const postsPromises = Object.keys(users).map(userId => this.getUserPosts(userId));
      const postsArrays = await Promise.all(postsPromises);
      console.log('postsArrays:', postsArrays);
  
      // Flatten all posts into a single array
      const allPosts = postsArrays.flat();
  
      // Replace userId in each post with the actual user name
      const postsWithUserNames = allPosts.map(post => ({
        ...post,
        user: users[post.userId], // Replace or add a 'user' field with name
      }));
  
      console.log('All posts with user names:', postsWithUserNames);
      return postsWithUserNames;
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      return [];
    }
  }
  
};