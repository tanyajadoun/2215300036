import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Alert } from '@mui/material';
import { api } from '../services/api';

function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users...');
      const users = await api.getUsers();
      console.log('Fetched users:', users);

      if (!users || Object.keys(users).length === 0) {
        setError('No users found');
        return;
      }

      const userStats = await Promise.all(
        Object.entries(users).map(async ([userId, userName]) => {
          console.log(`Fetching posts for user ${userId}`);
          const posts = await api.getUserPosts(userId);
          let totalComments = 0;
          
          await Promise.all(
            posts.map(async (post) => {
              const comments = await api.getPostComments(post.id);
              totalComments += comments?.length || 0;
            })
          );

          return {
            userId,
            userName,
            totalComments,
            postsCount: posts.length
          };
        })
      );

      // Sort by total comments and get top 5
      const sortedUsers = userStats
        .sort((a, b) => b.totalComments - a.totalComments)
        .slice(0, 5);

      console.log('Top users:', sortedUsers);
      setTopUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching top users:', error);
      setError(error.message || 'Failed to fetch top users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopUsers();
    // Refresh data every minute
    const interval = setInterval(fetchTopUsers, 60000);
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

  if (topUsers.length === 0) {
    return (
      <Box m={2}>
        <Alert severity="info">
          No user data available at the moment.
        </Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {topUsers.map((user) => (
        <Grid item xs={12} sm={6} md={4} key={user.userId}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {user.userName}
              </Typography>
              <Typography variant="body1">
                Total Comments: {user.totalComments}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Posts: {user.postsCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default TopUsers;