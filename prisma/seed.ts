import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  {
    code: "administrator",
    name: "Administrator",
    description: "Full operational access for approved academy administrators.",
  },
  {
    code: "coach",
    name: "Coach",
    description: "Operational access for assigned coaching workflows.",
  },
  {
    code: "parent",
    name: "Parent",
    description: "Guardian access for linked child artist profiles.",
  },
  {
    code: "artist",
    name: "Artist",
    description: "Performer access for owned or linked artist profiles.",
  },
] as const;

const settings = [
  {
    scope: "SYSTEM",
    setting_key: "password_min_length",
    setting_value: 12,
    is_sensitive: false,
  },
  {
    scope: "SYSTEM",
    setting_key: "audit_retention_years",
    setting_value: 7,
    is_sensitive: false,
  },
  {
    scope: "SYSTEM",
    setting_key: "notification_retention_days",
    setting_value: 90,
    is_sensitive: false,
  },
  {
    scope: "ACADEMY",
    setting_key: "academy_name",
    setting_value: "Secure Dance Academy",
    is_sensitive: false,
  },
  {
    scope: "ACADEMY",
    setting_key: "default_timezone",
    setting_value: "Asia/Singapore",
    is_sensitive: false,
  },
] as const;

async function main() {
  await prisma.$transaction(async (tx) => {
    for (const role of roles) {
      await tx.role.upsert({
        where: { code: role.code },
        update: {
          name: role.name,
          description: role.description,
          is_system: true,
        },
        create: {
          code: role.code,
          name: role.name,
          description: role.description,
          is_system: true,
        },
      });
    }

    for (const setting of settings) {
      await tx.appSetting.upsert({
        where: {
          scope_setting_key: {
            scope: setting.scope,
            setting_key: setting.setting_key,
          },
        },
        update: {
          setting_value: setting.setting_value,
          is_sensitive: setting.is_sensitive,
        },
        create: {
          scope: setting.scope,
          setting_key: setting.setting_key,
          setting_value: setting.setting_value,
          is_sensitive: setting.is_sensitive,
        },
      });
    }
  });

  console.info(
    `Seeded ${roles.length} roles and ${settings.length} baseline settings.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
});
