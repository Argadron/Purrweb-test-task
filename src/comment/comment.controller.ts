import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@decorators/auth.decorator';
import { SwaggerBadRequest, SwaggerCreated, SwaggerForbiddenException, SwaggerNoContent, SwaggerNotFound, SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';
import { JwtUser } from '../auth/interfaces';
import { User } from '@decorators/get-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comment')
@ApiTags("Comment controller")
@Auth()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: "Get all comments on card" })
  @ApiResponse({ description: "Comments getted", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiBearerAuth()
  @Get("/all/:id")
  async getAll(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.commentService.getAll(user.id, id)
  }

  @ApiOperation({ summary: "Get comment by id" })
  @ApiResponse({ description: "Comment getted", status: 200, type: SwaggerOK  })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your comment", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Comment not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Get("/id/:id")
  async getById(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.commentService.getById(user.id, id)
  }

  @ApiOperation({ summary: "Create new comment" })
  @ApiResponse({ description: "Comment created", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your card", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Card not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Post("/new")
  @UsePipes(new ValidationPipe())
  async create(@User() user: JwtUser, @Body() dto: CreateCommentDto) {
    return await this.commentService.create(user.id, dto)
  }

  @ApiOperation({ summary: "Update comment" })
  @ApiResponse({ description: "Comment updated", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your comment", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Comment not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @Put("/update/:id")
  @UsePipes(new ValidationPipe())
  async update(@User() user: JwtUser, @Body() dto: UpdateCommentDto, @Param("id", ParseIntPipe) id: number) {
    return await this.commentService.update(user.id, dto, id)
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({ description: "Comment deleted", status: 204, type: SwaggerNoContent })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @ApiResponse({ description: "This is not your comment", status: 403, type: SwaggerForbiddenException })
  @ApiResponse({ description: "Comment not found", status: 404, type: SwaggerNotFound })
  @ApiBearerAuth()
  @HttpCode(204)
  @Delete("/delete/:id")
  async delete(@User() user: JwtUser, @Param("id", ParseIntPipe) id: number) {
    return await this.commentService.delete(user.id, id)
  }
}
