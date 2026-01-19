const API_BASE_URL = "http://localhost:5000/api";

/**
 * Get all students
 */
export const getAllStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch students");
    }

    return data;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

/**
 * Get student by ID
 */
export const getStudentById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch student");
    }

    return data;
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

/**
 * Create a new student
 */
export const createStudent = async (studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });
    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "Failed to create student");
    }

    return data;
  } catch (error) {
    console.error("Error creating student:", error);
    console.error("Error details:", error.message);
    throw error;
  }
};

/**
 * Create multiple students (bulk upload)
 */
export const createBulkStudents = async (studentsArray) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ students: studentsArray }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create students");
    }

    return data;
  } catch (error) {
    console.error("Error creating bulk students:", error);
    throw error;
  }
};

/**
 * Update student
 */
export const updateStudent = async (id, studentData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update student");
    }

    return data;
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

/**
 * Delete student
 */
export const deleteStudent = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete student");
    }

    return data;
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

/**
 * Search students
 */
export const searchStudents = async (searchParams) => {
  try {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await fetch(
      `${API_BASE_URL}/students/search?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to search students");
    }

    return data;
  } catch (error) {
    console.error("Error searching students:", error);
    throw error;
  }
};
