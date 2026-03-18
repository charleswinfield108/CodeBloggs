/**
 * Places Autocomplete Utility
 * Uses the google.maps.places.AutocompleteService API
 */

let autocompleteService = null;
let sessionToken = null;
let apiLoadAttempts = 0;
const MAX_API_ATTEMPTS = 3;

/**
 * Initialize autocomplete service with session token
 */
const initializeAutocompleteService = () => {
  // Check if Google Maps API is available
  if (!window.google?.maps?.places?.AutocompleteService) {
    if (apiLoadAttempts < MAX_API_ATTEMPTS) {
      apiLoadAttempts++;
      console.warn(`Google Maps Places API not fully loaded. Attempt ${apiLoadAttempts}/${MAX_API_ATTEMPTS}`);
    } else {
      console.error('Google Maps Places API failed to load after multiple attempts');
    }
    return false;
  }

  try {
    // Create a new session token for billing optimization
    if (!sessionToken && window.google?.maps?.places?.AutocompleteSessionToken) {
      sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    }
    
    // Initialize the AutocompleteService
    if (!autocompleteService) {
      autocompleteService = new window.google.maps.places.AutocompleteService();
      console.log('AutocompleteService initialized successfully');
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

  // Ensure service is initialized
  const initialized = initializeAutocompleteService();
  if (!initialized || !autocompleteService) {
    console.error('Autocomplete service not available');
    return [];
  }

  return new Promise((resolve) => {
    try {
      const request = {
        input: input,
        componentRestrictions: { country: 'us' },
        sessionToken: sessionToken,
      };

      // Set a timeout in case the callback never fires
      const timeout = setTimeout(() => {
        console.warn('Autocomplete API call timed out');
        resolve([]);
      }, 5000); // 5 second timeout

      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        clearTimeout(timeout);
        
        console.log('Autocomplete status:', status, 'Predictions:', predictions?.length || 0);

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
          console.log('Returning predictions:', formatted.length);
          resolve(formatted);
        } else if (status === ZERO_RESULTS) {
          console.log('No results found for input:', input);
          resolve([]);
        } else {
          console.warn('Autocomplete API returned status:', status);
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
            console.log('Place details retrieved:', result.address);
            resolve(result);
            
            // Create new session token after prediction selection for better billing
            if (window.google?.maps?.places?.AutocompleteSessionToken) {
              sessionToken = new window.google.maps.places.AutocompleteSessionToken();
            }
          } else {
            console.warn('Place details error. Status:', status);
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
  const isLoaded = !!(window.google?.maps?.places?.AutocompleteService);
  console.log('Google Maps API loaded:', isLoaded);
  return isLoaded;
};
