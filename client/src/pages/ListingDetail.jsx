import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Avatar,
  Rating,
  TextField,
  CircularProgress,
  Chip,
  ImageList,
  ImageListItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocationOn,
  Person,
  Hotel,
  Kitchen,
  Wifi,
  LocalParking,
  Pool,
  Spa,
  Share,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [review, setReview] = useState({ rating: 0, comment: '' });
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`/listings/${id}`);
      setListing(response.data);
      setIsFavorite(response.data.isFavorited);
    } catch (err) {
      setError('Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/listings/${id}/reviews`, review);
      fetchListing(); // Refresh to show new review
      setReview({ rating: 0, comment: '' });
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post(`/listings/${id}/favorite`);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  const amenities = [
    { icon: <Hotel />, label: 'Furnished' },
    { icon: <Kitchen />, label: 'Kitchen' },
    { icon: <Wifi />, label: 'Free WiFi' },
    { icon: <LocalParking />, label: 'Parking' },
    { icon: <Pool />, label: 'Pool' },
    { icon: <Spa />, label: 'Spa' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            {listing.title}
          </Typography>
          <Box>
            <IconButton onClick={() => {}} sx={{ mr: 1 }}>
              <Share />
            </IconButton>
            <IconButton onClick={toggleFavorite} color={isFavorite ? 'secondary' : 'default'}>
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography>
            {listing.location}, {listing.country}
          </Typography>
        </Box>
      </Box>

      {/* Image Gallery */}
      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden', borderRadius: 2 }}>
        <ImageList variant="quilted" cols={4} rowHeight={200}>
          <ImageListItem cols={2} rows={2}>
            <img
              src={listing.image.url}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </ImageListItem>
          {/* Add more images when available */}
        </ImageList>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              About this place
            </Typography>
            <Typography paragraph>{listing.description}</Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Amenities
            </Typography>
            <Grid container spacing={2}>
              {amenities.map((amenity) => (
                <Grid item xs={6} sm={4} key={amenity.label}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {amenity.icon}
                    <Typography>{amenity.label}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Reviews Section */}
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Reviews
            </Typography>
            
            {user && (
              <Box component="form" onSubmit={handleReviewSubmit} sx={{ mb: 4 }}>
                <Rating
                  value={review.rating}
                  onChange={(_, value) => setReview(prev => ({ ...prev, rating: value }))}
                  size="large"
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Share your experience..."
                  value={review.comment}
                  onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" type="submit">
                  Submit Review
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {listing.reviews?.map((review) => (
              <Box key={review._id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 2 }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {review.author.username}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Box>
                </Box>
                <Typography color="text.secondary">{review.comment}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              position: 'sticky',
              top: 100,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
              ${listing.price}
              <Typography component="span" variant="h6" color="text.secondary">
                {' '}
                / night
              </Typography>
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Highlights:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Instant Book" color="primary" size="small" />
                <Chip label="Self Check-in" color="primary" variant="outlined" size="small" />
                <Chip label="Superhost" color="secondary" size="small" />
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => navigate('/booking')}
              sx={{ mb: 2 }}
            >
              Book Now
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              You won't be charged yet
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ListingDetail;
