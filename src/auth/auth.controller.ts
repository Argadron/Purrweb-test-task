import { Body, Controller, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerBadRequest, SwaggerConflictMessage, SwaggerCreated } from '@swagger/apiResponse.interfaces';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags("Auth controller")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register new user" })
  @ApiResponse({ description: "User registred", status: 201, type: SwaggerCreated })
  @ApiResponse({ description: "Validation failed", status: 400, type: SwaggerBadRequest })
  @ApiResponse({ description: "Email conflict", status: 409, type: SwaggerConflictMessage })
  @UsePipes(new ValidationPipe())
  @Post("/register")
  async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return await this.authService.register(dto, res)
  }
}
