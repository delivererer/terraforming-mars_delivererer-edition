import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class TerraformingGanymede extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TERRAFORMING_GANYMEDE,
      tags: [Tag.JOVIAN, Tag.SPACE],
      cost: 33,
      victoryPoints: 2,
      tr: (player) => ({tr: 1 + player.tags.count(Tag.JOVIAN)}),

      metadata: {
        cardNumber: '197',
        renderData: CardRenderer.builder((b) => {
          b.tr(1).slash().jovian({played});
        }),
        description: 'Raise your TR 1 step for each Jovian tag you have, including this.',
      },
    });
  }
  public play(player: Player) {
    const steps = 1 + player.tags.count(Tag.JOVIAN);
    player.increaseTerraformRatingSteps(steps, {log: true});

    return undefined;
  }
}
