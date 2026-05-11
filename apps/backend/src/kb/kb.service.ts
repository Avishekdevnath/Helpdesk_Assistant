import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKbDto } from './dto/create-kb.dto';
import { FromPostDto } from './dto/from-post.dto';
import { UpdateKbDto } from './dto/update-kb.dto';

@Injectable()
export class KbService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateKbDto) {
    return this.prisma.kbEntry.create({
      data: {
        title: dto.title,
        content: dto.content,
        tags: dto.tags,
        source: dto.source,
        sourceUrl: dto.sourceUrl,
        createdBy: dto.createdBy,
      },
    });
  }

  list() {
    return this.prisma.kbEntry.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    const entry = await this.prisma.kbEntry.findUnique({ where: { id } });
    if (!entry) throw new NotFoundException('KB entry not found');
    return entry;
  }

  search(q: string, take = 5) {
    return this.prisma.kbEntry.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  update(id: string, dto: UpdateKbDto) {
    return this.prisma.kbEntry.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.kbEntry.delete({ where: { id } });
  }

  async fromPost(dto: FromPostDto) {
    const kbEntry = await this.prisma.kbEntry.create({
      data: {
        title: dto.postTitle,
        content: `${dto.postBody}\n\nModerator reply:\n${dto.comment}`,
        tags: [],
        source: 'post_save',
        sourceUrl: dto.url,
        createdBy: dto.savedBy,
      },
    });

    const postSave = await this.prisma.postSave.create({
      data: {
        postTitle: dto.postTitle,
        postBody: dto.postBody,
        comment: dto.comment,
        url: dto.url,
        savedBy: dto.savedBy,
        kbEntryId: kbEntry.id,
      },
    });

    return { kbEntry, postSave };
  }
}
