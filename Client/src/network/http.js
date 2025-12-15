export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  async fetch(url, options) {
    try {
      const res = await fetch(`${this.baseURL}${url}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      
      let data;
      try {
        data = await res.json();
      } catch (error) {
        // JSON 파싱 실패 시 빈 객체 반환
        data = {};
      }
      
      if (res.status > 299 || res.status < 200) {
        const message =
          data && data.message ? data.message : `서버 오류 (${res.status})`;
        throw new Error(message);
      }
      return data;
    } catch (error) {
      // 네트워크 에러 처리
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error(`서버에 연결할 수 없습니다. 서버가 실행 중인지 확인하세요. (${this.baseURL})`);
      }
      throw error;
    }
  }
}
