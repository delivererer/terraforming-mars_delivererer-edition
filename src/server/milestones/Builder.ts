import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Builder implements IMilestone {
  public name: string = 'Builder';
  public description: string = 'Having at least 8 building tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.BUILDING, 'milestone');
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 8;
  }
}
