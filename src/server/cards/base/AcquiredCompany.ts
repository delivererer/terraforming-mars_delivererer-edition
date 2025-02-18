import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class AcquiredCompany extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ACQUIRED_COMPANY,
      tags: [Tag.EARTH],
      cost: 10,

      metadata: {
        description: 'Increase your M€ production 3 steps.',
        cardNumber: '106',
        renderData: CardRenderer.builder((b) => b.production((pb) => pb.megacredits(3))),
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
