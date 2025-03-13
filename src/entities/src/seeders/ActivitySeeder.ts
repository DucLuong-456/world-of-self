import { ActivityType } from '@constants/activityType.enum';
import { Activity } from '@entities/Activity';
import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

interface IActivity {
  id: string;
  score: number;
  type: ActivityType;
}

export class ActivitySeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const activities: IActivity[] = [
      {
        id: 'c3038531-7a20-4442-9be5-bab64fa2f947',
        score: 10,
        type: ActivityType.CheckIn,
      },
      {
        id: '8e0a935b-175a-46d6-be3c-7dc58fce3bb1',
        score: 30,
        type: ActivityType.Post,
      },
    ];
    for (const activity of activities) {
      await em.upsert(Activity, activity, {
        onConflictAction: 'merge',
        onConflictFields: ['id'],
      });
    }
  }
}
