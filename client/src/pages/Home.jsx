import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VillaIcon from '@mui/icons-material/Villa';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings?search=${searchQuery}`);
  };

  const categories = [
    { title: 'Hotels', icon: <HotelIcon sx={{ fontSize: 40 }} />, count: '1,234' },
    { title: 'Apartments', icon: <ApartmentIcon sx={{ fontSize: 40 }} />, count: '2,567' },
    { title: 'Villas', icon: <VillaIcon sx={{ fontSize: 40 }} />, count: '891' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("/images/hero-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Find Your Perfect Stay
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Discover amazing properties and experiences around the world
          </Typography>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              gap: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 2,
              borderRadius: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Where are you going?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <LocationOnIcon color="action" />,
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SearchIcon />}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Browse by Category
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={12} md={4} key={category.title}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <IconButton
                  sx={{
                    backgroundColor: 'primary.light',
                    mb: 2,
                    '&:hover': { backgroundColor: 'primary.main' },
                  }}
                >
                  {category.icon}
                </IconButton>
                <Typography variant="h5" component="h3" gutterBottom>
                  {category.title}
                </Typography>
                <Typography color="text.secondary">
                  {category.count} listings
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Properties */}
      <Box sx={{ backgroundColor: 'grey.100', py: 8 }}>
        <Container>
          <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
            Featured Properties
          </Typography>
          <Grid container spacing={4}>
            {/* Featured property cards will be dynamically loaded here */}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
