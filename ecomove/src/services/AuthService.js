import ApiClient from "../utils/ApiClient";

export default class AuthService {

  static async login(email, password) {
    if (!email || !password) {
      return { success: false, message: "Por favor ingresa todos los campos" };
    }

    try {
      const response = await ApiClient.post("/users/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      return { success: true, user: response.data };
    } catch (error) {
      console.error("Error en login:", error);
      const msg =
        error.response?.data?.detail ||
        "Error al iniciar sesión. Verifica tus credenciales.";
      return { success: false, message: msg };
    }
  }

  // 🔹 REGISTRO
  static async register(name, cedula, email, password) {
    if (!name || !cedula || !email || !password) {
      return { success: false, message: "Todos los campos son obligatorios" };
    }

    try {
      const response = await ApiClient.post("/users/", {
        name: name.trim(),
        cedula: cedula.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "user",
      });

      return { success: true, user: response.data };
    } catch (error) {
      console.error("Error en register:", error);
      const msg =
        error.response?.data?.detail || "Error al registrar usuario";
      return { success: false, message: msg };
    }
  }
}