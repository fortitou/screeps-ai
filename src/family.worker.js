/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('family.worker');
 * mod.thing == 'a thing'; // true
 */


var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');

var familyWorker = {
    run: function(creep) {
        // sanity check
        /*
        if (!(typeof creep.memory.chosen_source === 'string' || creep.memory.chosen_source instanceof String))
            creep.memory.chosen_source = null;
        }
        */

        // state machine assignments
        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.target = null;
        }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.memory.chosen_source = null;
	    }

	    // work !
	    if(creep.memory.working) {
            if(creep.memory.role == 'harvester') {
                roleHarvester.work(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.work(creep);
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.work(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.work(creep);
            }
            if(creep.memory.role == 'towerer') {
                roleHarvester.fillTowers(creep);
            }
	    } else {
	        // or get energy

	        // dropped energy
	        if(creep.memory.role == 'harvester') {
                let dropped_energy_list = creep.room.find(FIND_DROPPED_ENERGY);
                if(dropped_energy_list.length > 0) {
                    chosen_energy = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
                    if(creep.pickup(chosen_energy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(chosen_energy);
                        return OK;
                    }

                }
            }

            // energy from source
	        if(!creep.memory.chosen_source) {
	            let chosen_source = null;
	            chosen_source = creep.pos.findClosestByPath(FIND_SOURCES,{
                    filter: object => object.energy > 0
                });
	            if (!chosen_source) {
	                chosen_source = creep.pos.findClosestByRange(FIND_SOURCES,{
                        filter: object => object.energy > 0
                    });
	            }
	            if (!chosen_source) {
	                chosen_source = creep.pos.findClosestByRange(FIND_SOURCES);
	            }
                creep.memory.chosen_source = chosen_source.id;
                console.log('setting creep ' + creep + ' source: ' + creep.memory.chosen_source)
            }
            let source = Game.getObjectById(creep.memory.chosen_source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
    }
}
module.exports = familyWorker;
