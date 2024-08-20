import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { SwaggerOK } from '@swagger/apiResponse.interfaces';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';

@Controller('column')
@ApiTags("Columns controller")
@Auth()
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @ApiOperation({ summary: "Get user columns" })
  @ApiResponse({ description: "Columns getted", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: UnauthorizedException })
  @ApiBearerAuth()
  @Get("/all")
  async getColumns(@User() user: JwtUser) {
    return await this.columnService.getAll(user.id)
  }
}
