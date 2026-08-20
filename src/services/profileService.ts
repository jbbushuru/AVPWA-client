import { api } from './api';

// Shape returned by GET /profile/me
export interface Profile {
  email: string | null;
  firstName: string;
  lastName: string;
  course: string;
  courseDuration: number;
  academicSystem: 'Semester' | 'Trimester';
  year: number;
  term: number;
  target: number | null;
  studyReminders: boolean;
  assignmentAlerts: boolean;
}

export interface CreateProfileDTO {
  firstName: string;
  lastName: string;
  course: string;
  courseDuration: number;
  academicSystem: 'Semester' | 'Trimester';
  year: number;
  term: number;
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  course?: string;
  courseDuration?: number;
  academicSystem?: 'Semester' | 'Trimester';
  year?: number;
  term?: number;
  target?: number | null;
  studyReminders?: boolean;
  assignmentAlerts?: boolean;
}

export const profileService = {
  /**
   * Get the full profile of the logged-in user (used for auth context hydration and prefilling the edit profile page)
   */
  async getMyProfile(): Promise<Profile> {
    const response = await api.get<Profile>('/profile/me');
    return response.data;
  },

  /**
   * Create initial profile during onboarding (POST)
   */
  async createProfile(data: CreateProfileDTO): Promise<Profile> {
    const response = await api.post<Profile>('/profile', data);
    return response.data;
  },

  /**
   * Update profile details or preferences (PATCH)
   */
  async updateProfile(data: UpdateProfileDTO): Promise<Profile> {
    const response = await api.patch<Profile>('/profile', data);
    return response.data;
  },
};