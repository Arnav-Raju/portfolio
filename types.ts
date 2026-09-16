export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  demoUrl?: string;
  repoUrl?: string;
  difficulty: 1 | 2 | 3; // 1: Beginner, 2: Advanced, 3: Insane
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies: string[];
  type: 'work' | 'education';
  logoUrl?: string;
  logoUrls?: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  category: 'AI/ML' | 'Data Science' | 'Analytics';
  viewUrl?: string;
}

export interface SkillItem {
  name: string;
  score: number; // 0-100 confidence/skill level
}

export interface SkillCategory {
  category: string;
  items: SkillItem[];
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  RGB = 'rgb',
  VIBE = 'vibe',
  CUSTOM = 'custom'
}

export interface CustomThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  primaryFont: string;
  secondaryFont: string;
  tertiaryFont: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}