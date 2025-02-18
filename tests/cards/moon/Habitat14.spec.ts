import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Habitat14} from '../../../src/server/cards/moon/Habitat14';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonColonyTile} from '../../../src/server/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('Habitat14', () => {
  let player: TestPlayer;
  let card: Habitat14;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new Habitat14();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    player.setProductionForTest({megacredits: -4, energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.setProductionForTest({megacredits: -5, energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.setProductionForTest({megacredits: -4, energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.setProductionForTest({megacredits: -4, energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    player.setProductionForTest({megacredits: 1, energy: 1});
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonColonyTile);
  });
});

