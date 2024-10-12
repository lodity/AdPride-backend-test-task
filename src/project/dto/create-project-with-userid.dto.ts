import { CreateProjectDto } from './create-project.dto';

export interface CreateProjectWithUserIdDto extends CreateProjectDto {
  userId: number;
}
