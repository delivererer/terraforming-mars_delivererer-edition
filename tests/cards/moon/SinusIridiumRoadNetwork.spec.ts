import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SinusIridiumRoadNetwork} from '../../../src/server/cards/moon/SinusIridiumRoadNetwork';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonRoadTile} from '../../../src/server/moon/PlaceMoonRoadTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('SinusIridiumRoadNetwork', () => {
  let player: TestPlayer;
  let card: SinusIridiumRoadNetwork;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new SinusIridiumRoadNetwork();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.steel = 0;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.steel = 1;
    player.setProductionForTest({energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);


    player.steel = 1;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.steel = 2;
    player.setProductionForTest({energy: 1});
    player.steel = 1;
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

    card.play(player);

    expect(player.steel).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(3);

    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonRoadTile);
  });
});

