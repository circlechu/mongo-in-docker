// Runs once on first startup (only when data/ is empty).
// Creates an app-level user with readWrite access to the app database.
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

db.createUser({
  user: "formpf3_user",
  pwd:  "changeme_app",
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }]
});
