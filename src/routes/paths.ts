export const routes = {
  landing: "/",
  login: "/login",
  register: "/register",
  otp: "/otp-verification",
  verify: "/verify",
  welcome: "/welcome",
  marketplace: "/marketplace",
  subscription: "/subscription",
  dashboard: "/dashboard",
  account: "/account",
  profile: "/account/profile",
  billing: "/account/billing",
  settings: "/account/settings",
  users: "/account/users",
  rbac: "/account/rbac",
  humanDetection: "/modules/human-detection",
  objectDetection: "/modules/object-detection",
  threatDetection: "/modules/threat-detection",
  weaponDetection: "/modules/weapon-detection",
  accidentDetection: "/modules/accident-detection",
} as const;

export type AppRoutePath = (typeof routes)[keyof typeof routes];
