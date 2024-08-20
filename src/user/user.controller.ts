import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerOK, SwaggerUnauthorizedException } from '@swagger/apiResponse.interfaces';

@Controller('user')
@ApiTags("Users controller")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({ description: "Profile sended", status: 200, type: SwaggerOK })
  @ApiResponse({ description: "Token Invalid/Unauthorized", status: 401, type: SwaggerUnauthorizedException })
  @Get("/profile")
  async getProfile() {
    return 0
  }
}
