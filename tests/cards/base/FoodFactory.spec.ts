import {expect} from 'chai';
import {FoodFactory} from '../../../src/server/cards/base/FoodFactory';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';

describe('FoodFactory', function() {
  let card: FoodFactory;
  let player: TestPlayer;

  beforeEach(function() {
    card = new FoodFactory();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.PLANTS, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(4);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
