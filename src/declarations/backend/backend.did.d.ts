import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Building {
  'production' : Production,
  'level' : bigint,
  'buildingType' : string,
}
export interface GameState {
  'resources' : Resources,
  'buildings' : Array<Building>,
}
export interface Production {
  'gold' : bigint,
  'wood' : bigint,
  'stone' : bigint,
}
export interface Resources {
  'gold' : bigint,
  'wood' : bigint,
  'stone' : bigint,
}
export interface _SERVICE {
  'buildStructure' : ActorMethod<[string], undefined>,
  'getGameState' : ActorMethod<[], GameState>,
  'upgradeBuilding' : ActorMethod<[bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
