import {expect} from 'chai';
import {PeroxidePower} from '../../../src/server/cards/base/PeroxidePower';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('PeroxidePower', function() {
  it('Should play', function() {
    const card = new PeroxidePower();
    const player = TestPlayer.BLUE.newPlayer();
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-1);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
  });
});
