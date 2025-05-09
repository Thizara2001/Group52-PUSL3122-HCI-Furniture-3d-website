import axios from "axios";

// Define the base URL for the API
const API_BASE_URL = "http://localhost:8000"; // Change this to your actual API URL

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for handling cookies (access_token)
});

// Types based on the OpenAPI schema
export interface UserCreate {
  username: string;
  name: string;
  role?: "designer" | "customer";
  password: string;
}

export interface User {
  username: string;
  name: string;
  role: "designer" | "customer";
  id: string;
}

export interface DesignData {
  room: {
    type: string;
    data: unknown;
  };
  furniture?: {
    type: string;
    data: unknown;
  };
}

export interface DesignCreate {
  name: string;
  data: DesignData;
}

export interface DesignUpdate {
  name?: string;
  data?: DesignData;
}

export interface Design {
  name: string;
  data: DesignData;
  id: string;
  ownerId: string;
}

// Authentication endpoints
export const signup = async (userData: UserCreate): Promise<User> => {
  const response = await api.post<User>("/signup", userData);
  return response.data;
};

export const login = async (
  username: string,
  password: string,
): Promise<void> => {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  await api.post("/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
};

export const logout = async (): Promise<void> => {
  await api.post("/logout");
};

// Get current user information
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>("/me");
    return response.data;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
};

// Design endpoints
export const getAllDesigns = async (): Promise<Design[]> => {
  const response = await api.get<Design[]>("/getAllDesigns");
  return response.data;
};

export const getUserDesigns = async (): Promise<Design[]> => {
  const response = await api.get<Design[]>("/getUserDesigns");
  return response.data;
};

export const createDesign = async (design: DesignCreate): Promise<Design> => {
  const response = await api.post<Design>("/createDesign", design);
  return response.data;
};

export const updateDesign = async (
  designId: string,
  design: DesignUpdate,
): Promise<Design> => {
  const response = await api.put<Design>(`/updateDesign/${designId}`, design);
  return response.data;
};

export const deleteDesign = async (designId: string): Promise<void> => {
  await api.delete(`/deleteDesign/${designId}`);
};
