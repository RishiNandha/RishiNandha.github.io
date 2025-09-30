export interface ProjectLink {
  name: string;
  url: string;
}

export interface Project {
  type: 'research' | 'other';
  image: string;
  title: string;
  description: string;
  links: ProjectLink[];
}

export interface MusicItem {
  type: 'original' | 'cover';
  platform: 'youtube' | 'instagram';
  url: string; // The full URL
  title: string;
}