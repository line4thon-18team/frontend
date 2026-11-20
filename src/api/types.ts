export type CompanionCode = "ALONE" | "COUPLE" | "FRIEND" | "FAMILY";
export type TripStatus = "DRAFT" | "CONFIRMED";
export type PlaceCategoryCode =
  | "FOOD"
  | "CAFE"
  | "SIGHTSEEING"
  | "SHOPPING"
  | "NATURE"
  | "CULTURE"
  | "NIGHTLIFE"
  | "ACTIVITY"
  | "OTHER";

export interface CityResponse {
  name: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
}

export interface TripResponse {
  id: number;
  city: string;
  startDate: string;
  endDate: string;
  companion: CompanionCode;
  companionCount: number;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TripInput {
  city: string;
  startDate: string;
  endDate: string;
  companion: CompanionCode;
  companionCount?: number;
}

export type TripUpdateInput = Partial<TripInput>;

export interface PlaceCandidate {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category?: PlaceCategoryCode | null;
}

export interface PopularPlaceResponse {
  placeId: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  category: PlaceCategoryCode | null;
  savedCount: number;
}

export type PlaceSource =
  | "TAKEOUT"
  | "SHARED_LINK"
  | "MANUAL_SEARCH"
  | "AI_RECOMMEND"
  | "POPULAR";
export type PlaceMatchStatus =
  | "PENDING"
  | "MATCHED"
  | "NEEDS_REVIEW"
  | "NOT_FOUND"
  | "CLOSED"
  | "OUT_OF_CITY";

export interface SavedPlaceResponse {
  id: number;
  featureId: string | null;
  name: string;
  note: string | null;
  googleUrl: string | null;
  source: PlaceSource;
  listNames: string[];
  placeId: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  category: PlaceCategoryCode | null;
  matchStatus: PlaceMatchStatus;
}

export interface SavedPlaceListResponse {
  tripId: number;
  count: number;
  places: SavedPlaceResponse[];
}

export interface MySavedPlaceResponse {
  trip: Pick<TripResponse, "id" | "city" | "startDate" | "endDate">;
  place: SavedPlaceResponse;
}

export interface PlaceImportResponse {
  tripId: number;
  totalNewCount: number;
  lists: Array<{
    listName: string;
    placeCount: number;
    newCount: number;
    duplicateCount: number;
    skippedCount: number;
  }>;
}

export type TravelPace = "RELAXED" | "NORMAL" | "PACKED";
export type WalkingPreference = "LESS" | "NORMAL" | "MORE";
export type DayStartPreference = "EARLY" | "NORMAL" | "LATE";
export type PreferenceCategoryCode = Exclude<PlaceCategoryCode, "OTHER">;

export interface PreferenceProfile {
  pace: TravelPace;
  walking: WalkingPreference;
  dayStart: DayStartPreference;
  interests: PreferenceCategoryCode[];
  avoid: PreferenceCategoryCode[];
  notes: string[];
}

export interface PreferenceChip {
  type: "PACE" | "WALKING" | "DAY_START" | "INTEREST" | "AVOID" | "NOTE";
  value: string;
  label: string;
}

export interface PreferenceInput extends PreferenceProfile {
  rawText?: string | null;
}

export interface PreferenceView {
  tripId: number;
  userId: number;
  saved: boolean;
  preferences: PreferenceProfile;
  chips: PreferenceChip[];
  rawText: string | null;
  updatedAt: string | null;
}

export type UserPreferenceView = Omit<PreferenceView, "tripId">;

export interface PreferenceAnalysis {
  status: "INTERPRETED" | "EMPTY_INPUT" | "FALLBACK_DEFAULT";
  preferences: PreferenceProfile;
  chips: PreferenceChip[];
  fallbackReason: string | null;
}

export interface ItineraryVisitInput {
  itemId?: string;
  placeId: string;
  stayMinutes?: number;
  fixedStart?: string;
  travelMode?: "WALK" | "TRANSIT" | "DRIVE" | null;
}

export interface ItineraryDayInput {
  date: string;
  visits: ItineraryVisitInput[];
}

export interface ItineraryDraft {
  days: ItineraryDayInput[];
}

export interface PlaceDaySuggestion {
  placeId: string;
  placeName: string;
  recommendedDay: number | null;
  days: Array<{ day: number; date: string; visitCount: number; recommended: boolean }>;
}

export interface TravelLeg {
  mode: "WALK" | "TRANSIT" | "DRIVE";
  minutes: number;
  distanceMeters: number;
  source: string;
  estimated?: boolean;
}

export interface ScheduledVisit {
  itemId: string;
  placeId: string;
  travel: TravelLeg;
  arrival: string;
  start: string;
  end: string;
  waitMinutes: number;
  stayMinutes: number;
}

export interface ValidationResult {
  days: Array<{
    date: string;
    window: { start: string; end: string };
    visits: ScheduledVisit[];
    returnLeg: TravelLeg | null;
    endsAt: string;
  }>;
  issues: Array<{
    code: string;
    severity: "ERROR" | "WARNING";
    kind: string;
    date: string;
    itemId: string | null;
    placeId: string | null;
    params: Record<string, unknown>;
  }>;
  summary: {
    valid: boolean;
    errorCount: number;
    warningCount: number;
    placesNeedingCheck: number;
  };
}

export interface ItineraryVersionView {
  version: number;
  source:
    | "AI_GENERATED"
    | "AI_EDITED"
    | "MANUAL_EDIT"
    | "COURSE_ADD"
    | "REVERT";
  baseVersion: number | null;
  createdBy: number;
  createdAt: string;
  draft: ItineraryDraft;
  validation: ValidationResult;
}

export interface GeneratedItineraryResponse {
  itinerary: ItineraryVersionView;
  excludedPlaceIds: string[];
  closedPlaceIds?: string[];
}

export interface ItineraryDiff {
  changes: Array<{
    kind: "ADDED" | "REMOVED" | "MOVED_DAY" | "STAY_CHANGED" | "FIXED_START_CHANGED";
    itemId: string;
    placeId: string;
    fromDate: string | null;
    toDate: string | null;
    fromStayMinutes: number | null;
    toStayMinutes: number | null;
    fromFixedStart: string | null;
    toFixedStart: string | null;
  }>;
  reorderedDays: string[];
}

export interface ItineraryEditPreview {
  editRequestId: number;
  baseVersion: number;
  reason: string;
  itinerary: {
    draft: ItineraryDraft;
    validation: ValidationResult;
  };
  diff: ItineraryDiff;
}

export interface ItineraryVersionSummary {
  version: number;
  source: ItineraryVersionView["source"];
  baseVersion: number | null;
  createdBy: number;
  createdAt: string;
}

export interface FlightPoint {
  airport: string;
  time: string;
  lat: number;
  lng: number;
}

export interface FlightInfo {
  number: string;
  airline: string | null;
  departure: FlightPoint;
  arrival: FlightPoint;
}

export interface ReservationResponse {
  tripId: number;
  flights: { outbound: FlightInfo | null; return: FlightInfo | null } | null;
  stays: Array<{
    placeId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    checkIn: string;
    checkOut: string;
  }>;
  rental: {
    dates: string[];
    placeId: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  } | null;
}

export interface CourseSummaryResponse {
  id: number;
  title: string;
  country: string;
  city: string;
  dayCount: number;
  nightCount: number;
  stopCount: number;
  coverImageUrl: string | null;
  transportSummary: string | null;
  author: {
    name: string | null;
    imageUrl: string | null;
    sourceLabel: string | null;
    travelMonth: string | null;
  };
  tags: string[];
}

export interface CourseDetailResponse extends CourseSummaryResponse {
  description: string | null;
  days: Array<{
    dayNumber: number;
    stopCount: number;
    stops: Array<{
      id: number;
      position: number;
      placeId: string;
      name: string;
      category: PlaceCategoryCode;
      latitude: number;
      longitude: number;
      visitTime: string | null;
      imageUrl: string | null;
    }>;
  }>;
}

export interface MyStatsResponse {
  savedPlaceCount: number;
  savedCourseCount: number;
  completedTripCount: number;
}

export interface InvitePreviewResponse {
  city: string;
  startDate: string;
  endDate: string;
  companion: CompanionCode;
  inviterName: string | null;
  memberCount: number;
  maxMembers: number;
  savedPlaceCount: number;
  expiresAt: string;
}

export interface InviteAcceptResponse {
  tripId: number;
}

export interface InviteResponse {
  token: string;
  expiresAt: string;
}

export interface MemberResponse {
  userId: number;
  name: string;
  profileImageUrl: string | null;
  characterId: number | null;
  role: "OWNER" | "MEMBER";
  me: boolean;
  joinedAt: string;
}

