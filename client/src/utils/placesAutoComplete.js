/**
 * Places Autocomplete Utility
 * Uses the google.maps.places API with proper error handling
 * Works with both AutocompleteService and newer methods
 */

let autocompleteService = null;
let placesService = null;
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
    // Create a new session token for billing optimization
    sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    
    // Initialize the AutocompleteService
    if (!autocompleteService) {
      autocompleteService = new window.google.maps.places.AutocompleteService();
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
  if (!input || input.length < 1) {
    return [];
  }

  if (!autocompleteService) {
    const initialized = initializeAutocompleteService();
    if (!initialized) {
      console.error('Failed to initialize autocomplete service');
      return [];
    }
  }

  try {
    const request = {
      input: input,
      componentRestrictions: options.componentRestrictions || { country: 'us' },
      sessionToken: sessionToken,
    };

    // Use getPlacePredictions - proper method name
    return new Promise((resolve) => {
      autocompleteService.getPlacePredictions(request, (predictions, status) => {
        // Handle both OK and ZERO_RESULTS as valid responses
        if (status === window.google.maps.places.PlacesServiceStatus.OK || 
            status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          const results = predictions || [];
          resolve(results.map(prediction => ({
            placeId: prediction.place_id,
            mainText: prediction.main_text,
            secondaryText: prediction.secondary_text,
            description: prediction.description,
            active: false,
          })));
        } else if (status === window.google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
          console.warn('Invalid request for autocomplete');
          resolve([]);
        } else {
          console.warn('Autocomplete status:', status);
          resolve([]);
        }
      });
    });
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
      service.getDetails(
        {
          placeId: placeId,
          sessionToken: sessionToken,
          fields: ['formatted_address', 'geometry'],
        },
        (place, status) => {
          // Clean up map element
          document.body.removeChild(mapDiv);

          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              address: place.formatted_address,
              lat: place.geometry?.location?.lat?.() || 0,
              lng: place.geometry?.location?.lng?.() || 0,
            });
            // Create new session token after prediction selection
            sessionToken = new window.google.maps.places.AutocompleteSessionToken();
          } else {
            console.warn('Place details error:', status);
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
  if (window.google?.maps?.places?.AutocompleteSessionToken) {
    sessionToken = new window.google.maps.places.AutocompleteSessionToken();
  }
};

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsLoaded = () => {
  return !!window.google?.maps?.places;
};
