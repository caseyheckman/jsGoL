var LifeAlgorithm = (function() {
    
    var ALIVE = 1, DEAD = 0;
    
    function LifeAlgorithm(settings) 
    {
        this.cache = [{},{}];
    }
    
    jQuery.extend(LifeAlgorithm.prototype, {
        
        getDeadValue: function() {
            return DEAD;
        },
        
        evaluate: function(status, neighbors) {
            var count = 0;
            for (var i = 0; i < neighbors.length; i++) {
                if (neighbors[i]) {
                    count++;
                }
                if (count > 3) return DEAD;
            }
            
            if (count < 2) return DEAD;
            if (count == 3) return ALIVE;
            return status;
        }
        
    });
    
    return LifeAlgorithm;
})();
