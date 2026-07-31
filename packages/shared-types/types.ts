export interface Profile {
  id: string;
  fullName: string;
}

export interface Shift {
  id: string;
  profileId: string;
  date: string;
}

export type ShiftWithProfile = Shift & {
  profile: Profile;
};

export interface ScheduleRow {
  profileId: string;
  fullName: string;
  shifts: (Shift | null)[];
}
