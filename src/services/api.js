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
      const response = await axios.get(`${BASE_URL}/users`);
      console.log('Users data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getUserPosts(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}/posts`);
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
      const users = await this.getUsers();
      console.log('Fetched users:', users);
      
      if (!users || Object.keys(users).length === 0) {
        console.error('No users found');
        return [];
      }

      const postsPromises = Object.keys(users).map(userId => this.getUserPosts(userId));
      const postsArrays = await Promise.all(postsPromises);
      const allPosts = postsArrays.flat();
      
      console.log('All posts:', allPosts);
      return allPosts;
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      return [];
    }
  }
};