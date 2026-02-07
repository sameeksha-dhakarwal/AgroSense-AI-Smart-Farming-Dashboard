/**
 * Sentinel-2 NDVI fetcher (backend-ready)
 * Currently returns null → frontend will fallback safely
 * Later you will connect this to backend Earth Engine API
 */

export const getSentinelNDVI = async ({ lat, lon }) => {
  try {
    // FUTURE:
    // const res = await fetch(`/api/ndvi?lat=${lat}&lon=${lon}`);
    // return await res.json();

    return null; // fallback for now
  } catch {
    return null;
  }
};
