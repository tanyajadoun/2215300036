import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Alert } from '@mui/material';
import { api } from '../services/api';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching posts...');
      const allPosts = await api.getAllPosts();
      console.log('Fetched posts:', allPosts);
      
      if (allPosts.length === 0) {
        setError('No posts found');
        return;
      }
      
      
      const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // Fetch new posts every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Box m={2}>
        <Alert severity="info">
          No posts available at the moment.
        </Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User ID: {post.userid}
              </Typography>
              <Typography variant="body1">
                {post.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Post ID: {post.id}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Feed;