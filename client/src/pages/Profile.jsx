import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Tab,
  Tabs,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const Profile = () => {
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userListings, setUserListings] = useState([]);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [listingsRes, favoritesRes] = await Promise.all([
        axios.get('/listings/user'),
        axios.get('/listings/favorites'),
      ]);
      setUserListings(listingsRes.data);
      setFavoriteListings(favoritesRes.data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleEditProfile = async () => {
    try {
      await axios.put('/user/profile', profileData);
      setOpenEdit(false);
      // Refresh user data
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const ListingCard = ({ listing }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: '0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={listing.image.url}
        alt={listing.title}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h3">
          {listing.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.location}, {listing.country}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${listing.price} / night
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
          color: 'white',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: 'secondary.main',
                fontSize: '3rem',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user?.username}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <EmailIcon />
              <Typography>{user?.email}</Typography>
            </Box>
            <Typography variant="body1" sx={{ maxWidth: 600 }}>
              {profileData.bio || 'No bio yet'}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setOpenEdit(true)}
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)' }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'white',
            }}
          >
            <HomeIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{userListings.length}</Typography>
            <Typography>Listings</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'secondary.light',
              color: 'white',
            }}
          >
            <FavoriteIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{favoriteListings.length}</Typography>
            <Typography>Favorites</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'success.light',
              color: 'white',
            }}
          >
            <StarIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">4.8</Typography>
            <Typography>Average Rating</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          centered
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 120,
            },
          }}
        >
          <Tab label="My Listings" icon={<HomeIcon />} iconPosition="start" />
          <Tab label="Favorites" icon={<FavoriteIcon />} iconPosition="start" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Grid container spacing={3}>
            {userListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing._id}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Grid container spacing={3}>
            {favoriteListings.map((listing) => (
              <Grid item xs={12} sm={6} md={4} key={listing._id}>
                <ListingCard listing={listing} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>

      {/* Edit Profile Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditProfile}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
