import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CardService } from './card.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { User } from '@decorators/get-user.decorator';
import { JwtUser } from '../auth/interfaces';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { OptionalValidatorPipe } from '@pipes/optional-validator.pipe';
import { ExcessPlantsValidatorPipe } from '@pipes/excess-plants-validator.pipe';

@Controller('card')
@ApiTags("Cards controller")
@Auth()
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({ summary: "Get all cards" })
  @ApiResponse({ description: "Cards getted", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  @Get("/all/:id")
  async getAll(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.cardService.getAll(user.id, id)
  }

  @ApiOperation({ summary: "Get card by id" })
  @ApiResponse({ description: "Card getted", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your card", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Card not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Get("/id/:id")
  async getById(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.cardService.getById(user.id, id)
  }

  @ApiOperation({ summary: "Create new card" })
  @ApiResponse({ description: "Card created", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your column", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Column not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Post("/new")
  async create(@User() user: JwtUser, @Body() dto: CreateCardDto) {
    return await this.cardService.create(user.id, dto)
  }

  @ApiOperation({ summary: "Update card" })
  @ApiResponse({ description: "Card updated", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your card", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Card not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe(), new OptionalValidatorPipe().check(["description", "header", "status"]),
  new ExcessPlantsValidatorPipe().setType(UpdateCardDto))
  @Put("/update/:id")
  async update(@User() user: JwtUser, @Body() dto: UpdateCardDto, @Param("id", ParseIntPipe) id: number) {
    return await this.cardService.update(user.id, dto, id)
  }

  @ApiOperation({ summary: "Delete card" })
  @ApiResponse({ description: "Card deleted", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "Token invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your card", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Card not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @HttpCode(204)
  @Delete("/delete/:id")
  async delete(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.cardService.delete(user.id, id)
  }
}
