import { apiRequest } from "./apiClient";

const gymApi = {
  async login(credentials) {
    const response = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
      token: null,
    });

    return {
      ...response.user,
      token: response.token,
    };
  },

  async getCurrentUser(token) {
    const response = await apiRequest("/auth/me", { token });

    return {
      ...response.user,
      token,
    };
  },

  async logout(token) {
    return apiRequest("/auth/logout", {
      method: "POST",
      token,
    });
  },

  async forgotPassword(email) {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: { email },
      token: null,
    });
  },

  async resetPassword(token, password) {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: { token, password },
      token: null,
    });
  },

  async getMembers(token) {
    const response = await apiRequest("/members", { token });

    return response.members || [];
  },

  async createMember(memberDetails, token) {
    const response = await apiRequest("/members", {
      method: "POST",
      body: memberDetails,
      token,
    });

    return response.member;
  },

  async toggleAttendance(memberId, token) {
    const response = await apiRequest(`/members/${memberId}/attendance`, {
      method: "PATCH",
      token,
    });

    return response.member;
  },

  async markDuePaid(memberId, token) {
    const response = await apiRequest(`/members/${memberId}/due-paid`, {
      method: "PATCH",
      token,
    });

    return response.member;
  },

  async deleteMember(memberId, token) {
    const response = await apiRequest(`/members/${memberId}`, {
      method: "DELETE",
      token,
    });

    return response.member;
  },

  async getCoaches(token) {
    const response = await apiRequest("/coaches", { token });

    return response.coaches || [];
  },

  async createCoach(coachDetails, token) {
    const response = await apiRequest("/coaches", {
      method: "POST",
      body: coachDetails,
      token,
    });

    return response.coach;
  },

  async deleteCoach(coachId, token) {
    const response = await apiRequest(`/coaches/${coachId}`, {
      method: "DELETE",
      token,
    });

    return response.coach;
  },

  async createEnquiry(enquiryDetails, token) {
    const response = await apiRequest("/enquiries", {
      method: "POST",
      body: enquiryDetails,
      token,
    });

    return response.enquiry;
  },
};

export { gymApi };
