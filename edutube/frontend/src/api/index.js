// API base: HTTPS only; port 443 when required (default for HTTPS).
const API_BASE = "https://65.1.133.54";
export const apiurl = `${API_BASE}/api/v1`;

export const registerUser = async (userData) => {
    try {
        const response = await fetch(apiurl + '/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error('Error registering user:', error);
        alert(error)
        throw error;
    }
};

import Cookies from 'js-cookie';

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(apiurl + '/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        Cookies.set('authToken', data.token, { expires: 7 });
        return data;
    } catch (error) {
        console.error('Error logging in:', error);
        alert(error)
        throw error;
    }
};


export const getUserProfile = async (setUser) => {
  const token = Cookies.get('authToken'); 

  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(apiurl+'/users/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json(); 
    console.log(data);
    setUser(data)
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error; // Re-throw the error to handle it where needed
  }
};

