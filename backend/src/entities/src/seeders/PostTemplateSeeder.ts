import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PostTemplate } from '../entities/PostTemplate';

export class PostTemplateSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const templates = [
      {
        name: 'Sunshine',
        bg_color: 'linear-gradient(135deg, #f5af19, #f12711)',
        text_color: '#ffffff',
        font_style: null,
      },
      {
        name: 'Ocean',
        bg_color: 'linear-gradient(135deg, #1cb5e0, #000046)',
        text_color: '#ffffff',
        font_style: null,
      },
      {
        name: 'Forest',
        bg_color: 'linear-gradient(135deg, #134e5e, #71b280)',
        text_color: '#ffffff',
        font_style: null,
      },
      {
        name: 'Midnight',
        bg_color: 'linear-gradient(135deg, #232526, #414345)',
        text_color: '#f0f0f0',
        font_style: 'italic',
      },
      {
        name: 'Lavender',
        bg_color: 'linear-gradient(135deg, #c471ed, #12c2e9)',
        text_color: '#ffffff',
        font_style: null,
      },
    ];

    for (const tpl of templates) {
      const existing = await em.findOne(PostTemplate, { name: tpl.name });
      if (!existing) {
        em.create(PostTemplate, tpl);
      }
    }

    await em.flush();
  }
}
