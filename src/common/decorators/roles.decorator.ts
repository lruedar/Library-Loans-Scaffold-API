/* eslint-disable prettier/prettier */
import { UserRole } from '@modules/users/user.entity/user.entity';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRole[]): MethodDecorator & ClassDecorator =>
  SetMetadata(ROLES_KEY, roles);
