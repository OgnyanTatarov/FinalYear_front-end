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
