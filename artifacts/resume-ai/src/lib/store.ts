import { create } from "zustand";

export interface Contact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  jobTitle: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  tech: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
}

export interface ResumeData {
  contact: Contact;
  skills: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
}

const initialData: ResumeData = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    jobTitle: "",
    summary: "",
  },
  skills: "",
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
};

interface ResumeStore {
  data: ResumeData;
  updateContact: (contact: Partial<Contact>) => void;
  updateSkills: (skills: string) => void;
  
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addProject: (proj: Project) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;

  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  addLanguage: (lang: Language) => void;
  updateLanguage: (id: string, lang: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  clearAll: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  data: initialData,
  
  updateContact: (contact) => set((state) => ({ data: { ...state.data, contact: { ...state.data.contact, ...contact } } })),
  updateSkills: (skills) => set((state) => ({ data: { ...state.data, skills } })),
  
  addExperience: (exp) => set((state) => ({ data: { ...state.data, experience: [...state.data.experience, exp] } })),
  updateExperience: (id, exp) => set((state) => ({ data: { ...state.data, experience: state.data.experience.map(e => e.id === id ? { ...e, ...exp } : e) } })),
  removeExperience: (id) => set((state) => ({ data: { ...state.data, experience: state.data.experience.filter(e => e.id !== id) } })),

  addEducation: (edu) => set((state) => ({ data: { ...state.data, education: [...state.data.education, edu] } })),
  updateEducation: (id, edu) => set((state) => ({ data: { ...state.data, education: state.data.education.map(e => e.id === id ? { ...e, ...edu } : e) } })),
  removeEducation: (id) => set((state) => ({ data: { ...state.data, education: state.data.education.filter(e => e.id !== id) } })),

  addProject: (proj) => set((state) => ({ data: { ...state.data, projects: [...state.data.projects, proj] } })),
  updateProject: (id, proj) => set((state) => ({ data: { ...state.data, projects: state.data.projects.map(p => p.id === id ? { ...p, ...proj } : p) } })),
  removeProject: (id) => set((state) => ({ data: { ...state.data, projects: state.data.projects.filter(p => p.id !== id) } })),

  addCertification: (cert) => set((state) => ({ data: { ...state.data, certifications: [...state.data.certifications, cert] } })),
  updateCertification: (id, cert) => set((state) => ({ data: { ...state.data, certifications: state.data.certifications.map(c => c.id === id ? { ...c, ...cert } : c) } })),
  removeCertification: (id) => set((state) => ({ data: { ...state.data, certifications: state.data.certifications.filter(c => c.id !== id) } })),

  addLanguage: (lang) => set((state) => ({ data: { ...state.data, languages: [...state.data.languages, lang] } })),
  updateLanguage: (id, lang) => set((state) => ({ data: { ...state.data, languages: state.data.languages.map(l => l.id === id ? { ...l, ...lang } : l) } })),
  removeLanguage: (id) => set((state) => ({ data: { ...state.data, languages: state.data.languages.filter(l => l.id !== id) } })),

  clearAll: () => set({ data: initialData }),
}));
