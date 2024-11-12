export const idlFactory = ({ IDL }) => {
  const Resources = IDL.Record({
    'gold' : IDL.Nat,
    'wood' : IDL.Nat,
    'stone' : IDL.Nat,
  });
  const Production = IDL.Record({
    'gold' : IDL.Nat,
    'wood' : IDL.Nat,
    'stone' : IDL.Nat,
  });
  const Building = IDL.Record({
    'production' : Production,
    'level' : IDL.Nat,
    'buildingType' : IDL.Text,
  });
  const GameState = IDL.Record({
    'resources' : Resources,
    'buildings' : IDL.Vec(Building),
  });
  return IDL.Service({
    'buildStructure' : IDL.Func([IDL.Text], [], []),
    'getGameState' : IDL.Func([], [GameState], ['query']),
    'upgradeBuilding' : IDL.Func([IDL.Nat], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
