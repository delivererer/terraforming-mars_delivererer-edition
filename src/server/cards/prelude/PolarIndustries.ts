import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class PolarIndustries extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POLAR_INDUSTRIES,
      tags: [Tag.BUILDING],
      productionBox: Units.of({heat: 2}),

      metadata: {
        cardNumber: 'P26',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.heat(2)).br;
          b.oceans(1);
        }),
        description: 'Increase your heat production 2 steps. Place an Ocean tile.',
      },
    });
  }
  public play(player: Player) {
    player.game.defer(new PlaceOceanTile(player));
    player.addProduction(Resources.HEAT, 2);
    return undefined;
  }
}
