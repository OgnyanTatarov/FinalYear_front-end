import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL, // Backend base URL
    headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
});

export const loginUser = async (data) => {
  try {
    const response = await API.post('/user/login', {
      data: {
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken
      }
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (data) => {
  try {
    const response = await API.post('user/register', {
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
        up_number: data.up_number,
        captchaToken: data.captchaToken  // Include the token
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const fetchCourses = async (userId, page) => {
    try {
      const response = await API.post('/courses/view', { 
        "user_id": `${userId}`, 
        "page": `${page}`
      });
      return {
        items: response.data.data,
        total_pages: response.data.total_items / 20 || 1
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };

export const filterCourses = async (userId, page, filters) => {
  try {
    const response = await API.post('/courses/list', { 
      data: {
        "user_id": `${userId}`,
        "page": `${page}`,
        filters
      } 
    });
    return {
      items: response.data.items,
      total_pages: response.data.total_items / 20 || 1
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchDeadlines = async(courseId, userId, page) => {
  try {
    const response = await API.post(`courses/${courseId}/deadlines`, {
      "user_id": `${userId}`,
      "page": `${page}`
    });
    await API.post(`courses/deadlines/initialize-progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deadlines:', error);
    throw error;
  }
};
    
export const updatePriority = async (courseId, userId, priority, page) => {
  try {
    const response = await API.post('/courses/priority', {
      data:{
      course_id: courseId,
      user_id: userId,
      priority: priority,
      page: page
      }

    });
    return response.data;
  } catch (error) {
    console.error('Error updating priority:', error);
    throw error;
  }
};

export const updateDeadlinePriority = async (deadlineId, userId, priority) => {
  try {
    const response = await API.post('/courses/deadlines/priority', {
      deadline_id: deadlineId,
      user_id: userId,
      priority_level: priority
    });
    return response.data;
  } catch (error) {
    console.error('Error updating deadline priority:', error);
    throw error;
  }
};

export const updateDeadlineProgress = async (deadlineId, userId, progress) => {
  try {
    const response = await API.post('courses/deadlines/progress', {
      deadline_id: deadlineId,
      user_id: userId,
      progress: progress
    });
    return response.data;
  } catch (error) {
    console.error('Error updating deadline progress:', error);
    throw error;
  }
};

// Admin API Endpoints
export const adminFetchCourses = async (userId) => {
  try {
    const response = await API.get('/admin/courses/view', {
      params: { user_id: userId }
    });
    console.log('Courses API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    throw error;
  }
};

export const adminSearchStudents = async (upNumber) => {
  try {
    const response = await API.get('/admin/search-student', {
      params: { up_number: upNumber }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching students:', error);
    throw error;
  }
};

export const adminFetchDeadlines = async () => {
  try {
    const response = await API.get('/admin/deadlines');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin deadlines:', error);
    throw error;
  }
};

export const adminCreateCourse = async (courseName, courseCode, faculty, adminId) => {
  try {
    const response = await API.post('/admin/courses/add', {
      course_name: courseName,
      course_code: courseCode,
      faculty: faculty,
      admin_id: adminId
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const adminEditCourse = async (query, body) => {
  try {
    const response = await API.put(`/admin/courses/${query}`, body);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const adminDeleteCourse = async (courseId) => {
  try {
    const response = await API.delete(`/admin/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const adminCreateDeadline = async (deadlineData) => {
  try {
    const response = await API.post('/admin/deadlines', deadlineData);
    return response.data;
  } catch (error) {
    console.error('Error creating deadline:', error);
    throw error;
  }
};

export const adminEditDeadline = async (deadlineId, deadlineData) => {
  try {
    const response = await API.put(`/admin/deadlines/${deadlineId}`, deadlineData);
    return response.data;
  } catch (error) {
    console.error('Error updating deadline:', error);
    throw error;
  }
};

export const adminDeleteDeadline = async (deadlineId) => {
  try {
    const response = await API.delete(`/admin/deadlines/${deadlineId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting deadline:', error);
    throw error;
  }
};

export const adminFetchAllStudents = async (userId) => {
  try {
    const response = await API.get('/admin/students/view', {
      params: { user_id: userId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all students:', error);
    throw error;
  }
};
