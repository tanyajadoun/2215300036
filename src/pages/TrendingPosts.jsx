import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Alert } from '@mui/material';
import { api } from '../services/api';

function TrendingPosts() {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendingPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all posts...');
      const allPosts = await api.getAllPosts();
      
      if (allPosts.length === 0) {
        setError('No posts found');
        return;
      }

      console.log('Fetching comments for all posts...');
      const postsWithComments = await Promise.all(
        allPosts.map(async (post) => {
          const comments = await api.getPostComments(post.id);
          return {
            ...post,
            commentCount: comments?.length || 0
          };
        })
      );

      // Find the maximum comment count
      const maxComments = Math.max(...postsWithComments.map(post => post.commentCount));
      console.log('Maximum comments:', maxComments);
      
      // Filter posts with maximum comments
      const trending = postsWithComments
        .filter(post => post.commentCount === maxComments)
        .sort((a, b) => b.id - a.id); // Sort by post ID for newest first

      console.log('Trending posts:', trending);
      setTrendingPosts(trending);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      setError(error.message || 'Failed to fetch trending posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingPosts();
    // Refresh data every minute
    const interval = setInterval(fetchTrendingPosts, 60000);
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

  if (trendingPosts.length === 0) {
    return (
      <Box m={2}>
        <Alert severity="info">
          No trending posts available at the moment.
        </Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {trendingPosts.map((post) => (
        <Grid item xs={12} sm={6} md={4} key={post.id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User ID: {post.userid}
              </Typography>
              <Typography variant="body1" paragraph>
                {post.content}
              </Typography>
              <Typography variant="body2" color="primary">
                Comments: {post.commentCount}
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

export default TrendingPosts;