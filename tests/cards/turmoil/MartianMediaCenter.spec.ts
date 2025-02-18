import {expect} from 'chai';
import {MartianMediaCenter} from '../../../src/server/cards/turmoil/MartianMediaCenter';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('MartianMediaCenter', function() {
  it('Should play', function() {
    const card = new MartianMediaCenter();
    const player = TestPlayer.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = Game.newInstance('gameid', [player], player, gameOptions);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    const mars = game.turmoil!.getPartyByName(PartyName.MARS)!;
    mars.delegates.push(player.id, player.id);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });
});
