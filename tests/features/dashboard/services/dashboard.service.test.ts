import { AuthorizationError } from "@/lib/http/errors";
import { DashboardService } from "@/features/dashboard/services/dashboard.service";
import type { DashboardModel } from "@/features/dashboard/types";
import type { SessionContext, SessionUser } from "@/types/auth";

type DashboardRepositoryMock = {
  buildAdminDashboard: jest.Mock;
  buildCoachDashboard: jest.Mock;
  buildParentDashboard: jest.Mock;
  buildArtistDashboard: jest.Mock;
};

function createUser(role: SessionUser["primaryRole"]): SessionUser {
  return {
    id: "user-1",
    supabaseUserId: "supabase-user-1",
    email: "user@example.com",
    firstName: "User",
    lastName: "Example",
    displayName: "User Example",
    phone: null,
    status: "active",
    locale: null,
    timezone: null,
    roles: [role ?? "artist"],
    primaryRole: role,
    permissions: [],
    lastLoginAt: null,
    version: 1,
  };
}

function createModel(role: DashboardModel["role"]): DashboardModel {
  return {
    role,
    title: `${role} dashboard`,
    description: "Dashboard",
    primaryAction: { label: "Primary", href: "/dashboard" },
    secondaryActions: [],
    metrics: [],
    lists: [],
    tables: [],
  };
}

describe("DashboardService", () => {
  it("routes administrators to the admin dashboard", async () => {
    const dashboardRepository = {
      buildAdminDashboard: jest.fn().mockResolvedValue(createModel("administrator")),
      buildCoachDashboard: jest.fn(),
      buildParentDashboard: jest.fn(),
      buildArtistDashboard: jest.fn(),
    } as unknown as DashboardRepositoryMock;

    const service = new DashboardService(dashboardRepository as never);
    const result = await service.getDashboard({
      requestId: "request-1",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: null,
      user: createUser("administrator"),
      isAuthenticated: true,
    });

    expect(dashboardRepository.buildAdminDashboard).toHaveBeenCalledTimes(1);
    expect(result.role).toBe("administrator");
  });

  it("routes coaches and parents to the correct dashboards", async () => {
    const dashboardRepository = {
      buildAdminDashboard: jest.fn(),
      buildCoachDashboard: jest.fn().mockResolvedValue(createModel("coach")),
      buildParentDashboard: jest.fn().mockResolvedValue(createModel("parent")),
      buildArtistDashboard: jest.fn().mockResolvedValue(createModel("artist")),
    } as unknown as DashboardRepositoryMock;

    const service = new DashboardService(dashboardRepository as never);

    await service.getDashboard({
      requestId: "request-2",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: null,
      user: createUser("coach"),
      isAuthenticated: true,
    });

    await service.getDashboard({
      requestId: "request-3",
      ipAddress: "127.0.0.1",
      userAgent: "jest",
      origin: "http://localhost:3000",
      supabaseIdentity: null,
      user: createUser("parent"),
      isAuthenticated: true,
    });

    expect(dashboardRepository.buildCoachDashboard).toHaveBeenCalledTimes(1);
    expect(dashboardRepository.buildParentDashboard).toHaveBeenCalledTimes(1);
  });

  it("rejects unauthenticated dashboard access", async () => {
    const service = new DashboardService({
      buildAdminDashboard: jest.fn(),
      buildCoachDashboard: jest.fn(),
      buildParentDashboard: jest.fn(),
      buildArtistDashboard: jest.fn(),
    } as never);

    await expect(
      service.getDashboard({
        requestId: "request-4",
        ipAddress: null,
        userAgent: null,
        origin: null,
        supabaseIdentity: null,
        user: null,
        isAuthenticated: false,
      } as SessionContext),
    ).rejects.toBeInstanceOf(AuthorizationError);
  });
});
