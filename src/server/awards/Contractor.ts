import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Contractor implements IAward {
  public name: string = 'Contractor';
  public description: string = 'Having the most building tags in play';
  public getScore(player: Player): number {
    return player.tags.count(Tag.BUILDING, 'award');
  }
}
