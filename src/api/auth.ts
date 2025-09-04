const BASE_URL = "http://localhost:5000/api";

type ApiOk<T = unknown> = {
  ok: true;
  data: T;
  message?: string;
  status: number;
};
type ApiErr = { ok: false; message: string; status: number };

async function parseResponse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const txt = await res.text();
    return txt ? { message: txt } : null;
  } catch {
    return null;
  }
}

function pickMessage(payload: any, fallback: string) {
  if (!payload) return fallback;
  return (
    payload.message ||
    payload.error ||
    payload.detail ||
    (Array.isArray(payload.errors) && payload.errors[0]) ||
    fallback
  );
}

async function postJson<T>(
  path: string,
  body: unknown
): Promise<ApiOk<T> | ApiErr> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const payload = await parseResponse(res);

    if (res.ok) {
      return {
        ok: true,
        data: (payload ?? {}) as T,
        message: payload?.message,
        status: res.status,
      };
    }
    return {
      ok: false,
      message: pickMessage(payload, `Ошибка ${res.status}`),
      status: res.status,
    };
  } catch (e) {
    return { ok: false, message: "Нет связи с сервером", status: 0 };
  }
}

async function getJson<T>(path: string): Promise<ApiOk<T> | ApiErr> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const payload = await parseResponse(res);

    if (res.ok) {
      return {
        ok: true,
        data: (payload ?? {}) as T,
        message: payload?.message,
        status: res.status,
      };
    }
    return {
      ok: false,
      message: pickMessage(payload, `Ошибка ${res.status}`),
      status: res.status,
    };
  } catch {
    return { ok: false, message: "Нет связи с сервером", status: 0 };
  }
}

export async function loginApi(login: string, password: string) {
  return postJson<{ login: string }>("/login", { login, password });
}

export async function registerApi(input: {
  login: string;
  password: string;
  email?: string;
  phone?: string;
}) {
  const body: Record<string, any> = {
    login: input.login,
    password: input.password,
  };
  if (input.email) body.email = input.email;
  if (input.phone) {
    body.phone = Number(input.phone);
  }
  return postJson("/create-client", body);
}

export async function checkLoginApi(login: string) {
  if (!login)
    return {
      ok: true,
      data: { available: false },
      message: "",
      status: 200,
    } as ApiOk<{
      available: boolean;
    }>;
  return getJson<{ available?: boolean }>(
    `/check-login?login=${encodeURIComponent(login)}`
  );
}
