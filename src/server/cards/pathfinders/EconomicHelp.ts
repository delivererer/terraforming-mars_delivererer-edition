import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {PathfindersExpansion, PlanetaryTag, TRACKS} from '../../pathfinders/PathfindersExpansion';
import {Tag} from '../../../common/cards/Tag';
import {Size} from '../../../common/cards/render/Size';
import {played} from '../Options';
import {PathfindersData} from '../../pathfinders/PathfindersData';

export class EconomicHelp extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.ECONOMIC_HELP,
      cost: 9,

      metadata: {
        cardNumber: 'Pf42',
        renderData: CardRenderer.builder((b) => {
          b.planetaryTrack().text('3').or().text('2')
            .venus(1, {played}).or(Size.SMALL)
            .earth(1, {played}).or(Size.SMALL).br;
          b.mars(1, {played}).or(Size.SMALL)
            .jovian({amount: 1, played}).or(Size.SMALL)
            .moon(1, {played}).br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Raise the lowest non-completed planetary influence track 3 steps. When tied, raise all lowest tracks 2 steps. ' +
         'Increase your M€ production 1 step',
      },
    });
  }

  private trackOffset(tag: PlanetaryTag, data: PathfindersData): number {
    const value = data[tag];
    return TRACKS[tag].spaces.length === value ? -1 : value;
  }
  public play(player: Player) {
    const data = player.game.pathfindersData;
    if (data === undefined) {
      return undefined;
    }
    const values = [
      this.trackOffset(Tag.EARTH, data),
      this.trackOffset(Tag.JOVIAN, data),
      this.trackOffset(Tag.MARS, data),
    ];
    if (player.game.gameOptions.moonExpansion === true) values.push(this.trackOffset(Tag.MOON, data));
    if (player.game.gameOptions.venusNextExtension === true) values.push(this.trackOffset(Tag.VENUS, data));
    // Filter any maximized track.
    // Filter out -1.
    const lowest = Math.min(...(values.filter((v) => v >= 0)));
    const count = values.filter((v) => v === lowest).length;
    const increment = (count === 1) ? 3 : 2;
    if (data.earth === lowest) PathfindersExpansion.raiseTrack(Tag.EARTH, player, increment);
    if (data.jovian === lowest) PathfindersExpansion.raiseTrack(Tag.JOVIAN, player, increment);
    if (data.mars === lowest) PathfindersExpansion.raiseTrack(Tag.MARS, player, increment);
    if (data.moon === lowest && player.game.gameOptions.moonExpansion === true) PathfindersExpansion.raiseTrack(Tag.MOON, player, increment);
    if (data.venus === lowest && player.game.gameOptions.venusNextExtension === true) PathfindersExpansion.raiseTrack(Tag.VENUS, player, increment);
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }
}
