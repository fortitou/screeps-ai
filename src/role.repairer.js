/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.repairer');
 * mod.thing == 'a thing'; // true
 */

var roleRepairer = {
    hitrange: 200,
    repairModeThreshold: 3000,
    workn: function(creep) {
        if(!creep.memory.target) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            if(!targets.length>0) {
                creep.moveTo(Game.flags.Flag1);
                return OK;
            }
    
            targets.sort((a,b) => a.hits - b.hits);
            let ref = targets[0].hits;
            for (let dist=3; dist < 50; dist++) {
                for(target of targets) {
                    if((target.hits - ref) > ref/2) {
                        break;
                    }
                    if(creep.pos.inRangeTo(target, dist)) {
                        if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);    
                            break;
                            break;
                        }
                    }
                }
            }
        }
    },   
    work: function(creep) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        
        if(!targets.length>0) {
            creep.moveTo(Game.flags.Flag1);
            return OK;
        }
        // sort by value
        targets.sort((a,b) => a.hits - b.hits);
        if(targets[0].hits > this.repairModeThreshold) {
            targets.sort((a,b) => a.hits/a.hitsMax - b.hits/b.hitsMax);
        }
        let ref = targets[0].hits;
        for (let dist=3; dist < 50; dist++) {
            for(target of targets) {
                if((target.hits - ref) > ref/2) {
                    // la difference de hit points est trop importante a partir de la...
                    break;
                }
                if(creep.pos.inRangeTo(target, dist)) {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        // console.log(creep + 'repairing target: ' + target);
                        return OK;
                    }
                }
            }
        }
    },   
    work2: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        });
        
        targets.sort((a,b) => a.hits - b.hits);
        
        if(targets.length > 0) {
            if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);    
            }
        } else {
            creep.moveTo(Game.flags.Flag1);
        }        
    },

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	    }

	    if(creep.memory.working) {
	        var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            targets.sort((a,b) => a.hits - b.hits);
            
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                creep.moveTo(Game.flags.Flag1);
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
	    }
	}
};

module.exports = roleRepairer;