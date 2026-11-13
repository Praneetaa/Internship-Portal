export const BASE_URL =
   import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const API_PATHS = {
   AUTH: {
      REGISTER: "/api/auth/register", //Signup
      LOGIN: "/api/auth/login", //Authenticate user & return JWT token
      GET_PROFILE: "/api/auth/me", //Get logged-in user details
      UPDATE_PROFILE: "/api/user/profile", //Update profile details
      DELETE_RESUME: "/api/user/resume", //Delete resume details
   },
   DASHBOARD: {
      OVERVIEW: `/api/analytics/overview`,
   },

   JOBS: {
      GET_ALL_JOBS: "/api/jobs",
      POST_JOB: "/api/jobs",
      GET_JOBS_EMPLOYER: "/api/jobs/get-jobs-organization",
      GET_JOB_BY_ID: (id) => `/api/jobs/${id}`,
      UPDATE_JOB: (id) => `/api/jobs/${id}`,
      TOGGLE_CLOSE: (id) => `/api/jobs/${id}/toggle-close`,
      DELETE_JOB: (id) => `/api/jobs/${id}`,

      SAVE_JOB: (id) => `/api/saved-jobs/${id}`,
      UNSAVE_JOB: (id) => `/api/saved-jobs/${id}`,
      GET_SAVED_JOBS: "/api/saved-jobs/my",
   },
   APPLICATIONS: {
      APPLY_TO_JOB: (id) => `/api/applications/${id}`,
      GET_ALL_APPLICATIONS: (id) => `/api/applications/job/${id}`,
      UPDATE_STATUS: (id) => `/api/applications/${id}/status`,
      GET_MY_APPLICATIONS: "/api/applications/my",
   },

   IMAGE: {
      UPLOAD_IMAGE: "/api/auth/upload-image", //Upload profile picture
   },
   EVENTS: {
      GET_ALL_EVENTS: "/api/events",
      POST_EVENT: "/api/events",
      GET_MY_EVENTS_ORG: "/api/events/org/my-events",
      GET_MY_REGISTRATIONS: "/api/events/candidate/my-registrations",
      GET_EVENT_BY_ID: (id) => `/api/events/${id}`,
      UPDATE_EVENT: (id) => `/api/events/${id}`,
      DELETE_EVENT: (id) => `/api/events/${id}`,
      TOGGLE_CLOSE: (id) => `/api/events/${id}/toggle-close`,
      REGISTER: (id) => `/api/events/${id}/register`,
      UNREGISTER: (id) => `/api/events/${id}/register`,
      GET_REGISTRANTS: (id) => `/api/events/${id}/registrants`,
   },
};
