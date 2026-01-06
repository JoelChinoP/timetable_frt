import type { ApiResponse } from '../types';

// ============================================
// Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// ============================================
// Custom Error Class
// ============================================

export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================
// Request Options Type
// ============================================

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  timeout?: number;
};

// ============================================
// Core Fetch Wrapper
// ============================================

export async function fetchWithApi<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const url = `${API_BASE_URL}${path}`;

  // Prepare headers
  const headers = new Headers(fetchOptions.headers);
  if (body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const json = await response.json() as ApiResponse<T>;

    // Validate response shape
    if (typeof json.success !== 'boolean') {
      throw new ApiError('Invalid API response format', response.status, json);
    }

    // Handle API-level errors
    if (!json.success) {
      throw new ApiError(
        json.message || 'An error occurred',
        response.status,
        json.data
      );
    }

    // Handle HTTP errors with successful API response (edge case)
    if (!response.ok) {
      throw new ApiError(
        json.message || `HTTP error ${response.status}`,
        response.status,
        json.data
      );
    }

    return json.data;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw new ApiError(error.message, 0);
    }

    throw new ApiError('Unknown error occurred', 0);
  }
}

// ============================================
// HTTP Method Helpers
// ============================================

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    fetchWithApi<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    fetchWithApi<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    fetchWithApi<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    fetchWithApi<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: RequestOptions) =>
    fetchWithApi<T>(path, { ...options, method: 'DELETE' }),
};
