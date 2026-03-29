class Ajax {
  async get(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`GET ${url} failed: ${response.status}`);
    return response.json();
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`POST ${url} failed: ${response.status}`);
    return response.json();
  }

  async patch(url, data) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      throw new Error(`PATCH ${url} failed: ${response.status}`);
    return response.json();
  }

  async delete(url) {
    const response = await fetch(url, { method: "DELETE" });
    if (!response.ok)
      throw new Error(`DELETE ${url} failed: ${response.status}`);
    return response.status === 204 ? null : response.json();
  }
}

export const ajax = new Ajax();
