// Resets an existing admin account's password, or creates the account as
// an admin if it doesn't exist yet. Useful if the seed-time password was
// lost.
//
// Usage:
//   SEED_ADMIN_USERNAME=admin SEED_ADMIN_PASS=newpassword123 npm run reset-admin-password
// or just:
//   npm run reset-admin-password
// which generates a random password and prints it once.
require("./load-env");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { neon } = require("@neondatabase/serverless");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not set. Copy .env.example to .env.local and fill in your Neon connection string first.");
    process.exit(1);
  }

  const sql = neon(connectionString);
  const username = process.env.SEED_ADMIN_USERNAME || "admin";
  const generatedPassword = crypto.randomBytes(12).toString("base64url");
  const password = process.env.SEED_ADMIN_PASS || generatedPassword;
  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await sql`SELECT id FROM admin_users WHERE username = ${username}`;
  if (existing.length > 0) {
    await sql`UPDATE admin_users SET password_hash = ${passwordHash} WHERE username = ${username}`;
    console.log(`Password updated for "${username}".`);
  } else {
    await sql`
      INSERT INTO admin_users (username, password_hash, role, permissions)
      VALUES (${username}, ${passwordHash}, 'admin', '[]')
    `;
    console.log(`Created new admin account "${username}".`);
  }

  if (!process.env.SEED_ADMIN_PASS) {
    console.log("");
    console.log("========================================================");
    console.log(`  Admin login:    ${username}`);
    console.log(`  Admin password: ${password}`);
    console.log("========================================================");
    console.log("");
  }
}

main().catch((err) => {
  console.error("Failed to reset admin password:", err);
  process.exit(1);
});
