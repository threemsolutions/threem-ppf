import axios from "axios";
import { Client, Role, User } from "./types";
import { UserProfileToken } from "./Models/User";

const api = axios.create({
  baseURL: "https://threem-hpguffafdfebg6hr.canadacentral-01.azurewebsites.net/api/",
  headers: { "Content-Type": "application/json" },
});
export const fetchRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get("Role");
    return response.data.map((role: any) => ({
      id: role.id,
      roleName: role.roleName,
      status: role.status, // Ensure 'status' is included
    }));
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

export const registerAPI = async (data: any) => {
  try {
    await api.post("User/CreateUser", data);
  } catch (error) {
    throw new Error("Registration failed");
  }
};
export const loginAPI = async (emailId: string, password: string) => {
  try {
    const data = await api.post<UserProfileToken>("User/login", {
      emailId,
      password,
    });
    return data;
  } catch (error) {
    throw new Error("Login Failed");
  }
};
export const fetchClients = async (
  pageIndex: number = 0,
  pageSize: number = 10,
  searchTerm: string | null = null
): Promise<{
  items: Client[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}> => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    if (!token) {
      console.error("No token found, authentication required");
      return { items: [], totalCount: 0, pageIndex, pageSize };
    }
    const response = await api.get("Client/GetAllClients", {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageIndex, pageSize, searchTerm },
    });

    console.log("Response Data:", response.data);
    return {
      items: response.data.items || response.data.Items, // adjust based on your backend's casing
      totalCount: response.data.totalCount || response.data.TotalCount,
      pageIndex: response.data.pageIndex || response.data.PageIndex,
      pageSize: response.data.pageSize || response.data.PageSize,
    };
  } catch (error) {
    console.error("Error fetching clients:", error);
    return { items: [], totalCount: 0, pageIndex, pageSize };
  }
};
export const fetchClientDetails = async (
  clientId: number
): Promise<Client | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`Client/${clientId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching client details:", error);
    return null;
  }
};
export const updateClient = async (
  clientId: number,
  updatedData: Partial<Client> // Ensure it accepts updated fields
): Promise<Client | null> => {
  try {
    const token = localStorage.getItem("token");

    // Ensure endDate is null if it's an empty string
    const formattedData = {
      ...updatedData,
      endDate: updatedData.endDate === "" ? null : updatedData.endDate,
    };

    const response = await api.put(
      `Client/${clientId}`,
      formattedData, // Pass the properly formatted client data
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating client details:", error);
    return null;
  }
};

export const createClient = async (
  newClient: Client
): Promise<Client | null> => {
  try {
    const token = localStorage.getItem("token");
    const formattedData = {
      ...newClient,
      endDate: newClient.endDate === "" ? null : newClient.endDate,
    };
    const response = await api.post("Client/CreateClient", formattedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating client:", error);
    return null;
  }
};
export const deleteClient = async (
  clientId: number
): Promise<Client | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`Client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting client", error);
    return null;
  }
};
export const fetchRoleDetails = async (
  roleId: number
): Promise<Role | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`Role/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching role details:", error);
    return null;
  }
};
export const updateRole = async (
  roleId: number,
  updatedData: Partial<Role> // Ensure it accepts updated fields
): Promise<Role | null> => {
  try {
    const token = localStorage.getItem("token");
    const formattedData = {
      ...updatedData,
    };

    const response = await api.put(`Role/${roleId}`, formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating role details:", error);
    return null;
  }
};
export const createRole = async (newRole: Role): Promise<Role | null> => {
  try {
    const token = localStorage.getItem("token");
    const formattedData = {
      ...newRole,
    };
    const response = await api.post("Role/CreateRole", formattedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    return null;
  }
};
export const deleteRole = async (roleId: number): Promise<Role | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`Role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting role", error);
    return null;
  }
};
export const fetchUserDetails = async (
  userId: number
): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
export const updateUser = async (
  userId: number,
  updatedData: Partial<User> // Ensure it accepts updated fields
): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");
    const formattedData = {
      ...updatedData,
    };

    const response = await api.put(`User/${userId}`, formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    return null;
  }
};

export const deleteUser = async (userId: number): Promise<User | null> => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user", error);
    return null;
  }
};
export const fetchUsers = async (
  pageIndex: number = 0,
  pageSize: number = 10,
  searchTerm: string | null = null
): Promise<{
  items: User[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}> => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    if (!token) {
      console.error("No token found, authentication required");
      return { items: [], totalCount: 0, pageIndex, pageSize };
    }
    const response = await api.get("User/GetAllUsers", {
      headers: { Authorization: `Bearer ${token}` },
      params: { pageIndex, pageSize, searchTerm },
    });

    console.log("Response Data:", response.data);
    return {
      items: response.data.items || response.data.Items, // adjust based on your backend's casing
      totalCount: response.data.totalCount || response.data.TotalCount,
      pageIndex: response.data.pageIndex || response.data.PageIndex,
      pageSize: response.data.pageSize || response.data.PageSize,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { items: [], totalCount: 0, pageIndex, pageSize };
  }
};
