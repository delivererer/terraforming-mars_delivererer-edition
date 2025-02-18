import {expect} from 'chai';
import {MiningGuild} from '../../../src/server/cards/corporation/MiningGuild';
import {Game} from '../../../src/server/Game';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {SpaceType} from '../../../src/common/boards/SpaceType';
import {Phase} from '../../../src/common/Phase';
import {maxOutOceans, setCustomGameOptions, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {BoardType} from '../../../src/server/boards/BoardType';
import {TileType} from '../../../src/common/TileType';
import {OceanCity} from '../../../src/server/cards/ares/OceanCity';

describe('MiningGuild', () => {
  let card: MiningGuild;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new MiningGuild();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player, setCustomGameOptions({
      aresExtension: true,
      aresHazards: false,
    }));

    player.setCorporationForTest(card);
  });

  it('Should play', () => {
    card.play(player);
    expect(player.steel).to.eq(5);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });

  it('Gives steel production bonus when placing tiles', () => {
    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: []}, BoardType.MARS);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);

    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.STEEL, SpaceBonus.TITANIUM]}, BoardType.MARS);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.STEEL]}, BoardType.MARS);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);

    card.onTilePlaced(player, player, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.TITANIUM]}, BoardType.MARS);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(3);
  });

  it('Gives steel production bonus when placing ocean tile', () => {
    game.board.getSpaces(SpaceType.OCEAN, player).forEach((space) => {
      if (space.bonus.includes(SpaceBonus.TITANIUM) || space.bonus.includes(SpaceBonus.STEEL)) {
        game.addOceanTile(player, space.id);
      }
    });
    // There are two spaces on the main board that grant titanium or steel.
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });

  it('Does not give bonus when other players place tiles', () => {
    card.onTilePlaced(player, player2, {player, spaceType: SpaceType.LAND, x: 0, y: 0, id: 'foobar', bonus: [SpaceBonus.TITANIUM]}, BoardType.MARS);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Does not give bonus when other players place ocean tiles', () => {
    maxOutOceans(player2); // 1 ocean with titanium and 1 with steel
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Does not give bonus for WGT', () => {
    game.phase = Phase.SOLAR;
    maxOutOceans(player); // 1 ocean with titanium and 1 with steel
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(0);
  });

  it('Does not give bonus when overplacing', () => {
    const space = game.board.getSpaces(SpaceType.OCEAN, player).find((space) => space.bonus.includes(SpaceBonus.STEEL))!;
    game.addOceanTile(player, space.id);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);

    const oceanCity = new OceanCity();
    const selectSpace = oceanCity.play(player);
    selectSpace.cb(space);

    expect(space.tile?.tileType).equal(TileType.OCEAN_CITY);
    runAllActions(game);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
  });
});
