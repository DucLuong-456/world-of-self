export interface UserProfile {
  id: string;
  bio?: string;
  location?: string;
  website?: string;
  cover_avatar?: string;
  profession?: string;
  company?: string;
  education?: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: string;
  user_name: string;
  avatar?: string;
  profile?: UserProfile;
  created_at?: string;
}
