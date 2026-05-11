import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateKbDto } from './dto/create-kb.dto';
import { FromPostDto } from './dto/from-post.dto';
import { UpdateKbDto } from './dto/update-kb.dto';
import { KbService } from './kb.service';

@Controller('kb')
export class KbController {
  constructor(private readonly kb: KbService) {}

  @Get('search')
  search(@Query('q') q = '') {
    return this.kb.search(q);
  }

  @Get()
  list() {
    return this.kb.list();
  }

  @Post()
  create(@Body() dto: CreateKbDto) {
    return this.kb.create(dto);
  }

  @Post('from-post')
  fromPost(@Body() dto: FromPostDto) {
    return this.kb.fromPost(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKbDto) {
    return this.kb.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kb.remove(id);
  }
}
