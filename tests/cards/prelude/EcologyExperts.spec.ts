import {expect} from 'chai';
import {EcologyExperts} from '../../../src/server/cards/prelude/EcologyExperts';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('EcologyExperts', function() {
  let card: EcologyExperts;
  let player: Player;

  beforeEach(function() {
    card = new EcologyExperts();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Gets requirement bonus', function() {
    expect(card.getRequirementBonus(player)).to.eq(0);
    player.lastCardPlayed = card.name;
    expect(card.getRequirementBonus(player)).to.eq(50);
  });

  it('Should play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
