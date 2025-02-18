import {expect} from 'chai';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Helion', function() {
  it('Should play', function() {
    const card = new Helion();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.HEAT)).to.eq(3);
    expect(player.canUseHeatAsMegaCredits).is.true;
  });
});
