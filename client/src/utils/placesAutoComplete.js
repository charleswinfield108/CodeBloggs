/**
 * Places Autocomplete Utility
 * Uses the google.maps.places.AutocompleteService API
 * Waits for Google Maps API to be ready before initializing
 */

let autocompleteService = null;
let sessionToken = null;
let apiReady = false;

/**
 * Wait for Google Maps API to be ready
 */
const waitForGoogleMapsAPI = async (maxAttempts = 20) => {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkAPI = () => {
      if (window.googleMapsReady && window.google?.maps?.places?.AutocompleteService) {
        apiReady = true;
        console.log('✓ Google Maps API is ready');
        resolve(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkAPI, 250); // Check every 250ms
      } else {
        console.error('✗ Google Maps API failed to load after', maxAttempts * 250, 'ms');
        resolve(false);
      }
    };
    checkAPI();
  });
};

/**
 * Initialize autocomplete service with session token
 */
const initializeAutocompleteService = async () => {
  // If API isn't ready yet, wait for it
  if (!apiReady) {
    const ready = await waitForGoogleMapsAPI();
    if (!ready) {
      console.error('Failed to initialize - Google Maps API not available');
      return false;
    }
  }

  // Double check that everything is available
  if (!window.google?.maps?.places?.AutocompleteService) {
    console.error('AutocompleteService not available on window.google.maps.places');
    return false;
  }

  try {
    // Create a new session token for billing optimization
    if (!sessionToken && window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionToken = new window.google.maps.places.AutocompleteSessionToken();
      console.log('Session token created');
    }
    
    // Initialize the AutocompleteService
    if (!autocompleteService) {
      autocompleteService = new window.google.maps.places.AutocompleteService();
      console.log('✓ AutocompleteService initialized');
    }
    return true;
  } catch (error) {
    console.error('Error initializing autocomplete service:', error);
    return false;
  }
};

/**
 * Get autocomplete predictions
 * @param {string} input - User input text
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} Array of predictions
 */
export const getAutocompletePredictions = async (input, options = {}) => {
  if (!input || input.length < 2) {
    return [];
  }

  console.log('Getting predictions for:', input);

  // Ensure service is initialized
  const initialized = await initializeAutocompleteService();
  if (!initialized || !autocompleteService) {
    console.error('Autocomplete service not available after initialization');
    return [];
  }

  return new Promise((resolve) => {
    try {
      const request = {
        input: input,
        componentRestrictions: { country: 'us' },
        sessionToken: sessionToken,
      };

      console.log('API request:', request);

      // Set a timeout in case the callback never fires
      const timeout = setTimeout(() => {
        console.warn('⏱ Autocomplete API call timed out after 5s');
        resolve([]);
      }, 5000);

      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        clearTimeout(timeout);
        
        const statusName = getStatusName(status);
        console.log('API Response - Status:', statusName, 'Predictions:', predictions?.length || 0);

        // Handle all possible status responses
        const OK = window.google?.maps?.places?.PlacesServiceStatus?.OK;
        const ZERO_RESULTS = window.google?.maps?.places?.PlacesServiceStatus?.ZERO_RESULTS;

        if (status === OK) {
          const formatted = (predictions || []).map(prediction => ({
            placeId: prediction.place_id,
            mainText: prediction.main_text || prediction.description || '',
            secondaryText: prediction.secondary_text || '',
            description: prediction.description || '',
            active: false,
          }));
          console.log('✓ Returning', formatted.length, 'predictions');
          resolve(formatted);
        } else if (status === ZERO_RESULTS) {
          console.log('No results found for input:', input);
          resolve([]);
        } else {
          console.warn('⚠ Autocomplete API returned status:', statusName);
          resolve([]);
        }
      });
    } catch (error) {
      console.error('Error in getAutocompletePredictions:', error);
      resolve([]);
    }
  });
};

/**
 * Helper function to get status name from status code
 */
const getStatusName = (status) => {
  const statusMap = {
    'OK': 'OK',
    'ZERO_RESULTS': 'ZERO_RESULTS',
    'INVALID_REQUEST': 'INVALID_REQUEST',
    'MAX_QUERIES_EXCEEDED': 'MAX_QUERIES_EXCEEDED',
    'OVER_QUERY_LIMIT': 'OVER_QUERY_LIMIT',
    'NOT_FOUND': 'NOT_FOUND',
    'UNKNOWN_ERROR': 'UNKNOWN_ERROR',
  };
  return statusMap[status] || status;
};

/**
 * Get place details including coordinates
 * @param {string} placeId - Place ID from prediction
 * @returns {Promise<Object>} Place details with latitude and longitude
 */
export const getPlaceDetails = async (placeId) => {
  if (!window.google?.maps?.places?.PlacesService || !placeId) {
    console.error('Places API or placeId not available');
    return null;
  }

  try {
    // Create a hidden map element for the PlacesService
    const mapDiv = document.createElement('div');
    mapDiv.style.display = 'none';
    document.body.appendChild(mapDiv);
    
    const map = new window.google.maps.Map(mapDiv, {
      center: { lat: 0, lng: 0 },
      zoom: 1,
    });

    const service = new window.google.maps.places.PlacesService(map);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('Place details API call timed out');
        if (mapDiv.parentNode) {
          document.body.removeChild(mapDiv);
        }
        resolve(null);
      }, 5000);

      service.getDetails(
        {
          placeId: placeId,
          sessionToken: sessionToken,
          fields: ['formatted_address', 'geometry'],
        },
        (place, status) => {
          clearTimeout(timeout);

          // Clean up map element
          if (mapDiv.parentNode) {
            document.body.removeChild(mapDiv);
          }

          const OK = window.google?.maps?.places?.PlacesServiceStatus?.OK;
          
          if (status === OK && place) {
            const result = {
              address: place.formatted_address || '',
              lat: place.geometry?.location?.lat?.() || 0,
              lng: place.geometry?.location?.lng?.() || 0,
            };
            console.log('✓ Place details retrieved:', result.address);
            resolve(result);
            
            // Create new session token after prediction selection for better billing
            if (window.google?.maps?.places?.AutocompleteSessionToken) {
              sessionToken = new window.google.maps.places.AutocompleteSessionToken();
            }
          } else {
            console.warn('Place details error. Status:', getStatusName(status));
            resolve(null);
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
  try {
    if (window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    }
  } catch (error) {
    console.error('Error resetting session token:', error);
  }
};

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsLoaded = () => {
  const isLoaded = !!(window.googleMapsReady && window.google?.maps?.places?.AutocompleteService);
  console.log('Google Maps API loaded:', isLoaded);
  return isLoaded;
};
