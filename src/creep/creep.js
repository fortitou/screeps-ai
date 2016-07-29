/*
	Roles define possible tasks
	creep

	Gonna have to define what a task is :
		- word, target ?
		- word only ? (target in creep object) -> seems better for harvesters
*/

Object.assign(Creep.prototype, {
	role: {
		set: function(s) {
			this.memory.role = s;
		},
		get: function() {
      if (this.memory.role === undefined) {
				this.memory.role = null ;
				console.log(this.name + ' has no role !')
			}
			return this.memory.role;
		}
	}
	task: {
		set: function(s) {
			this.memory.task=s;
		},
		get: function() {
      if (this.memory.task === undefined) {
				this.memory.task = null ;
				console.log(this.name + ' has no task !')
			}
			return this.memory.task;
		}
	}
});
