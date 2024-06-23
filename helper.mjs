import { Creep, Source, StructureSpawn } from "game/prototypes"
import { getObjectsByPrototype } from "game/utils"
import { CREEP_ROLE_ATTACKER, CREEP_ROLE_HARVESTER, CREEP_ROLE_HEAL, CREEP_ROLE_RANGED_ATTACKER } from "./constant.mjs"



export const getSpawn = (isMy) => getObjectsByPrototype(StructureSpawn).find(c => c.my === isMy)
export const getCreeps = (isMy) => getObjectsByPrototype(Creep).filter(c => c.my === isMy)
export const getActiveSource = () => getObjectsByPrototype(Source).filter(s => s.energy > 0)
export const getClosestActiveSource = (c) => c.findClosestByRange(c, getActiveSource()) 

export const getHarvester = () => getCreeps(true).filter(c => c.role == CREEP_ROLE_HARVESTER)
export const getAttacker = () => getCreeps(true).filter(c => c.role == CREEP_ROLE_ATTACKER)
export const getRangedAttacker = () => getCreeps(true).filter(c => c.role == CREEP_ROLE_RANGED_ATTACKER)
export const getHeal = () => getCreeps(true).filter(c => c.role == CREEP_ROLE_HEAL)