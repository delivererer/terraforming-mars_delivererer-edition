import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {ICard} from '../ICard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {Units} from '../../../common/Units';
import {played} from '../Options';

export class RoboticWorkforce extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tag.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', Size.SMALL, true).nbsp;
          b.production((pb) => pb.building(1, {played}));
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return this.getAvailableCards(player).length > 0;
  }

  private isCardApplicable(card: ICard, player: Player): boolean {
    if (!card.tags.includes(Tag.BUILDING) && !card.tags.includes(Tag.WILD)) {
      return false;
    }
    if (card.name === CardName.BIOMASS_COMBUSTORS) {
      return player.canReduceAnyProduction(Resources.PLANTS, 1);
    } else if (card.name === CardName.HEAT_TRAPPERS) {
      return player.canReduceAnyProduction(Resources.HEAT, 2);
    } else if (card.name === CardName.GYROPOLIS) {
      return player.getProduction(Resources.ENERGY) >= 2;
    } else if (card.name === CardName.SPECIALIZED_SETTLEMENT) {
      return player.getProduction(Resources.ENERGY) >= 1;
    }

    if (card.produce !== undefined) return true;

    if (card.productionBox === undefined || card.productionBox === Units.EMPTY) return false;

    return player.canAdjustProduction(card.productionBox);
  }

  private getAvailableCards(player: Player): Array<ICard> {
    return [
      ...player.playedCards.filter((card) => this.isCardApplicable(card, player)),
      ...player.corporations.filter((card) => this.isCardApplicable(card, player)),
    ];
  }

  public play(player: Player) {
    const availableCards = this.getAvailableCards(player);

    if (availableCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select builder card to copy', 'Copy', availableCards, ([card]) => {
      player.game.log('${0} copied ${1} production with ${2}', (b) =>
        b.player(player).card(card).card(this));

      if (card.produce) {
        card.produce(player);
      } else if (card.productionBox) {
        player.adjustProduction(card.productionBox);
      } else {
        throw new Error(`Card ${card.name} is not a valid Robotic Workforce card.`);
      }
      return undefined;
    });
  }
}
