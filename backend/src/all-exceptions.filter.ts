import { Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    // Đảm bảo log lỗi được in ra console DÙ BẰNG CÁCH NÀO ĐI NỮA
    this.logger.error(`LỖI GLOBAL (CHẮC CHẮN CRASH): ${exception}`, exception instanceof Error ? exception.stack : 'No Stack Trace');

    // Nếu lỗi là HttpException (do NestJS ném ra), giữ nguyên mã trạng thái
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR; // Mặc định là 500

    response.status(status).json({
      statusCode: status,
      // Hiển thị thông báo lỗi chi tiết cho client (chỉ trong môi trường Dev)
      message: process.env.NODE_ENV !== 'production' 
                 ? (exception instanceof Error ? exception.message : 'Unknown Server Error') 
                 : 'Lỗi hệ thống nội bộ.',
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}