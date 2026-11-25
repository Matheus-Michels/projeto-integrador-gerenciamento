const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public isNetworkError: boolean = false
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      let message = "Ocorreu um erro ao se comunicar com o servidor.";

      try {
        const data = await res.json();
        if (data?.message) message = data.message;
      } catch {}

      throw new ApiError(message, res.status);
    }

    if (res.status === 204) return null as T;

    const text = await res.text();
    return text ? (JSON.parse(text) as T) : (null as T);
  } catch (error: any) {
    if (
      error instanceof TypeError ||
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError") ||
      error.name === "TypeError"
    ) {
      throw new ApiError(
        "Não foi possível conectar ao servidor. Verifique se o backend está rodando ou se há problema de CORS.",
        undefined,
        true
      );
    }

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      error.message || "Erro desconhecido ao se comunicar com o servidor."
    );
  }
}