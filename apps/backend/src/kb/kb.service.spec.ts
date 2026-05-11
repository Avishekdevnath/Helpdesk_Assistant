import { KbService } from './kb.service';

describe('KbService', () => {
  const prisma = {
    kbEntry: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    postSave: {
      create: jest.fn(),
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('creates manual KB entries', async () => {
    prisma.kbEntry.create.mockResolvedValue({ id: 'kb1', title: 'Promises' });
    const service = new KbService(prisma as never);

    await service.create({
      title: 'Promises',
      content: 'Use then/catch or async/await.',
      tags: ['js'],
      source: 'manual',
      createdBy: 'mod',
    });

    expect(prisma.kbEntry.create).toHaveBeenCalledWith({
      data: {
        title: 'Promises',
        content: 'Use then/catch or async/await.',
        tags: ['js'],
        source: 'manual',
        sourceUrl: undefined,
        createdBy: 'mod',
      },
    });
  });

  it('searches title, content, and tags case-insensitively', async () => {
    const service = new KbService(prisma as never);
    await service.search('promise', 3);

    expect(prisma.kbEntry.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: 'promise', mode: 'insensitive' } },
          { content: { contains: 'promise', mode: 'insensitive' } },
          { tags: { has: 'promise' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  });
});
