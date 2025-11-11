import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter'; // <-- Import filter

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Đặt prefix cho tất cả các route
  app.setGlobalPrefix('api'); 

  // --- ĐĂNG KÝ GLOBAL EXCEPTION FILTER (QUAN TRỌNG) ---
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // --------------------------------------------------------

  await app.listen(3000, () => {
    console.log(`Backend API is running on: http://localhost:3001/api`);
  });
}
bootstrap();