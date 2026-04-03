export type MatchTeam = {
  name: string;
  score?: number;
  wickets?: number;
  overs?: string;
};

export type Match = {
  id: number;
  matchName: string;
  category: string;
  date: string;
  venue: string;
  status: string;
  result?: string;
  team1: MatchTeam;
  team2: MatchTeam;
};

export type MatchesResponse = {
  matches: Match[];
};

export type SportsNewsItem = {
  id?: string | number;
  title?: string;
  url?: string;
  source?: string;
  publishedAt?: string;
};

export type SportsNewsResponse = {
  news?: SportsNewsItem[];
  lastUpdated?: string;
  sources?: string[];
  count?: number;
  message?: string;
};
