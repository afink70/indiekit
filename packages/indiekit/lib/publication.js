import {Cache} from './cache.js';

/**
 * Return array of available categories. If not a simple array,
 * fetch array from remote JSON file specified in `url` value.
 *
 * @param {object} client Redis client
 * @param {object} pubCategories Publication category configuration
 * @returns {Promise|Array} Array of categories
 */
export const getCategories = async (client, pubCategories) => {
  let categories = [];

  if (pubCategories && pubCategories.url) {
    const cache = new Cache(client);
    const cachedCategories = await cache.json('categories', pubCategories.url);
    categories = cachedCategories.data;
  } else if (pubCategories && pubCategories.constructor === Array) {
    categories = pubCategories;
  }

  return categories;
};

/**
 * Get merged custom and default configurations
 *
 * @param {object} customConfig Custom configuration
 * @param {object} presetConfig Preset configuration
 * @returns {object} Merged configuration
 */
export const getConfig = (customConfig, presetConfig) => {
  // Merge configuration objects
  const config = {...presetConfig, ...customConfig};

  // Combine post type arrays (leaving duplicate post types)
  const customPostTypes = customConfig['post-types'] || [];
  const presetPostTypes = presetConfig['post-types'] || [];
  const combinedPostTypes = [
    ...customPostTypes,
    ...presetPostTypes
  ];

  // Merge duplicate post types
  const set = new Set();
  const mergedPostTypes = combinedPostTypes.filter(postType => {
    if (!set.has(postType.type)) {
      set.add(postType.type);
      return true;
    }

    return false;
  }, set);

  config['post-types'] = mergedPostTypes;

  return config;
};

/**
 * Get configuration preset for a publication
 *
 * @param {Array} configs All available presets
 * @param {string} configPresetId ID of publication’s chosen preset
 * @returns {object} Configuration preset
 */
export const getConfigPreset = (configs, configPresetId) => {
  return configs.find(
    config => config.id === configPresetId
  );
};

/**
 * Get media endpoint from server derived values
 *
 * @param {object} publication Publication settings
 * @param {object} request HTTP request
 * @returns {object} Configuration object
 */
export const getMediaEndpoint = (publication, request) => {
  const {config} = publication;
  const configEndpoint = config['media-endpoint'];
  const host = `${request.protocol}://${request.headers.host}`;
  const serverEndpoint = `${host}${publication['media-endpoint']}`;

  // Use configured value, or default to server based value
  config['media-endpoint'] = configEndpoint || serverEndpoint;

  return config;
};

/**
 * Get store function for a publication
 *
 * @param {Array} stores All available content stores
 * @param {string} storeId ID of publication’s chosen content store
 * @returns {Function} Content store function
 */
export const getStore = (stores, storeId) => {
  return stores.find(
    store => store.id === storeId
  );
};
