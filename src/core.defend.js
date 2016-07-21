/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('core.defend');
 * mod.thing == 'a thing'; // true
 */

var coreTower = require('core.tower')

function defendRoom(roomName) {
    // console.log('defending room:' + roomName);
    
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);

        for(tower of towers) {
            coreTower.attack(tower);
        }
    } else {
        for(tower of towers){
            if (tower.energy / tower.energyCapacity > 0.5) { coreTower.repair(tower) ; }
        }
    }
}



module.exports = {
    defendRoom: defendRoom,
};