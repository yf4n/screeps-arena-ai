import { CARRY, ERR_NOT_IN_RANGE, MOVE, RESOURCE_ENERGY, WORK } from "game/constants"
import { getActiveSource, getHarvester, getSpawn } from "./helper.mjs"
import { CREEP_ROLE_HARVESTER } from "./constant.mjs"
import { addCreep, roleInQueneOrDelivering } from "./spawn_ctrl.mjs"

let harvestConfig = {
    max: 3,
    body: [ MOVE, CARRY, WORK ],
}
let mySwap = getSpawn(true)
export const initHarvester = (config) => {
    harvestConfig = Object.assign(harvestConfig, config)
}

export const runHarvester = () => {
    const hList = getHarvester()
    if (hList.length + roleInQueneOrDelivering(CREEP_ROLE_HARVESTER) < harvestConfig.max) {
        addCreep({
            role: CREEP_ROLE_HARVESTER,
            body: harvestConfig.body,
        })
    }

    const activeSources = getActiveSource()
    
    for (let i=0; i<hList.length; i++) {
        const c = hList[i]
        const source = c.findClosestByRange(activeSources)

        if (c.store.getFreeCapacity(RESOURCE_ENERGY)) {
            if(c.harvest(source) == ERR_NOT_IN_RANGE) {
                c.moveTo(source);
            }    
        } else {
            if (c.transfer(mySwap, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                c.moveTo(mySwap)
            }
        }
    }
}