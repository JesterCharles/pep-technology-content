/*
TASK 8 (part 1). This is the front-end twin of the back end's open dev
profile: while enabled, the app signs everyone in as a fake admin without
asking, so during early development nobody had to log in. Exactly like the
dev profile, it must never be active outside local development - and this lab
ends with it OFF, so the sign-in flow you built actually guards the app.
Turn it off (and convince yourself nothing else still depends on it).
*/
export const devAutoSignIn = {
  enabled: true,
  session: {
    token: "tok-avery",
    user: { name: "Dev Admin (auto)", role: "admin" },
  },
};
