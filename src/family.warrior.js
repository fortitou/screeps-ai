/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('family.warrior');
 * mod.thing == 'a thing'; // true
 */
 
var familyWarrior = {
    run: function(creep) {
        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            console.log(creep + 'attacking hostiles');
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }      
        } else {
            creep.moveTo(Game.flags.Warriors);
        }
    },
    get_hostiles: function(creep) {
        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        return hostiles;
    }
}
module.exports = familyWarrior;
