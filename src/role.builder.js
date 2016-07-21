var roleBuilder = {
    required_number: function(room) {
        sites = room.find(FIND_CONSTRUCTION_SITES).length;
        if (sites>0) {
            return 4;
        } else {
            return 0;
        }
    },
    
    work1: function(creep) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        let target = null;
        if(targets.length) {
            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        } else {
            target = Game.flags.Flag1;
        }
        if(creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } 
    },
    
    work: function(creep) {
        let target = null;
        if(!creep.memory.target) {
            let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length > 0) {
                // console.log(creep + ' there are construction sites');
                target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(!target) { target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);}
                creep.memory.target = target.id;
            } else {
                // console.log(creep + ' no construction sites');
                creep.memory.target = null;
            }
        }
        
        if (!creep.memory.target) {
            creep.moveTo(Game.flags.Flag1);
            return OK;
        }
        
        target = Game.getObjectById(creep.memory.target);
        res = creep.build(target);
        switch(res) {
            case ERR_NOT_IN_RANGE:
                creep.moveTo(target);
                break;
            case ERR_INVALID_TARGET:
                creep.moveTo(target);
                creep.memory.target = null;
                console.log('Builder ' + creep + ' build result: ' + res + ' target: ' + target)
                break;               
            case OK:
                break;
            default:
                creep.memory.target = null;
                console.log('Builder ' + creep + ' build result: ' + res + ' target: ' + target)
                break;
        }
    },

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.target = null;
	    }
	    if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.working = true;
	        creep.memory.source = null;
	    }
	    if(creep.memory.working) {
            this.work(creep);
	    } else {
	        if(!creep.memory.source) {
                creep.memory.source = creep.pos.findClosestByPath(FIND_SOURCES).id;
                console.log('setting creep ' + creep + ' source: ' + creep.memory.source)
            }
            let source = Game.getObjectById(creep.memory.source);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleBuilder;