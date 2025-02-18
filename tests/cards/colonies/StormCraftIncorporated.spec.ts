import {expect} from 'chai';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import * as constants from '../../../src/common/constants';
import {Game} from '../../../src/server/Game';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {TestPlayer} from '../../TestPlayer';

describe('StormCraftIncorporated', function() {
  let card: StormCraftIncorporated;
  let player: TestPlayer;

  beforeEach(function() {
    card = new StormCraftIncorporated();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);

    player.setCorporationForTest(card);
  });

  it('Should play', function() {
    const play = card.play();
    expect(play).is.undefined;

    const action = card.action(player);
    expect(action).is.undefined;
    expect(card.resourceCount).to.eq(1);
  });

  it('Restricts amounts when converting heat', function() {
    player.heat = 10;
    card.resourceCount = 10;
    const options = card.spendHeat(player, constants.HEAT_FOR_TEMPERATURE);
    expect(options.options.length).to.eq(2);
    const heatOption = options.options[0] as SelectAmount;
    expect(heatOption.max).to.eq(constants.HEAT_FOR_TEMPERATURE);
    const floaterOption = options.options[1] as SelectAmount;
    expect(floaterOption.max).to.eq(constants.HEAT_FOR_TEMPERATURE / 2);
  });

  it('Validates inputs', function() {
    player.heat = 10;
    card.resourceCount = 10;
    const options = card.spendHeat(player, constants.HEAT_FOR_TEMPERATURE);
    const heatOption = options.options[0] as SelectAmount;
    const floaterOption = options.options[1] as SelectAmount;
    heatOption.cb(4);
    floaterOption.cb(0);
    expect(function() {
      options.cb();
    }).to.throw(`Need to pay ${constants.HEAT_FOR_TEMPERATURE} heat`);
  });

  it('Converts heat with floaters and heat', function() {
    player.heat = 10;
    card.resourceCount = 10;
    const options = card.spendHeat(player, constants.HEAT_FOR_TEMPERATURE);
    const heatOption = options.options[0] as SelectAmount;
    const floaterOption = options.options[1] as SelectAmount;
    heatOption.cb(2);
    floaterOption.cb(3);
    options.cb();
    expect(player.heat).to.eq(8);
    expect(card.resourceCount).to.eq(7);
  });
});
