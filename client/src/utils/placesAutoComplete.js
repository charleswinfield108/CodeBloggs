/**
 * Places Autocomplete Utility
 * Uses the new google.maps.places.AutocompleteSuggestion API
 * Migration from deprecated AutocompleteService
 */

let autocompleteService = null;
let sessionToken = null;

/**
 * Initialize autocomplete service with session token
 */
const initializeAutocompleteService = () => {
  if (!window.google?.maps?.places) {
    console.error('Google Maps Places API not loaded');
    return false;
  }

  try {
    // Create a new session token for each user session
    sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    
    // Initialize the service - the new API uses getPlacePredictions
    // which is part of the PlacesService
    autocompleteService = new window.google.maps.places.AutocompleteService();
    return true;
  } catch (error) {
    console.error('Error initializing autocomplete service:', error);
    return false;
  }
};

/**
 * Get autocomplete predictions using the newer API
 * @param {string} input - User input text
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} Array of predictions
 */
export const getAutocompletePredictions = async (input, options = {}) => {
  if (!input || input.length < 1) {
    return [];
  }

  if (!autocompleteService) {
    initializeAutocompleteService();
  }

  if (!autocompleteService) {
    console.error('Autocomplete service not available');
    return [];
  }

  try {
    const request = {
      input: input,
      componentRestrictions: options.componentRestrictions || { country: 'us' },
      sessionToken: sessionToken,
      types: options.types || ['geocode'],
    };

    // Use getPlacePredictions which is the newer method
    const response = await new Promise((resolve, reject) => {
      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK && status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          reject(new Error(`Autocomplete error: ${status}`));
        }
        resolve(predictions || []);
      });
    });

    return response.map(prediction => ({
      placeId: prediction.place_id,
      mainText: prediction.main_text,
      secondaryText: prediction.secondary_text,
      description: prediction.description,
      active: false,
    }));
  } catch (error) {
    console.error('Error fetching autocomplete predictions:', error);
    return [];
  }
};

/**
 * Get place details including coordinates
 * @param {string} placeId - Place ID from prediction
 * @returns {Promise<Object>} Place details with latitude and longitude
 */
export const getPlaceDetails = async (placeId) => {
  if (!window.google?.maps?.places) {
    console.error('Google Maps Places API not loaded');
    return null;
  }

  try {
    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    return new Promise((resolve, reject) => {
      service.getDetails(
        {
          placeId: placeId,
          sessionToken: sessionToken,
          fields: ['formatted_address', 'geometry'],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            resolve({
              address: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
            // Create new session token after prediction selection
            sessionToken = new window.google.maps.places.AutocompleteSessionToken();
          } else {
            reject(new Error(`Place details error: ${status}`));
          }
        }
      );
    });
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

/**
 * Reset session token
 */
export const resetSessionToken = () => {
  if (window.google?.maps?.places) {
    sessionToken = new window.google.maps.places.AutocompleteSessionToken();
  }
};

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsLoaded = () => {
  return !!window.google?.maps?.places;
};
