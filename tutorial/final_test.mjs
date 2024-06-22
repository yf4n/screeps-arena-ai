import { ATTACK, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT, CARRY, ERR_NOT_IN_RANGE, HEAL, LEFT, MOVE, RANGED_ATTACK, RESOURCE_ENERGY, RIGHT, TOP, TOP_LEFT, TOP_RIGHT, TOUGH, WORK } from 'game/constants'
import { getDirection, getObjectsByPrototype, getRange } from 'game/utils'
import { Creep, Source, StructureSpawn, StructureWall } from 'game/prototypes'

export default () => {
    // 生产采集者
    const my = getMyCreeps()
    const spawn = getSpawn()
    
    // 采矿
    const harvester = my.filter(c => c.role == 'harvester')
    harvesterHandler(harvester, spawn)
    if (harvester.length < 2) {
        const c = spawn.spawnCreep([WORK, CARRY, MOVE]).object
        if (c) {
            c.role = 'harvester'
        }
        return
    }

    // 生产小队，1近战，2远程，1治疗
    const attacker = my.filter(c => c.role == 'attacker')
    if (attacker.length < 1) {
        const c = spawn.spawnCreep([MOVE, ATTACK]).object
        if (c) {
            c.role = 'attacker'
        }
    }
    const rangeAttacker = my.filter(c => c.role == 'rangeattacker')
    if (rangeAttacker.length < 2) {
        const c = spawn.spawnCreep([MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK]).object
        if (c) {
            c.role = 'rangeattacker'
        }
    }
    // const heal = my.filter(c => c.role == 'heal')
    // if (heal.length < 1) {
    //     const c = spawn.spawnCreep([MOVE, HEAL]).object
    //     if (c) {
    //         c.role = 'heal'
    //     }
    // }

    squadsRun(my)
    // 集合部队
    // 1近战，2远程，1治疗

    // 进攻
}

const squadsRun = (my) => {
    const enemys = getEnemyCreeps()
    
    my.filter(c => c.role == 'heal' || c.role == 'rangeattacker' || c.role == 'attacker').forEach(c => {
        const enemy = c.findClosestByRange(enemys)
        let err 
        switch(c.role) {
            case 'attacker':
                err = c.attack(enemy)
            case 'rangeattacker':
                err = c.rangedAttack(enemy)
                if (getRange(c, enemy) < 3) {
                    const d = getDirection(enemy.x, enemy.y)
                    movePolicy[d](c)                    
                }
            case 'heal':
                // err = c.heal()
        }
        
        if (err == ERR_NOT_IN_RANGE) {
            const walls = getObjectsByPrototype(StructureWall)
            const wall = c.findClosestByRange(walls)
            switch(c.role) {
                case 'attacker':
                    c.attack(wall)
                case 'rangeattacker':
                    c.rangedAttack(wall)
                case 'heal':
                    // err = c.heal()
            }
            c.moveTo(enemy)
        }

    })

}

const movePolicy = {
    TOP: c => c.moveTo(BOTTOM),
    TOP_RIGHT: c=> c.moveTo(BOTTOM_LEFT),
    TOP_LEFT: c => c.moveTo(BOTTOM_RIGHT),
    BOTTOM: c=>c.moveTo(TOP),
    BOTTOM_RIGHT: c => c.moveTo(TOP_LEFT),
    BOTTOM_LEFT: c => c.moveTo(TOP_RIGHT),
    RIGHT: c => c.moveTo(LEFT),
    LEFT: c=>c.moveTo(RIGHT),
}

const harvesterHandler = (harvesterScreep, spawn) => {
    const activeSources = getActiveSource()
   
    for (let i=0;i<harvesterScreep.length;i++) {
        const c = harvesterScreep[i]
        const source = c.findClosestByRange(activeSources)

        if (c.store.getFreeCapacity(RESOURCE_ENERGY)) {
            if(c.harvest(source) == ERR_NOT_IN_RANGE) {
                c.moveTo(source);
            }    
        } else {
            if (c.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                c.moveTo(spawn)
            }
        }
    }
}

const getSpawn = () => getObjectsByPrototype(StructureSpawn).find(c => c.my)

const getMyCreeps = () => getObjectsByPrototype(Creep).filter(c => c.my)

const getEnemyCreeps = () => getObjectsByPrototype(Creep).filter(c => !c.my)

const getActiveSource = () => getObjectsByPrototype(Source).filter(s => s.energy > 0)




