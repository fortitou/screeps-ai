/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('family.worker');
 * mod.thing == 'a thing'; // true
 */

var Worker = Object.assign(Creep, {
	tasks: ['harvestSource', 'harvestRemote', 'harvestDropped', 'repair', 'build', 'upgrade'],
	findSource: function() {
		let source = null;
		source = this.creep.pos.findClosestByPath(FIND_SOURCES,{
			filter: object => object.energy > 0
		});
		if (!source) {
			source = this.creep.pos.findClosestByRange(FIND_SOURCES,{
				filter: object => object.energy > 0
			});
		}
		if (!source) {
			source = this.creep.pos.findClosestByRange(FIND_SOURCES);
		}
		return source;
	},
	setSource: function(source) {
		this.creep.memory.source = source;
	}
	setTask: function(task) {
		this.creep.memory.task = task;
	}
	setTarget: function(target) {
		this.creep.memory.targe = target;
	}
  run: function(creep) {
		this.creep = creep;

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

	  // set task



    // work !
    if(creep.memory.working) {
      if(creep.memory.task == 'harvest-source') {
        roleHarvester.work(creep);
      }
      if(creep.memory.task == 'upgrade') {
        roleUpgrader.work(creep);
      }
      if(creep.memory.task == 'build') {
        roleBuilder.work(creep);
      }
      if(creep.memory.task == 'repair') {
        roleRepairer.work(creep);
      }
    } else {
      // or get energy

      // dropped energy
      if(creep.memory.task == 'harvestDropped') {
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
        creep.memory.chosen_source = this.getSource().id;
          console.log('setting creep ' + creep + ' source: ' + creep.memory.chosen_source)
        }
        let source = Game.getObjectById(creep.memory.chosen_source);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
      }
	  }
  }
}
module.exports = Worker;
