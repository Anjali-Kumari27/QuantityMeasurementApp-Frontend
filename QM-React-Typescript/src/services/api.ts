import type {
  AuthResponse,
  MeasurementType,
  QuantityDTO,
  QuantityInputDTO,
  QuantityMeasurementDTO,
} from "../types";

const BASE_URL = "http://localhost:8080";
// ================= AUTH =================

export async function registerUser(data: {
  fullName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Registration failed");
  }

  return response.json();
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return response.json();
}

// ================= TOKEN HEADER =================

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");

  if (!token) {
    return { "Content-Type": "application/json" };
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ================= QUANTITY OPERATIONS =================

export async function convertQuantity(
  payload: QuantityInputDTO
): Promise<QuantityMeasurementDTO> {
  const response = await fetch(`${BASE_URL}/api/v1/quantities/convert`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function compareQuantity(
  payload: QuantityInputDTO
): Promise<QuantityMeasurementDTO> {
  const response = await fetch(`${BASE_URL}/api/v1/quantities/compare`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function addQuantity(
  payload: QuantityInputDTO
): Promise<QuantityMeasurementDTO> {
  const response = await fetch(`${BASE_URL}/api/v1/quantities/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function subtractQuantity(
  payload: QuantityInputDTO
): Promise<QuantityMeasurementDTO> {
  const response = await fetch(`${BASE_URL}/api/v1/quantities/subtract`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

export async function divideQuantity(
  payload: QuantityInputDTO
): Promise<QuantityMeasurementDTO> {
  const response = await fetch(`${BASE_URL}/api/v1/quantities/divide`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

// ================= HISTORY =================

export async function getHistoryByMeasurementType(
  measurementType: MeasurementType
): Promise<QuantityMeasurementDTO[]> {
  const response = await fetch(
    `${BASE_URL}/api/v1/quantities/history/measurementType/${measurementType}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}

// ================= HELPERS =================

export function buildQuantityDTO(
  value: number,
  unit: string,
  measurementType: MeasurementType
): QuantityDTO {
  return {
    value,
    unit,
    measurementType,
  };
}