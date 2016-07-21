/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.defender');
 * mod.thing == 'a thing'; // true
 */

var roleDefender = {
    get_targets: function(creep) {
        let targets = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: function(object) {
                return object.getActiveBodyparts(ATTACK) == 0;
            }
        });
    }
    run: function(creep) {
        let targets = creep.room.find(FIND_HOSTILE_CREEPS)
        
    }
}