async function main() {
  console.info("No seed data is defined during project initialization.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
