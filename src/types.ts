export interface AuthProps {
  username?: string;
  email: string;
  password: string;
}

export interface UserProps {
  email: string;
  password: string;
  username: string;
  bio: string;
  image: string;
}

export interface ProfileProps {
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface ArticleProps {
  slug: string;
  title: string;
  description: string;
  tagList: string[];
  created: number;
  updated: number;
  favorited: boolean;
  favoriteCount: number;
  author: ProfileProps;
  body?: string;
}

export interface CommentProps {
  id: number;
  created: number;
  body: string;
  author: ProfileProps;
}
