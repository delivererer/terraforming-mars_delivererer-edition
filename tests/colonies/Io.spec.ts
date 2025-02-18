import {expect} from 'chai';
import {Io} from '../../src/server/colonies/Io';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {Resources} from '../../src/common/Resources';
import {TestPlayer} from '../TestPlayer';
import {runAllActions} from '../TestingUtils';

describe('Io', function() {
  let io: Io;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    io = new Io();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(io);
  });

  it('Should build', function() {
    io.addColony(player);
    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
  });

  it('Should trade', function() {
    io.trade(player);
    expect(player.heat).to.eq(3);
    expect(player2.heat).to.eq(0);
  });

  it('Should give trade bonus', function() {
    io.addColony(player);

    io.trade(player2);
    runAllActions(game);

    expect(player.getProduction(Resources.HEAT)).to.eq(1);
    expect(player2.getProduction(Resources.HEAT)).to.eq(0);
    expect(player.heat).to.eq(2);
    expect(player2.heat).to.eq(3);
  });
});
