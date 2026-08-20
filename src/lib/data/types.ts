export type UserRecord = {
  id: string;
  email: string;
  username: string | null;
  createdAt: string;
};

export type LoginTokenRecord = {
  token: string;
  email: string;
  userId: string;
  expiresAt: string;
  usedAt: string | null;
  createdAt: string;
};

export type PhotoRecord = {
  id: string;
  url: string;
  createdAt: string;
};

export type VespaRecord = {
  id: string;
  ownerId: string;
  year: number | null;
  model: string;
  vin: string | null;
  color: string | null;
  story: string | null;
  createdAt: string;
  photos: PhotoRecord[];
};
