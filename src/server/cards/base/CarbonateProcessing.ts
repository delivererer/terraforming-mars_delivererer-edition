
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class CarbonateProcessing extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.CARBONATE_PROCESSING,
      tags: [Tag.BUILDING],
      cost: 6,
      productionBox: Units.of({energy: -1, heat: 3}),

      metadata: {
        cardNumber: '043',
        description: 'Decrease your Energy production 1 step and increase your heat production 3 steps.',
        renderData: CardRenderer.builder((b) => b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().heat(3);
        })),
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.HEAT, 3);
    return undefined;
  }
}
