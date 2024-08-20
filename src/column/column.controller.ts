import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('column')
@ApiTags("Columns controller")
@Auth()
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @ApiOperation({ summary: "Get user columns" })
  @ApiResponse({ description: "Columns getted", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  @Get("/all")
  async getColumns(@User() user: JwtUser) {
    return await this.columnService.getAll(user.id)
  }

  @ApiOperation({ summary: "Get column by id" })
  @ApiResponse({ description: "Column getted", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your column", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Column not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Get("/id/:id")
  async getById(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.columnService.getById(user.id, id)
  }

  @ApiOperation({ summary: "Create new column" })
  @ApiResponse({ description: "Column created", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your column", status: 403, type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Post("/new")
  async create(@User() user: JwtUser, @Body() dto: CreateColumnDto) {
    return await this.columnService.create(user.id, dto)
  }

  @ApiOperation({ summary: "Update column" })
  @ApiResponse({ description: "Column updated", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your column", status: 403, type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Put("/update/:id")
  async update(@User() user: JwtUser, @Body() dto: UpdateColumnDto, @Param("id", ParseIntPipe) id: number) {
    return await this.columnService.update(user.id, dto, id)
  }

  @ApiOperation({ summary: "Delete column" })
  @ApiResponse({ description: "Column deleted", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your column", status: 403, type: SwaggerForbiddenException })
  @ApiBearerAuth()
  @HttpCode(204)
  @Delete("/delete/:id")
  async delete(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.columnService.delete(user.id, id)
  }
}
