var Q = require('q');


var Manager = function(scenes) {
    this.scenes = scenes;
    this.last = Q(0);
    this.lastScene = null;
};


Manager.prototype.goto = function(name) {
    self = this;

    if(this.lastScene && this.scenes[this.lastScene].exit) {
        var exitDeferred = Q.defer();
        (function(lastScene, last){
            Q.when(last, function() {
                self.scenes[lastScene].exit.call(self.scenes[lastScene], exitDeferred.resolve)
            });
        })(this.lastScene, this.last);

        this.last = exitDeferred.promise;
    }

    if(this.scenes[name] !== undefined) {

        var deferred = Q.defer();

        Q.when(this.last, function() {

            if(typeof self.scenes[name] === 'function') {
                self.scenes[name](deferred.resolve);
            } else if (self.scenes[name].enter !== undefined) {
                self.scenes[name].enter.call(self.scenes[name], deferred.resolve);
            }

        });

        this.last = deferred.promise;
        this.lastScene = name;
    }
};

module.exports = Manager;
