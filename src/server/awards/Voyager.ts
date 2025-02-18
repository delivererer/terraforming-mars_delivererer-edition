import {IAward} from './IAward';
import {Player} from '../Player';
import {Tag} from '../../common/cards/Tag';

export class Voyager implements IAward {
  public name: string = 'Voyager';
  public description: string = 'Having the most Jovian tags in play';

  public getScore(player: Player): number {
    return player.tags.count(Tag.JOVIAN, 'award');
  }
}
