import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const projectRoot = process.cwd();
const driveLetters = ["X", "Y", "Z", "W", "V"];

function createDriveMapping(root) {
  for (const letter of driveLetters) {
    const result = spawnSync("subst", [`${letter}:`, root], {
      stdio: "ignore",
    });

    if (result.status === 0) {
      return `${letter}:\\`;
    }
  }

  throw new Error(
    "Unable to create a temporary drive mapping for the build workspace.",
  );
}

function removeDriveMapping(mappedRoot) {
  const drive = mappedRoot.slice(0, 2);
  spawnSync("subst", [drive, "/d"], {
    stdio: "ignore",
  });
}

const mappedRoot =
  process.platform === "win32" ? createDriveMapping(projectRoot) : projectRoot;
const shouldRemoveMapping = mappedRoot !== projectRoot;
const tempRoot = path.join(mappedRoot, ".tmp", "build");
const profileRoot = path.join(mappedRoot, ".tmp", "profile");

fs.mkdirSync(tempRoot, { recursive: true });
fs.mkdirSync(profileRoot, { recursive: true });

const env = {
  ...process.env,
  TEMP: tempRoot,
  TMP: tempRoot,
  TMPDIR: tempRoot,
  HOME: profileRoot,
  USERPROFILE: profileRoot,
  npm_config_tmp: tempRoot,
};

function run(commandArgs) {
  const result = spawnSync(
    process.execPath,
    ["--preserve-symlinks", "--preserve-symlinks-main", ...commandArgs],
    {
      cwd: mappedRoot,
      env,
      stdio: "inherit",
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

try {
  run([path.join("node_modules", "prisma", "build", "index.js"), "generate"]);
  run([path.join("node_modules", "next", "dist", "bin", "next"), "build"]);
} finally {
  if (shouldRemoveMapping) {
    removeDriveMapping(mappedRoot);
  }
}
