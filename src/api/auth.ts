import { BASE_URL } from "../constants";

export async function loginApi(login: string, password: string) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function registerApi(input: {
  login: string;
  password: string;
  email?: string;
  phone?: string;
}) {
  if (!input.login || !input.password || !input.email || !input.phone) {
    return {
      ok: false,
      status: 400,
      message: "Заполните логин, пароль, email и телефон",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/create-client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function checkLoginApi(login: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/check-login?login=${encodeURIComponent(login)}`,
      {
        method: "GET",
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}
