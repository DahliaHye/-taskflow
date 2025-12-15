export default class CommentService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }
  
  async getComments(taskId) {
    return this.http.fetch(`/comments/task/${taskId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }
  
  async createComment(taskId, content) {
    return this.http.fetch(`/comments/task/${taskId}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ content }),
    });
  }
  
  async deleteComment(commentId) {
    return this.http.fetch(`/comments/${commentId}`, {
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

