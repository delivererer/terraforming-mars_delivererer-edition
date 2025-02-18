import {expect} from 'chai';
import {PowerGeneration} from '../../../src/server/cards/prelude/PowerGeneration';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';


describe('PowerGeneration', function() {
  it('Should play', function() {
    const card = new PowerGeneration();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
