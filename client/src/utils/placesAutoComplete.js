/**
 * Places Autocomplete Utility
 * Uses google.maps.places.Autocomplete class
 * Note: Deprecated but still functional. For new projects, use PlaceAutocompleteElement
 */

let autocompleteInstance = null;

/**
 * Wait for Google Maps API to be ready
 */
const waitForGoogleMapsAPI = async (maxAttempts = 30) => {
  return new Promise((resolve) => {
    let attempts = 0;
    const checkAPI = () => {
      attempts++;
      if (window.google?.maps?.places?.Autocomplete) {
        console.log(`✅ Google Maps Autocomplete API ready (${attempts * 100}ms)`);
        resolve(true);
      } else if (attempts < maxAttempts) {
        setTimeout(checkAPI, 100);
      } else {
        console.error(`❌ Google Maps API failed to load after ${maxAttempts * 100}ms`);
        resolve(false);
      }
    };
    checkAPI();
  });
};

/**
 * Initialize autocomplete for an input element
 * @param {HTMLInputElement} inputElement - The input DOM element
 * @param {Object} options - Configuration options
 * @returns {Promise<void>}
 */
export const initializeAutocomplete = async (inputElement, options = {}) => {
  if (!inputElement) {
    console.error('❌ Input element not provided');
    return;
  }

  // Wait for API to be ready
  const ready = await waitForGoogleMapsAPI();
  if (!ready) {
    console.error('❌ Google Maps API not available');
    return;
  }

  try {
    // Create Autocomplete instance
    autocompleteInstance = new window.google.maps.places.Autocomplete(inputElement, {
      types: ['geocode'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry', 'place_id'],
      ...options,
    });
    
    console.log('✅ Autocomplete initialized - dropdown will populate as you type');

    // Listen for place selection
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (place?.geometry) {
        console.log('✅ Place selected:', place.formatted_address);
        // Dispatch custom event so React can listen
        inputElement.dispatchEvent(new Event('placeChanged', { bubbles: true, detail: place }));
      }
    });

  } catch (error) {
    console.error('❌ Error initializing autocomplete:', error);
  }
};

/**
 * Get the currently selected place data
 * @returns {Object|null} Place data with name, lat, lng
 */
export const getSelectedPlace = () => {
  if (!autocompleteInstance) {
    return null;
  }

  try {
    const place = autocompleteInstance.getPlace();
    
    if (!place?.geometry) {
      return null;
    }

    return {
      name: place.formatted_address || '',
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      placeId: place.place_id || '',
    };
  } catch (error) {
    console.error('❌ Error getting selected place:', error);
    return null;
  }
};

/**
 * Clear the autocomplete instance
 */
export const clearAutocomplete = () => {
  autocompleteInstance = null;
  console.log('✅ Autocomplete cleared');
};

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsLoaded = () => {
  return !!(window.google?.maps?.places?.Autocomplete);
};
