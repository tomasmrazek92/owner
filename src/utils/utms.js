// Function to get all query parameters from URL
function getQueryParams() {
  const params = {};
  const queryString = window.location.search;

  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    urlParams.forEach(function (value, key) {
      // Convert the key to lowercase for consistent handling
      const lowercaseKey = key.toLowerCase();
      params[lowercaseKey] = value;
    });
  }

  return params;
}

// Save parameters to sessionStorage as a single JSON object
function saveParamsToSession(params) {
  if (Object.keys(params).length > 0) {
    // Store all UTM parameters as a single JSON string
    sessionStorage.setItem('utmParams', JSON.stringify(params));
  }
}

// Get parameters from sessionStorage
export function getParamsFromSession() {
  const utmParamsString = sessionStorage.getItem('utmParams');

  // Return empty object if no params found
  if (!utmParamsString) {
    return {};
  }

  try {
    // Parse the JSON string back to an object
    return JSON.parse(utmParamsString);
  } catch (e) {
    console.error('Error parsing UTM params from sessionStorage:', e);
    return {};
  }
}

// Function to handle form parameters
export function handleUTMParams() {
  // Get URL parameters first
  const urlParams = getQueryParams();

  // Get existing params from session
  let sessionParams = getParamsFromSession();

  // Merge parameters, with URL taking priority
  const mergedParams = { ...sessionParams, ...urlParams };

  // Save the merged params to session storage if we have URL params
  if (Object.keys(urlParams).length > 0) {
    saveParamsToSession(mergedParams);
  }

  return mergedParams;
}
