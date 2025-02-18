import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {played} from '../Options';

export class WarpDrive extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 14,
      tags: [Tag.SCIENCE],
      name: CardName.WARP_DRIVE,
      cardType: CardType.ACTIVE,
      victoryPoints: 2,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 5)),
      cardDiscount: {tag: Tag.SPACE, amount: 4},
      metadata: {
        cardNumber: 'C49',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 4 M€ less for it.', (eb) => {
            eb.space({played}).startEffect.megacredits(-4);
          });
        }),
        description: 'Requires 5 Science tags.',
      },
    });
  }

  public play() {
    return undefined;
  }
}
