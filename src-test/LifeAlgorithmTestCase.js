(function(){
    
    
    QUnitUtils.startModule("LifeAlgorithm",{
        
        setup: function() {
            this.space = {
                neighbors: [], 
            };
            this.algorithm = new LifeAlgorithm();
        },
        
        _checkStateChanged: function(current, expected, neighbors) {
            equal(this.algorithm.evaluate(current, neighbors), expected, "The expected state should be "+expected+" when current state is "+current+" and the neighbors are "+String(neighbors));
        },
        
        _checkState: function(aliveCount, neighbors) {
            this._checkStateChanged(0, (aliveCount == 3 ? 1 : 0), neighbors);
            this._checkStateChanged(1, (aliveCount == 3 || aliveCount == 2 ? 1 : 0), neighbors);
        },
        
        testAlgorithm: function() {
            for (var size = 0; size < 9; size++) {
                var neighbors = [];
                for (var i = 0; i < size; i++) {
                    neighbors[i] = 0;
                }
                this._checkState(0, neighbors);
                for (var p = 0; p < size; p++) {
                    for (var m = p; m < size; m++) {
                        neighbors[m] = 1;
                        this._checkState(p+1, neighbors);
                        neighbors[m] = 0;
                    }
                    neighbors[p] = 1;
                }
            }
        }
    });
})();
