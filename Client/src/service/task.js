export default class TaskService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }
  
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.assignee) queryParams.append('assignee', filters.assignee);
    
    const query = queryParams.toString();
    const url = query ? `/tasks?${query}` : '/tasks';
    
    return this.http.fetch(url, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }
  
  async getTask(taskId) {
    return this.http.fetch(`/tasks/${taskId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }
  
  async createTask(taskData) {
    return this.http.fetch(`/tasks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(taskData),
    });
  }
  
  async updateTask(taskId, taskData) {
    return this.http.fetch(`/tasks/${taskId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(taskData),
    });
  }
  
  async deleteTask(taskId) {
    return this.http.fetch(`/tasks/${taskId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }
  
  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
}

