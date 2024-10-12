import { ProjectStatus } from '@prisma/client';

export type UpdateProjectDto = Partial<{
  name: string;
  url: string;
  status: ProjectStatus;
  expiredAt: Date;
}>;
