export default class PostService {
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }
  async getPosts(userid) {
    const query = userid ? `?userid=${userid}` : "";
    return this.http.fetch(`/post${query}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
  }
  async createPost(text) {
    return this.http.fetch(`/post`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
  }
  async deletePost(postId) {
    return this.http.fetch(`/post/${postId}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });
  }
  async updatePost(postId, text) {
    return this.http.fetch(`/post/${postId}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
  }
  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
