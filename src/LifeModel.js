var LifeModel = (function(jQuery) {
    
    var DEFAULTS = {
        frequency: 10, // Iterations per second (approximate),
        maxHistorySize: 500,
        enableCycleDetection: true
    };
    
    function LifeModel(settings) 
    {
        if (typeof(settings.frequency) != "undefined" && (settings.frequency <= 0 || settings.frequency > 20)) {
            throw "Illegal value for 'frequency' setting: Must be greater than zero and less than or equal to 20."
        }
        
        this.settings = jQuery.extend({}, DEFAULTS, settings);
        this.space = settings.space;
        this.algorithm = (settings.algorithm || new LifeAlgorithm());

        this.setCycleDetectionEnabled(this.settings.enableCycleDetection);
        
        this.intervalId = null;
        this.iteration = 0;
        this.startTime = false;
        this.elapsed = 0;
        
        this._fire('initialized', null, 1);
        
    }
    
    jQuery.extend(LifeModel.prototype, {
        
        getSpace: function() { return this.space; },
        getHistory: function() { return this.history; },
        getAlgorithm: function() { return this.algorithm; },
        
        getElapsedTime: function() {
            var elapsed = this.elapsed;
            if (this.startTime) {
                elapsed += (new Date()).getTime() - this.startTime;
            }
            return elapsed;
        },
        
        isCycleDetectionEnabled: function() {
            return this.settings.enableCycleDetection;
        },
        
        setCycleDetectionEnabled: function(enable) {
            if (enable) {
                this.previousStates = {};
                this.previousStatesList = [];
            }
            this.settings.enableCycleDetection = enable;
        },
        
        start: function() 
        {
            if (this.isRunning()) return;
            this.previousState = null;
            var delay = Math.max(1, Math.floor(1000 / this.settings.frequency));
            this.intervalId = setInterval(jQuery.proxy(this._iterate, this), delay);
            this.startTime = (new Date()).getTime();
            this._fire('started');
        },
        
        stop: function() 
        {
            if (!this.isRunning()) return;
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.elapsed = this.getElapsedTime();
            this.startTime = false;
            this._fire('stopped');
        },
        
        isRunning: function() 
        {
            return (this.intervalId != null);
        },
        
        _iterate: function()
        {
            // Ensure that we don't iterate again after we have stopped
            if (!this.isRunning()) return;
            
            this.iteration++;
            this.space.apply(jQuery.proxy(function(value, space, posn) {
                return this.algorithm.evaluate(value, space.getNeighbors(posn));
            }, this));
            this._fire('iterated', {
                iteration: this.iteration, 
                matrix: this.space.toMatrix(),
                count: this.space.getCount()
            });
            
            if (this.isCycleDetectionEnabled()) {
                this._checkCycle();
            }
        },
        
        _checkCycle: function() {
            
            var hashCode = this.space.hashCode();
            if (this.previousStates[hashCode]) {
                this.stop();
                var cycleLength = 1 + jQuery.inArray(hashCode, this.previousStatesList);
                this._fire('stabilized', {
                    iteration: this.iteration, 
                    cycleLength: cycleLength
                });
            }
            this.previousStates[hashCode] = true;
            this.previousStatesList.unshift(hashCode);
            if (this.previousStatesList.length == this.settings.maxHistorySize) {
                delete this.previousStates[this.previousStatesList.pop()];
            }
        },
        
        _fire: function(eventName, data, delay) {
            if (delay) {
                setTimeout(jQuery.proxy(function() {
                    this._fire(eventName, data);
                }, this), delay);
            } else {
                jQuery(this).trigger(eventName, data);
            }
        }
        
    });
    
    return LifeModel;
    
})(jQuery);
