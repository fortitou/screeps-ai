/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('core.spawn');
 * mod.thing == 'a thing'; // true
 */

var coreSpawn = {
    roles: {
        builder:  'worker',
        harvester: 'worker',
        repairer: 'worker',
        upgrader: 'worker',
        archer: 'archer',
        claimer: 'claimer',
        soldier: 'soldier'
    },
    BodyParts: {
        worker:  {WORK: 3, CARRY: 6, MOVE: 6},
        soldier: {ATTACK: 4, TOUGH: 1, MOVE: 6},
        archer:  {MOVE: 6},
    },
    warriorNumber: {soldier: 4, archer: 2},
    // TODO : dynamic lists
    // var worker_list = [['harvester', 7], ['builder', 4], ['repairer', 4], ['upgrader', 4]];
    run: function() {
        for(let i in Game.spawns) {
            let spawn = Game.spawns[i];
            if (spawn.spawning) {
                console.log(spawn + ' is already spawning creep ' + spawn.spawning)
                break;
            }
            let result = OK;
            result = this.workers(spawn, [['harvester', 6], ['builder', 2], ['repairer', 2], ['upgrader', 2], ['towerer', 1]]);
            if (result == OK) {
                result = this.workers(spawn, [['harvester', 7], ['builder', 4], ['repairer', 5], ['upgrader', 4], ['towerer', 1]]);
            }
            if (result == OK) {
                this.soldier(spawn, 'soldier', 2);
            }
        }
    },
    getExtensions: function(spawn) {
        let extensions = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        return extensions;
    },
    getFamily: function(role){
        return OK;
    },
    isEnoughSpawnExtensions: function(maxEnergy, bodyParts) {
        let en = 0;
        for(part of bodyParts){
            en += BODYPART_COST[part];
        }
        console.log('energy: ' + en);
        return (maxEnergy > en);
    },
    maxEnergy: function(extentions){
        return 300 + 4 * extensions;
    },
    spawnCreep: function(spawn, role) {
        let ext = this.getExtensions(spawn).length;
        let max_energy = 300 + 4*ext;
        let bodyParts = [];
        let res = null;
        let i=0;
        console.log('spawning new creep');
        switch(role){
            case 'worker':
                for (i=0; i < 1+(ext/3); i++) {
                    body_parts.push(WORK);
                }
                for (i=0; i < 1+(ext/6); i++) {
                    body_parts.push(CARRY);
                }
                for (i=0; i < 1+(ext/6); i++) {
                    body_parts.push(MOVE);
                }
                break;
            case 'soldier':
                for (i=0; i < 1 + ext/4; i++){
                    body_parts.push(ATTACK);
                }
                for (i=0; i < 2 + ext/2; i++){
                    body_parts.push(TOUGH);
                }
                for (i=0; i < 1 + ext/4; i++){
                    body_parts.push(MOVE);
                }
                break;
            case 'archer':
                break;
            case 'claimer':
                break;
            default:
                return ERR_NOT_FOUND;
        }
        if (!isEnoughSpawnExtensions(max_energy, bodyParts)){
            console.log(spawn + 'cannot spawn creep with body ' + bodyParts + ' : not enough energy available. extensions: ' + ext)
        }
        var newName = spawn.createCreep(bodyParts, undefined, {role: role, family: 'worker'});
        switch(newName) {
            case -6:
                console.log('Spawning of new creep (' + role + ') : delayed (short ressources)');
                break;
            case -4:
                console.log('Spawning of new creep (' + role + ') : delayed (spawn active)');
                break;
            default:
                console.log('Spawning new creep: ' + newName + '(' + role + ')');
                break;
        }
        return OK;
    },

    workers: function(spawn, role_list) {
        // console.log('role_list: ' + role_list );

        for(let i in role_list) {
            // console.log('role: ' + role );

            var role = role_list[i][0];
            var number = role_list[i][1];

            // console.log(creep_type + '(' + creep_number + ')' + ': ' + creep_current.length);

            if(this.worker(spawn, role, number) == 1) {
                return 1;
                break;
            }
        }
        return OK;
    },
    worker: function(spawn, role, requested_number) {
        var current = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        var extensions = this.getExtensions(spawn).length;
        if(current.length >= requested_number) {
            return OK;
        } else {
            switch(extensions) {
                case 0:
                    var newName = spawn.createCreep([WORK,CARRY,MOVE], undefined, {role: role, family: 'worker'});
                    break;
                case 1:
                    var newName = spawn.createCreep([WORK,CARRY,MOVE,MOVE], undefined, {role: role, family: 'worker'});
                    break;
                case 2:
                    var newName = spawn.createCreep([WORK,WORK,CARRY,MOVE], undefined, {role: role, family: 'worker'});
                    break;
                case 3:
                    var newName = spawn.createCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: role, family: 'worker'});
                    break;
                case 4:
                    var newName = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: role, family: 'worker'});
                    break;
                case 5:
                    var newName = spawn.createCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: role, family: 'worker'});
                    break;
                default:
                    var newName = spawn.createCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], undefined, {role: role, family: 'worker'});
                    break;
            }
            switch(newName) {
                case -6:
                    console.log('Spawning of new creep (' + role + ') : delayed (short ressources)');
                    break;
                case -4:
                    console.log('Spawning of new creep (' + role + ') : delayed (spawn active)');
                    break;
                default:
                    console.log('Spawning new creep: ' + newName + '(' + role + ')');
                    break;
            }
            return 1;
        }
    },
    soldier: function(spawn, role, requested_number) {
        let current = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(current.length >= requested_number) {
            return 0;
        } else {
            let extensions = this.getExtensions(spawn).length;
            switch(extensions) {
                case 0:
                    var newName = spawn.createCreep([ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE], undefined, {role: role, family: 'warrior'});
                    break;
                default:
                    var newName = spawn.createCreep([ATTACK,ATTACK,ATTACK,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE], undefined, {role: role, family: 'warrior'});
                    break;
            }
            console.log('Spawning new creep: ' + newName + '(' + role + ')');
            return 1;
        }
    }
};

module.exports = coreSpawn;
