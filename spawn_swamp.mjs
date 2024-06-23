import { initHarvester, runHarvester } from "./harvester_ctrl.mjs"
import { initSpawn, runSpawn } from "./spawn_ctrl.mjs"

let init

export default () => {
    if (!init) {
        initSpawn()
        initHarvester()
        init = true
    }
    runHarvester()
    runSpawn()
}