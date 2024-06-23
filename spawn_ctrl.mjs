import { CREEP_ROLE_HARVESTER } from "./constant.mjs"
import { getSpawn } from "./helper.mjs"
import { printLog } from "./log.mjs"
/**
 * {
 *   body: [],
 *   role: ""
 * }
 */
let workQueue = []
let delivering

export const initSpawn = () => {
    printLog("init spawn ctrl")
}

export const addCreep = (obj) => {
    workQueue.push(obj)
}

export const roleInQueneOrDelivering = (role) => {
    let num = 0
    if (delivering && delivering.role === role) {
        num+=1
    }
    num += workQueue.filter(c => c.role === role).length
    printLog(`${role} in queue and delivering: ${num}`)
    return num
}

export const runSpawn = () => {
    if (!delivering) {
        if (!workQueue.length) {
            return
        }
        delivering = workQueue.shift()
    }
    let c = getSpawn(true).spawnCreep(delivering.body).object
    if (c) {
        c.role = delivering.role
        delivering = undefined
    }
}

