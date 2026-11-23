export interface Author {
  id: string;
  name: string;
  title?: string;
  avatarUrl?: string;
  bio?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  colorHex?: string;
  articleCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Edition {
  id: string;
  issueNumber: number;
  volume: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  releaseDate: string;
  isCurrent: boolean;
}

export interface Article {
  id: string;
  title: string;
  kicker?: string;
  subtitle?: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  coverImageCaption?: string;
  coverImageCredit?: string;
  format: 'DISPATCH' | 'DOSSIER' | 'DIALOGUE' | 'ESSAY' | 'VISUAL_STORY';
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  heroOrder?: number;
  readingTimeMinutes: number;
  audioUrl?: string;
  audioDurationSeconds?: number;
  viewCount: number;
  publishedAt: string;
  author: Author;
  category: Category;
  edition?: Edition;
  tags?: Tag[];
  related?: Article[];
  comments?: Array<{
    id: string;
    content: string;
    isCurated: boolean;
    createdAt: string;
    user: {
      name: string;
      title?: string;
      avatarUrl?: string;
    };
  }>;
}
