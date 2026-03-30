const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed with status ${response.status}`);
    }

    // Based on Swagger, 200 OK has No Body.
    // We assume cookies or headers will handle the session.
    return { success: true, status: response.status };
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};
