import ApiClient from "../utils/ApiClient";

export default class UserRepository {
  static async getAll() {
    const res = await ApiClient.get("/users/");
    return res.data;
  }

  static async findByEmail(email) {
    const res = await ApiClient.get("/users/");
    return res.data.find((u) => u.email === email);
  }

  static async add(name, cedula, email, password, role = "user") {
    try {
      const res = await ApiClient.post("/users/", {
        name,
        cedula,
        email,
        password,
        role,
      });
      return res.data;
    } catch (error) {
      return { error: error.response?.data?.detail || "Error al crear usuario" };
    }
  }
}
