const API_BASE_URL = "http://localhost:5000/api";

/**
 * Get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get headers with auth token
 */
const getHeaders = () => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Get all timetables
 */
export const getAllTimetables = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables`, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch timetables");
    }

    return data;
  } catch (error) {
    console.error("Error fetching timetables:", error);
    throw error;
  }
};

/**
 * Get timetable by class name
 * @param {string} className - The class name (e.g., "10th A")
 * @param {string} section - The section (optional, defaults to "A")
 */
export const getTimetableByClass = async (className, section = "A") => {
  try {
    const encodedClassName = encodeURIComponent(className);
    const response = await fetch(
      `${API_BASE_URL}/timetables/class/${encodedClassName}?section=${section}`,
      {
        method: "GET",
        headers: getHeaders(),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      // Return null for 404 (no timetable found)
      if (response.status === 404) {
        return { success: false, data: null, message: data.message };
      }
      throw new Error(data.message || "Failed to fetch timetable");
    }

    return data;
  } catch (error) {
    console.error("Error fetching timetable by class:", error);
    throw error;
  }
};

/**
 * Get timetable by ID
 * @param {string} id - The timetable ID
 */
export const getTimetableById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch timetable");
    }

    return data;
  } catch (error) {
    console.error("Error fetching timetable:", error);
    throw error;
  }
};

/**
 * Create a new timetable
 * @param {Object} timetableData - The timetable data
 */
export const createTimetable = async (timetableData) => {
  try {
    console.log("Creating timetable with data:", timetableData);

    const response = await fetch(`${API_BASE_URL}/timetables`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(timetableData),
    });

    const data = await response.json();
    console.log("Create timetable response:", data);

    if (!response.ok) {
      console.error("Create timetable failed:", response.status, data);
      throw new Error(
        data.message ||
          data.error ||
          `Failed to create timetable (${response.status})`,
      );
    }

    return data;
  } catch (error) {
    console.error("Error creating timetable:", error);
    // If it's a network error, provide more context
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to server. Please ensure the backend is running.",
      );
    }
    throw error;
  }
};

/**
 * Update timetable by ID
 * @param {string} id - The timetable ID
 * @param {Object} timetableData - The updated timetable data
 */
export const updateTimetable = async (id, timetableData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(timetableData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update timetable");
    }

    return data;
  } catch (error) {
    console.error("Error updating timetable:", error);
    throw error;
  }
};

/**
 * Update timetable by class name (upsert - creates if not exists)
 * @param {string} className - The class name
 * @param {Object} timetableData - The timetable data
 */
export const updateTimetableByClass = async (className, timetableData) => {
  try {
    const encodedClassName = encodeURIComponent(className);
    const response = await fetch(
      `${API_BASE_URL}/timetables/class/${encodedClassName}`,
      {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(timetableData),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update timetable");
    }

    return data;
  } catch (error) {
    console.error("Error updating timetable by class:", error);
    throw error;
  }
};

/**
 * Delete timetable
 * @param {string} id - The timetable ID
 */
export const deleteTimetable = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete timetable");
    }

    return data;
  } catch (error) {
    console.error("Error deleting timetable:", error);
    throw error;
  }
};

/**
 * Delete a specific period from timetable
 * @param {string} id - The timetable ID
 * @param {string} day - The day of the week
 * @param {number} periodIndex - The index of the period to delete
 */
export const deletePeriod = async (id, day, periodIndex) => {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables/${id}/period`, {
      method: "DELETE",
      headers: getHeaders(),
      body: JSON.stringify({ day, periodIndex }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete period");
    }

    return data;
  } catch (error) {
    console.error("Error deleting period:", error);
    throw error;
  }
};

/**
 * Get available classes list
 */
export const getAvailableClasses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/timetables/classes`, {
      method: "GET",
      headers: getHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch available classes");
    }

    return data;
  } catch (error) {
    console.error("Error fetching available classes:", error);
    throw error;
  }
};
