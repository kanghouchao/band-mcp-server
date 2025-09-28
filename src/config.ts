export interface BandConfig {
  accessToken: string;
  baseUrl: string;
}

export const bandConfig: BandConfig = {
  accessToken: process.env.BAND_ACCESS_TOKEN || "",
  baseUrl: "https://openapi.band.us",
};
