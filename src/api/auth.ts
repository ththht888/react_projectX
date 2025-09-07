const BASE_URL = "http://localhost:5000/api";

type Ok<T> = { ok: true; data: T; status: number; message?: string };
type Err = { ok: false; status: number; message: string; raw?: any };

function pickMsg(payload: any, fallback: string) {
  if (!payload) return fallback;
  return (
    payload.message ||
    payload.error ||
    payload.detail ||
    (Array.isArray(payload.errors) && payload.errors[0]) ||
    fallback
  );
}

async function parse(res: Response) {
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

async function doFetch<T>(
  url: string,
  init: RequestInit
): Promise<Ok<T> | Err> {
  try {
    console.log(
      "[REQ]",
      url,
      init.body instanceof URLSearchParams
        ? Object.fromEntries((init.body as URLSearchParams).entries())
        : init.body
    );
    const res = await fetch(url, init);
    const payload = await parse(res);
    if (res.ok)
      return {
        ok: true,
        data: (payload ?? {}) as T,
        status: res.status,
        message: (payload as any)?.message,
      };
    const err: Err = {
      ok: false,
      status: res.status,
      message: pickMsg(payload, `Ошибка ${res.status}`),
      raw: payload,
    };
    console.warn("[RES]", url, res.status, payload);
    return err;
  } catch {
    return { ok: false, status: 0, message: "Нет связи с сервером" };
  }
}

async function postWithFallbacks<T>(
  path: string,
  attempts: Array<() => RequestInit>
) {
  for (let i = 0; i < attempts.length; i++) {
    const init = attempts[i]();
    const res = await doFetch<T>(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { Accept: "application/json", ...(init.headers || {}) },
      body: init.body,
    });
    if (res.ok) return res;
    if ((res as Err).status !== 400) return res;
    if (i === attempts.length - 1) return res;
  }
  return { ok: false, status: 400, message: "Ошибка 400" } as Err;
}

export async function loginApi(login: string, password: string) {
  return postWithFallbacks<{ login?: string; username?: string }>("/login", [
    () => ({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    }),
    () => ({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: login, password }),
    }),
    () => ({
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ login, password }),
    }),
  ]);
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
    } as Err;
  }

  const bodyStr = {
    login: input.login,
    password: input.password,
    email: input.email,
    phone: String(input.phone),
  };
  const bodyNum = {
    login: input.login,
    password: input.password,
    email: input.email,
    phone: Number(input.phone),
  };
  const bodyUserStr = {
    username: input.login,
    password: input.password,
    email: input.email,
    phone: String(input.phone),
  };

  return postWithFallbacks("/create-client", [
    () => ({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyStr),
    }),
    () => ({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyNum),
    }),
    () => ({
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyUserStr),
    }),
    () => ({
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(
        Object.entries(bodyStr).reduce((a, [k, v]) => {
          a[k] = String(v);
          return a;
        }, {} as Record<string, string>)
      ),
    }),
  ]);
}

export async function checkLoginApi(login: string) {
  if (!login)
    return {
      ok: true,
      data: { available: false },
      status: 200,
      message: "",
    } as Ok<{ available: boolean }>;
  return doFetch<{ available?: boolean }>(
    `${BASE_URL}/check-login?login=${encodeURIComponent(login)}`,
    { method: "GET", headers: { Accept: "application/json" } }
  );
}
