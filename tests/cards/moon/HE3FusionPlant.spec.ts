import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {HE3FusionPlant} from '../../../src/server/cards/moon/HE3FusionPlant';
import {Resources} from '../../../src/common/Resources';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('HE3FusionPlant', () => {
  let player: TestPlayer;
  let card: HE3FusionPlant;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new HE3FusionPlant();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.miningRate = 2;
    expect(player.getPlayableCards()).does.include(card);

    moonData.miningRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.setProductionForTest({energy: 0});
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    player.setProductionForTest({energy: 0});
    moonData.moon.getSpace('m06')!.tile = {tileType: TileType.MOON_MINE};
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(1);

    player.setProductionForTest({energy: 0});
    moonData.moon.getSpace('m07')!.tile = {tileType: TileType.MOON_MINE};
    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });
});

