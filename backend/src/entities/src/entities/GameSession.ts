import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { CustomBaseEntityWithDeletedAt } from './CustomBaseEntityWithDeletedAt';
import { User } from './User';

export enum GameSessionStatus {
  PLAYING = 'playing',
  COMPLETED = 'completed',
}

@Entity({ tableName: 'game_sessions' })
export class GameSession extends CustomBaseEntityWithDeletedAt {
  @Property({ type: 'uuid' })
  user_id: string;

  @Property({ type: 'varchar', default: 'memory_match' })
  game_type: string;

  @Property({ type: 'varchar', default: GameSessionStatus.PLAYING })
  status: GameSessionStatus;

  @ManyToOne({ entity: () => User, joinColumn: 'user_id', nullable: true })
  user?: User;
}
