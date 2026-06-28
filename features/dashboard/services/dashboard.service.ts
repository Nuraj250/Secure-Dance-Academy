import { AuthorizationError } from "@/lib/http/errors";
import type { SessionContext } from "@/types/auth";
import { DashboardRepository } from "@/features/dashboard/repositories/dashboard.repository";
import type { DashboardModel } from "@/features/dashboard/types";

export class DashboardService {
  constructor(private readonly dashboardRepository = new DashboardRepository()) {}

  async getDashboard(session: SessionContext): Promise<DashboardModel> {
    if (!session.user) {
      throw new AuthorizationError();
    }

    const role = session.user.primaryRole ?? "artist";

    switch (role) {
      case "administrator":
        return this.dashboardRepository.buildAdminDashboard(session.user);
      case "coach":
        return this.dashboardRepository.buildCoachDashboard(session.user);
      case "parent":
        return this.dashboardRepository.buildParentDashboard(session.user);
      case "artist":
      default:
        return this.dashboardRepository.buildArtistDashboard(session.user);
    }
  }
}

