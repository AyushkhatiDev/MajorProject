import { useState, useEffect } from 'react';
import { listingsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export const useListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchListings = async (params) => {
        try {
            setLoading(true);
            const data = await listingsApi.getAll(params);
            setListings(data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    };

    const createListing = async (listingData) => {
        try {
            setLoading(true);
            const data = await listingsApi.create(listingData);
            setListings(prev => [...prev, data]);
            navigate(`/listings/${data._id}`);
            return data;
        } catch (err) {
            setError(err.message || 'Failed to create listing');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateListing = async (id, listingData) => {
        try {
            setLoading(true);
            const data = await listingsApi.update(id, listingData);
            setListings(prev => prev.map(listing => 
                listing._id === id ? data : listing
            ));
            return data;
        } catch (err) {
            setError(err.message || 'Failed to update listing');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteListing = async (id) => {
        try {
            setLoading(true);
            await listingsApi.delete(id);
            setListings(prev => prev.filter(listing => listing._id !== id));
            navigate('/listings');
        } catch (err) {
            setError(err.message || 'Failed to delete listing');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const addReview = async (listingId, reviewData) => {
        try {
            const data = await listingsApi.addReview(listingId, reviewData);
            setListings(prev => prev.map(listing => 
                listing._id === listingId 
                    ? { ...listing, reviews: [...listing.reviews, data] }
                    : listing
            ));
            return data;
        } catch (err) {
            setError(err.message || 'Failed to add review');
            throw err;
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    return {
        listings,
        loading,
        error,
        fetchListings,
        createListing,
        updateListing,
        deleteListing,
        addReview,
    };
};
