import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {TitanFloatingLaunchPad} from '../../../src/server/cards/colonies/TitanFloatingLaunchPad';
import {TitanShuttles} from '../../../src/server/cards/colonies/TitanShuttles';
import {ICard} from '../../../src/server/cards/ICard';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('TitanShuttles', function() {
  let card: TitanShuttles;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new TitanShuttles();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);

    player.playedCards.push(card);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('Can act', function() {
    expect(card.canAct()).is.true;
  });

  it('Gives VP', function() {
    expect(card.getVictoryPoints()).to.eq(1);
  });

  it('Auto add floaters if only 1 option and 1 target available', function() {
    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;
    expect(card.resourceCount).to.eq(2);
  });

  it('Can select target if multiple Jovian floater cards available', function() {
    const card2 = new TitanFloatingLaunchPad();
    player.playedCards.push(card2);

    card.action(player);
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([card]);
    expect(card.resourceCount).to.eq(2);
  });

  it('Both actions available', function() {
    const card2 = new TitanFloatingLaunchPad();
    player.playedCards.push(card2);
    player.addResourceTo(card, 7);

    const orOptions = cast(card.action(player), OrOptions);
    expect(orOptions.options).has.lengthOf(2);

    // spend floaters to gain titanium
    orOptions.options[1].cb(6);
    expect(card.resourceCount).to.eq(1);
    expect(player.titanium).to.eq(6);

    // add 2 floaters to Jovian card
    orOptions.options[0].cb();
    expect(game.deferredActions).has.lengthOf(1);

    const selectCard = game.deferredActions.peek()!.execute() as SelectCard<ICard>;
    selectCard.cb([card2]);
    expect(card2.resourceCount).to.eq(2);
  });
});
