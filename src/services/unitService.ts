import {api} from './api';

// 1. CREATE UNIT (Handles both single payloads and batch modal payloads)
export interface UnitPayload {
  year: number;
  term: number;
  units: {
    code: string;
    name: string;
    grade: string;
    category: string;
  }[];
}
export const createUnits = async (payload: UnitPayload) => {
  const response = await api.post('/units', payload);
  return response.data;
};

// 2. GET ALL UNITS (Supports dynamic query filters like ?year=4&term=1)
export const getAllUnits = async (params = {}) => {
  const response = await api.get('/units', { params });
  return response.data;
};

// 3. GET SINGLE UNIT
export const getUnitById = async (id: string) => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

// 4. RETAKE UNIT (Payload only requires { code, grade })
interface RetakePayload {
  code: string;
  grade: string;
}
export const retakeUnit = async (retakeData: RetakePayload) => {
  const response = await api.post('/units/retake', retakeData);
  return response.data;
};

// 5. UPDATE UNIT
export const updateUnit = async (id: string, updateData: UnitPayload) => {
  const response = await api.put(`/units/${id}`, updateData);
  return response.data;
};

// 6. DELETE UNIT
export const deleteUnit = async (id: string) => {
  const response = await api.delete(`/units/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/units/categories');
  return response.data;
};

export interface GradeSummary {
  grade: string;
  totalCount: number;
  retakenCount?: number;
}
export interface StrengthUnit {
  code: string;
  name: string;
  grade: string;
}
export interface StrengthCategory {
  categoryName: string;
  signatureColor?: string;
  averageGrade: string;
  units: StrengthUnit[];
}
export interface StrengthTerm {
  term: number;
  strengths: StrengthCategory[];
}
export interface StrengthDistribution {
  yr: number;
  terms: StrengthTerm[];
}
export const getSummary = async () => {
  const response = await api.get('/units/summary');
  return response.data;
};