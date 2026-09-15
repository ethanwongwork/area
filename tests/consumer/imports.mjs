// Run from a temporary directory populated only by the three npm tarballs.
const checks = [];
for (const name of ['@area/tokens', '@area/react', '@area/styles/manifest']) {
  try { await import(name); checks.push({ name, pass: true }); }
  catch (error) { checks.push({ name, pass: false, code: error.code, message: error.message }); }
}
console.log(JSON.stringify(checks, null, 2));
process.exitCode = checks.some(check => !check.pass) ? 1 : 0;
