import {expect} from 'chai';
import {LunaGovernor} from '../../../src/server/cards/colonies/LunaGovernor';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {Gyropolis} from '../../../src/server/cards/venusNext/Gyropolis';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {EarthEmbassy} from '../../../src/server/cards/moon/EarthEmbassy';
import {DeepLunarMining} from '../../../src/server/cards/moon/DeepLunarMining';

describe('Gyropolis', function() {
  let card: Gyropolis;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Gyropolis();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    const card1 = new ResearchNetwork();
    const card2 = new LunaGovernor();

    player.playedCards.push(card1, card2);
    player.addProduction(Resources.ENERGY, 2);
    expect(player.canPlayIgnoringCost(card)).is.true;
    const action = card.play(player) as SelectSpace;
    expect(action).is.not.undefined;
    expect(action.cb(action.availableSpaces[0])).is.undefined;
    expect(action.availableSpaces[0].player).to.eq(player);
    expect(action.availableSpaces[0].tile).is.not.undefined;
    expect(action.availableSpaces[0].tile!.tileType).to.eq(TileType.CITY);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });

  it('Compatible with Moon Embassy', function() {
    player.playedCards = [new DeepLunarMining()];
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(0);

    player.playedCards = [new EarthEmbassy()];
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);

    player.setProductionForTest({megacredits: 0});
    player.playedCards = [new DeepLunarMining(), new EarthEmbassy()];
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
