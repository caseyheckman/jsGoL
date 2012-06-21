var Life = (function() {
    
    /**
     * Percentage of the space to make alive when randomizing.
     */
    var p = 10;
    
    function Life(containerId) 
    {
        this.space = new LifeSpace({
            dimensions: {
                rows: 80, 
                cols: 80
            }
        });
        
        this.model = new LifeModel({
            space: this.space
        });
        
        this.view = new LifeView({
            model: this.model,
            container: document.getElementById(containerId)
        });
        
        // Randomize the space
        this.space.apply(function() {
            return (Math.floor(100 * Math.random()) % (100 / p) == 0 ? 1 : 0);
        });
    }
    
    return Life;
    
})();
