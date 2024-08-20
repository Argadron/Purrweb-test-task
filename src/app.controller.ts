import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerOK } from '@swagger/apiResponse.interfaces';

@Controller()
@ApiTags("Test server work controller")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/test")
  @ApiOperation({ summary: "Test server work" })
  @ApiResponse({ description: "Server worked", status: 200, type: SwaggerOK })
  getHello(): string {
    return this.appService.getHello();
  }
}
