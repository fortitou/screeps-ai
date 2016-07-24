
var coreSpawn = require('core.spawn');
//var roleHarvester = require('role.harvester');
var defend = require('core.defend');
var familyWorker = require('family.worker');
var familyWarrior = require('family.warrior');

// from git

const TASK_HARVEST = 'harvest';
const TASK_REPAIR = 'repair';
const ROLE_WORKER = 'worker';


module.exports.loop = function () {

    // Always place this memory cleaning code at the very top of your main loop!

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Spawn required creeps
    coreSpawn.run();
    

    // defend rooms
    for(let roomName in Game.rooms) {
        // console.log('defending room:' + roomName);
        defend.defendRoom(roomName);
    }
    

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        // creep.say(creep.memory.role)

        // check if lost hit points
        if(creep.hits < creep.memory.lastHits) {
            Game.notify('Creep '+creep+' has been attacked at '+creep.pos+'!');
        }
        creep.memory.lastHits = creep.hits;

        // run creep duties
        if(creep.memory.family == 'worker') {
            familyWorker.run(creep);
        }
        if(creep.memory.family == 'warrior') {
            familyWarrior.run(creep);
        }
    }
}