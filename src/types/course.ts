export type CourseInterest = "전체" | "미식" | "도시 산책" | "휴양";

export interface CourseDestination {
  name: string;
  country: string;
  image?: string;
}

export interface TravelCourse {
  id: string;
  title: string;
  city: string;
  country: string;
  duration: string;
  author: string;
  image: string;
  avatar?: string;
  description?: string;
  interests: CourseInterest[];
}

export interface CourseTheme {
  id: string;
  title: string;
  cities: string[];
  image: string;
  interest: CourseInterest;
}

export interface TravelerCoursePlace {
  visitTime?: string;
  id: string;
  name: string;
  category: string;
  image: string;
  latitude?: number;
  longitude?: number;
  travelTime?: string;
  distance?: string;
  distanceMeters?: number;
  estimatedDistance?: boolean;
}

export interface TravelerCourseDay {
  label: string;
  places: TravelerCoursePlace[];
}

export interface TravelerCourseView {
  id: string;
  city: string;
  duration: string;
  tags: string[];
  title: string;
  author: string;
  authorNote: string;
  publishedAt: string;
  description: string;
  placeCount: number;
  transport: string;
  hero: string;
  firstPlaceId?: string | null;
  authorImage: string;
  mapFull: string;
  days: TravelerCourseDay[];
}
