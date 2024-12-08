import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    fetchListings();
  }, [location.search, page]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        search: searchQuery,
        priceRange,
      });
      
      const response = await axios.get(`/listings?${params}`);
      setListings(response.data.listings);
      setTotalPages(Math.ceil(response.data.total / 12)); // Assuming 12 items per page
    } catch (err) {
      setError('Failed to fetch listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (priceRange) params.set('priceRange', priceRange);
    navigate(`/listings?${params.toString()}`);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search and Filter Section */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          mb: 4,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          sx={{ flexGrow: 1 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by location or title"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Price Range</InputLabel>
          <Select
            value={priceRange}
            onChange={handlePriceRangeChange}
            label="Price Range"
          >
            <MenuItem value="">All Prices</MenuItem>
            <MenuItem value="0-50">$0 - $50</MenuItem>
            <MenuItem value="51-100">$51 - $100</MenuItem>
            <MenuItem value="101-200">$101 - $200</MenuItem>
            <MenuItem value="201+">$201+</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Listings Grid */}
      {error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <>
          <Grid container spacing={4}>
            {loading
              ? Array.from(new Array(12)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Card>
                      <Skeleton variant="rectangular" height={200} />
                      <CardContent>
                        <Skeleton />
                        <Skeleton width="60%" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              : listings.map((listing) => (
                  <Grid item key={listing._id} xs={12} sm={6} md={4}>
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
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/listings/${listing._id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={listing.image.url}
                        alt={listing.title}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h2">
                          {listing.title}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                            mb: 1,
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
                          <Typography variant="body2">
                            {listing.location}, {listing.country}
                          </Typography>
                        </Box>
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          ${listing.price} / night
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Listings;
