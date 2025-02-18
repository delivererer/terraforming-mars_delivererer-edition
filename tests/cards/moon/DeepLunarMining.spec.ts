import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {DeepLunarMining} from '../../../src/server/cards/moon/DeepLunarMining';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('DeepLunarMining', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: DeepLunarMining;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new DeepLunarMining();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.getProduction(Resources.TITANIUM)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.getProduction(Resources.TITANIUM)).eq(2);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);
  });
});

