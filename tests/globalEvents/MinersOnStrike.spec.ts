import {expect} from 'chai';
import {MethaneFromTitan} from '../../src/server/cards/base/MethaneFromTitan';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {MinersOnStrike} from '../../src/server/turmoil/globalEvents/MinersOnStrike';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('MinersOnStrike', function() {
  it('resolve play', function() {
    const card = new MinersOnStrike();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);
    turmoil.initGlobalEvent(game);
    player.addResource(Resources.TITANIUM, 5);
    player2.addResource(Resources.TITANIUM, 5);
    player.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    player2.playedCards.push(new MethaneFromTitan());
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    card.resolve(game, turmoil);
    expect(player.getResource(Resources.TITANIUM)).to.eq(4);
    expect(player2.getResource(Resources.TITANIUM)).to.eq(5);
  });
});
