import type { Id } from './common';

export type Modality = 'in_person' | 'online' | 'hybrid';

export interface CourseLesson {
  title: string;
  duration: string;
  /** Lesson offered as a free sample. */
  free?: boolean;
}

export interface CourseModule {
  title: string;
  lessons: CourseLesson[];
}

/** Course: the single source for the public catalog and the admin CMS. */
export interface Course {
  id: Id;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  sectorId: Id;
  /** Credentials this course grants or renews (catalog filter). */
  credentialIds: Id[];
  modality: Modality;
  /** Default address of in-person/hybrid cohorts. */
  defaultLocation?: string;
  /** SAP product code, internal reference only. */
  sapCode?: string;
  duration: string;
  price: number;
  originalPrice: number | null;
  certificate: boolean;
  nextDate: string;
  spotsLeft: number;
  /** Stable public path (`/images/courses/…`), never a bundler-hashed URL. */
  imageUrl: string;
  students: number;
  rating: number;
  reviews: number;
  modules: number;
  learningPoints: string[];
  targetAudience: string[];
  prerequisites: string[];
  curriculum: CourseModule[];
  instructor: string;
  instructorRole: string;
  instructorBio: string;
  instructorCourses: number;
  instructorStudents: number;
  active: boolean;
  updatedAt: string;
}

/** Operational credential required to work at the airport. */
export interface Credential {
  id: Id;
  name: string;
  acronym: string;
  description: string;
  /** Validity in months; 0 = no defined validity. */
  validityMonths: number;
  sectorIds: Id[];
  active: boolean;
  createdAt: string;
}

export type CourseInput = Omit<Course, 'id' | 'updatedAt'>;
export type CredentialInput = Omit<Credential, 'id' | 'createdAt'>;
