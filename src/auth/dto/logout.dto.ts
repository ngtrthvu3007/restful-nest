//src/auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
