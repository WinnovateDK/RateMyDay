export interface Rating {
  Label: string;
  Rating: number;
  fullDate?: Date;
  Note?: string;
}

export type chartDataType = {
  Label: Date;
  Rating: number;
};

export type Stats = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
};

export type RatingStats = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  count: number;
};

export type RatingStatsYear = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  count: number;
  allRatings: number[];
};