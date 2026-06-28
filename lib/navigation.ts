import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bell,
  ClipboardList,
  FileText,
  HeartPulse,
  LayoutDashboard,
  SmilePlus,
  Users,
  UserRound,
  Settings,
  UsersRound,
  CalendarDays,
  ScrollText,
  Search,
  UserCog,
  FolderKanban,
  Siren,
  MessageSquareMore,
} from "lucide-react";
import type { AppRoleCode, PermissionCode } from "@/types/rbac";
import type { SessionUser } from "@/types/auth";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
  roles?: AppRoleCode[];
  permission?: PermissionCode;
};

export type NavigationSection = {
  label: string;
  items: NavigationItem[];
};

const sections: NavigationSection[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Profile", href: "/profile", icon: UserRound },
      { label: "Notifications", href: "/notifications", icon: Bell },
      { label: "Search", href: "/search", icon: Search },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        label: "Artists",
        href: "/artists",
        icon: SmilePlus,
        roles: ["administrator", "coach", "parent", "artist"],
      },
      {
        label: "Attendance",
        href: "/attendance",
        icon: ClipboardList,
        roles: ["administrator", "coach"],
      },
      {
        label: "Performances",
        href: "/performances",
        icon: Activity,
        roles: ["administrator", "coach", "parent", "artist"],
      },
      {
        label: "Injuries",
        href: "/injuries",
        icon: Siren,
        roles: ["administrator", "coach"],
      },
      {
        label: "Medical",
        href: "/medical",
        icon: HeartPulse,
        roles: ["administrator", "coach", "parent", "artist"],
      },
      {
        label: "Activities",
        href: "/activities",
        icon: CalendarDays,
        roles: ["administrator", "coach", "parent", "artist"],
      },
    ],
  },
  {
    label: "Control",
    items: [
      {
        label: "Reports",
        href: "/reports",
        icon: FileText,
        roles: ["administrator", "coach", "parent", "artist"],
      },
      {
        label: "Audit log",
        href: "/audit-log",
        icon: ScrollText,
        roles: ["administrator"],
      },
      {
        label: "Users",
        href: "/users",
        icon: Users,
        roles: ["administrator"],
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        roles: ["administrator"],
      },
      {
        label: "Invitations",
        href: "/users/invitations",
        icon: UserCog,
        roles: ["administrator"],
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        label: "Parent view",
        href: "/parents",
        icon: UsersRound,
        roles: ["administrator", "parent"],
      },
      {
        label: "Coach view",
        href: "/coaches",
        icon: FolderKanban,
        roles: ["administrator", "coach"],
      },
      {
        label: "Help",
        href: "/notifications",
        icon: MessageSquareMore,
        roles: ["administrator", "coach", "parent", "artist"],
      },
    ],
  },
];

function canSeeItem(user: SessionUser, item: NavigationItem) {
  if (user.primaryRole === "administrator") {
    return true;
  }

  if (item.roles && item.roles.length > 0) {
    return item.roles.includes(user.primaryRole ?? "artist");
  }

  return true;
}

export function getNavigationSections(user: SessionUser): NavigationSection[] {
  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canSeeItem(user, item)),
    }))
    .filter((section) => section.items.length > 0);
}

export function isNavigationItemActive(
  pathname: string,
  href: string,
  exact?: boolean,
) {
  if (exact) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
