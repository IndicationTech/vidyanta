import {
  ApiPermission,
  hasPermission,
  checkPermission,
} from "../config/permissions";

export class ApiService {
  constructor(role) {
    this.role = role;
  }

  // Generic API call with permission check
  async callApi(endpoint, method, permission, body) {
    // Check permission before making API call
    checkPermission(this.role, permission);

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  getToken() {
    // In a real app, get token from auth context or storage
    return "mock-token";
  }

  // School Management APIs
  async createSchool(data) {
    return this.callApi(
      "/api/schools",
      "POST",
      ApiPermission.CREATE_SCHOOL,
      data
    );
  }

  async updateSchool(id, data) {
    return this.callApi(
      `/api/schools/${id}`,
      "PUT",
      ApiPermission.UPDATE_SCHOOL,
      data
    );
  }

  async deleteSchool(id) {
    return this.callApi(
      `/api/schools/${id}`,
      "DELETE",
      ApiPermission.DELETE_SCHOOL
    );
  }

  async getAllSchools() {
    return this.callApi("/api/schools", "GET", ApiPermission.VIEW_ALL_SCHOOLS);
  }

  // Student Management APIs
  async createStudent(data) {
    return this.callApi(
      "/api/students",
      "POST",
      ApiPermission.CREATE_STUDENT,
      data
    );
  }

  async updateStudent(id, data) {
    return this.callApi(
      `/api/students/${id}`,
      "PUT",
      ApiPermission.UPDATE_STUDENT,
      data
    );
  }

  async deleteStudent(id) {
    return this.callApi(
      `/api/students/${id}`,
      "DELETE",
      ApiPermission.DELETE_STUDENT
    );
  }

  async getAllStudents() {
    return this.callApi(
      "/api/students",
      "GET",
      ApiPermission.VIEW_ALL_STUDENTS
    );
  }

  async getMyStudents() {
    return this.callApi(
      "/api/students/my",
      "GET",
      ApiPermission.VIEW_MY_STUDENTS
    );
  }

  // Staff Management APIs
  async createStaff(data) {
    return this.callApi("/api/staff", "POST", ApiPermission.CREATE_STAFF, data);
  }

  async updateStaff(id, data) {
    return this.callApi(
      `/api/staff/${id}`,
      "PUT",
      ApiPermission.UPDATE_STAFF,
      data
    );
  }

  async deleteStaff(id) {
    return this.callApi(
      `/api/staff/${id}`,
      "DELETE",
      ApiPermission.DELETE_STAFF
    );
  }

  async getAllStaff() {
    return this.callApi("/api/staff", "GET", ApiPermission.VIEW_ALL_STAFF);
  }

  // Admissions APIs
  async createLead(data) {
    return this.callApi("/api/leads", "POST", ApiPermission.CREATE_LEAD, data);
  }

  async updateLead(id, data) {
    return this.callApi(
      `/api/leads/${id}`,
      "PUT",
      ApiPermission.UPDATE_LEAD,
      data
    );
  }

  async deleteLead(id) {
    return this.callApi(
      `/api/leads/${id}`,
      "DELETE",
      ApiPermission.DELETE_LEAD
    );
  }

  async getLeads() {
    return this.callApi("/api/leads", "GET", ApiPermission.VIEW_LEADS);
  }

  // Academics APIs
  async createCourse(data) {
    return this.callApi(
      "/api/courses",
      "POST",
      ApiPermission.CREATE_COURSE,
      data
    );
  }

  async updateCourse(id, data) {
    return this.callApi(
      `/api/courses/${id}`,
      "PUT",
      ApiPermission.UPDATE_COURSE,
      data
    );
  }

  async deleteCourse(id) {
    return this.callApi(
      `/api/courses/${id}`,
      "DELETE",
      ApiPermission.DELETE_COURSE
    );
  }

  async getCourses() {
    return this.callApi("/api/courses", "GET", ApiPermission.VIEW_COURSES);
  }

  async createAssignment(data) {
    return this.callApi(
      "/api/assignments",
      "POST",
      ApiPermission.CREATE_ASSIGNMENT,
      data
    );
  }

  async updateAssignment(id, data) {
    return this.callApi(
      `/api/assignments/${id}`,
      "PUT",
      ApiPermission.UPDATE_ASSIGNMENT,
      data
    );
  }

  async gradeAssignment(id, data) {
    return this.callApi(
      `/api/assignments/${id}/grade`,
      "PUT",
      ApiPermission.GRADE_ASSIGNMENT,
      data
    );
  }

  async getAssignments() {
    return this.callApi(
      "/api/assignments",
      "GET",
      ApiPermission.VIEW_ASSIGNMENTS
    );
  }

  async getGrades() {
    return this.callApi("/api/grades", "GET", ApiPermission.VIEW_GRADES);
  }

  // Finance APIs
  async createFee(data) {
    return this.callApi("/api/fees", "POST", ApiPermission.CREATE_FEE, data);
  }

  async updateFee(id, data) {
    return this.callApi(
      `/api/fees/${id}`,
      "PUT",
      ApiPermission.UPDATE_FEE,
      data
    );
  }

  async deleteFee(id) {
    return this.callApi(`/api/fees/${id}`, "DELETE", ApiPermission.DELETE_FEE);
  }

  async getFees() {
    return this.callApi("/api/fees", "GET", ApiPermission.VIEW_FEES);
  }

  async processPayment(data) {
    return this.callApi(
      "/api/payments",
      "POST",
      ApiPermission.PROCESS_PAYMENT,
      data
    );
  }

  async getPayments() {
    return this.callApi("/api/payments", "GET", ApiPermission.VIEW_PAYMENTS);
  }

  async createPayroll(data) {
    return this.callApi(
      "/api/payroll",
      "POST",
      ApiPermission.CREATE_PAYROLL,
      data
    );
  }

  async updatePayroll(id, data) {
    return this.callApi(
      `/api/payroll/${id}`,
      "PUT",
      ApiPermission.UPDATE_PAYROLL,
      data
    );
  }

  async getPayroll() {
    return this.callApi("/api/payroll", "GET", ApiPermission.VIEW_PAYROLL);
  }

  async getFinancialReports() {
    return this.callApi(
      "/api/reports/financial",
      "GET",
      ApiPermission.VIEW_FINANCIAL_REPORTS
    );
  }

  // Communication APIs
  async sendAnnouncement(data) {
    return this.callApi(
      "/api/announcements",
      "POST",
      ApiPermission.SEND_ANNOUNCEMENT,
      data
    );
  }

  async getAnnouncements() {
    return this.callApi(
      "/api/announcements",
      "GET",
      ApiPermission.VIEW_ANNOUNCEMENTS
    );
  }

  async sendMessage(data) {
    return this.callApi(
      "/api/messages",
      "POST",
      ApiPermission.SEND_MESSAGE,
      data
    );
  }

  async getMessages() {
    return this.callApi("/api/messages", "GET", ApiPermission.VIEW_MESSAGES);
  }

  // Settings APIs
  async updateSystemSettings(data) {
    return this.callApi(
      "/api/settings/system",
      "PUT",
      ApiPermission.UPDATE_SYSTEM_SETTINGS,
      data
    );
  }

  async updateSchoolSettings(data) {
    return this.callApi(
      "/api/settings/school",
      "PUT",
      ApiPermission.UPDATE_SCHOOL_SETTINGS,
      data
    );
  }

  async getSettings() {
    return this.callApi("/api/settings", "GET", ApiPermission.VIEW_SETTINGS);
  }

  // Helper method to check if user has a specific permission
  hasPermission(permission) {
    return hasPermission(this.role, permission);
  }
}

// Export a factory function to create API service instances
export const createApiService = (role) => {
  return new ApiService(role);
};
