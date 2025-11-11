import { SetMetadata } from '@nestjs/common';

// Định nghĩa các Role có thể có
export type Role = 'user' | 'staff' | 'admin';

// Decorator này dùng để đính kèm metadata 'roles' vào route
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);