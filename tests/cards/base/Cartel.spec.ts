import {expect} from 'chai';
import {Cartel} from '../../../src/server/cards/base/Cartel';
import {ImportedHydrogen} from '../../../src/server/cards/base/ImportedHydrogen';
import {InterstellarColonyShip} from '../../../src/server/cards/base/InterstellarColonyShip';
import {LunarBeam} from '../../../src/server/cards/base/LunarBeam';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('Cartel', function() {
  let card: Cartel;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new Cartel();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    player.game = game;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    player.playedCards.push(card);

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });

  it('Correctly counts tags', function() {
    const cards = [
      new ImportedHydrogen(), // event with earth tag
      new InterstellarColonyShip(), // event with earth tag
      new LunarBeam(), // another card with earth tag
    ];

    player.playedCards = player.playedCards.concat(cards);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2); // exclude events
  });
});
