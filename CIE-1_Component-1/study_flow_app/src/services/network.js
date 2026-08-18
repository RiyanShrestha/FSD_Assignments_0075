/**
 * StudyFlow Network Utility
 * Centralized fetch wrapper that logs requests for DevTools Network tab demonstration.
 * Records request timing, handles errors, and provides development logging.
 */

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Make a fetch request with logging and timing.
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Parsed response data
 */
export async function networkFetch(url, options = {}) {
  const startTime = performance.now();
  const method = options.method || 'GET';

  if (isDev) {
    console.log(`%c[StudyFlow Network] ${method} ${url}`, 'color: #4A90D9; font-weight: bold;');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const duration = Math.round(performance.now() - startTime);

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      error.status = response.status;

      if (isDev) {
        console.error(
          `%c[StudyFlow Network] ${method} ${url}\nStatus: ${response.status}\nDuration: ${duration}ms`,
          'color: #E74C3C; font-weight: bold;'
        );
      }

      throw error;
    }

    const data = await response.json();

    if (isDev) {
      console.log(
        `%c[StudyFlow Network] ${method} ${url}\nStatus: ${response.status}\nDuration: ${duration}ms`,
        'color: #50C878; font-weight: bold;'
      );
    }

    return data;
  } catch (err) {
    const duration = Math.round(performance.now() - startTime);

    if (!err.status && isDev) {
      console.error(
        `%c[StudyFlow Network] ${method} ${url}\nError: ${err.message}\nDuration: ${duration}ms`,
        'color: #E74C3C; font-weight: bold;'
      );
    }

    throw err;
  }
}

export default networkFetch;
