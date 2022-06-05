import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

import { SerializeInterceptor } from '../interceptors';

export const Serialize = <T>(dto: ClassConstructor<T>) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};
