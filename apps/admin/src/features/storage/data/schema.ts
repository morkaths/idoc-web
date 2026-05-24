export type CloudinaryRawResponse = {
  error?: string;
  plan?: string;
  last_updated?: string;
  resources?: number;
  derived_resources?: number;
  storage?: { usage?: number; limit?: number };
  bandwidth?: { usage?: number; limit?: number };
  transformations?: { usage?: number; limit?: number };
  requests?: number;
  credits?: { usage?: number; limit?: number; used_percent?: number };
  media_limits?: { image_max_size_bytes?: number; video_max_size_bytes?: number };
};
