var LifeView = (function() {
    
    function LifeView(settings) 
    {
        this.container = jQuery(settings.container);
        this.model = settings.model;
        this.space = this.model.getSpace();
        this.size = this.space.getSize();
        
        jQuery(this.model).bind({
            'initialized'   : jQuery.proxy(this.onModelInitialized, this),
            'started'       : jQuery.proxy(this.onModelStarted,     this),
            'stopped'       : jQuery.proxy(this.onModelStopped,     this),
            'iterated'      : jQuery.proxy(this.onModelIterated,    this),
            'stabilized'    : jQuery.proxy(this.onModelStabilized,  this)
        });
        
        this.render();
        this.renderStatus("Initializing...");
    }
    
    jQuery.extend(LifeView.prototype, {
        render: function() 
        {
            this.container.empty();
            
            this.spaceContainer = jQuery('<div/>').appendTo(this.container);
            this.renderSpace();
            
            this.buttonContainer = jQuery('<div/>').appendTo(this.container);
            
            this.startButton = jQuery('<button/>',{html: "Start"})
                .appendTo(this.buttonContainer)
                .hide()
                .click(jQuery.proxy(this.onClickStartButton, this));
            
            this.stopButton = jQuery('<button/>',{html: "Stop"})
                .appendTo(this.buttonContainer)
                .hide()
                .click(jQuery.proxy(this.onClickStopButton, this));
                
            this.enableCycleDetectionButton = jQuery('<button/>',{"html": "Enable Cycle Detection"})
                .appendTo(this.buttonContainer)
                .hide()
                .click(jQuery.proxy(this.onClickEnableCycleDetection, this));
                
            this.disableCycleDetectionButton = jQuery('<button/>',{"html": "Disable Cycle Detection"})
                .appendTo(this.buttonContainer)
                .hide()
                .click(jQuery.proxy(this.onClickDisableCycleDetection, this));
                
            this.statusContainer = jQuery('<div/>').appendTo(this.container);
            this.iterationContainer = jQuery('<span/>').appendTo(jQuery('<div/>', {html: "Iteration: "}).appendTo(this.container));
            this.countContainer = jQuery('<span/>').appendTo(jQuery('<div/>', {html: "Live Cells: "}).appendTo(this.container));
        },
        
        renderSpace: function()
        {
            this.spaceContainer.empty();
            var row, r, c,
                dims = this.space.getDimensions(),
                rows = dims.rows, 
                cols = dims.cols,
                table = jQuery('<table/>', {'class': "space"}).appendTo(this.spaceContainer),
                tbody = jQuery('<tbody/>').appendTo(table);
                
            for (r = 0; r < rows; r++) {
                row = jQuery('<tr/>').appendTo(tbody);
                for (c = 0; c < cols; c++) {
                    jQuery('<td/>', {html: "&nbsp;"}).appendTo(row);
                }
            }
        },
        
        onClickStartButton: function() 
        {
            this.model.start();
        },
        
        onClickStopButton: function() 
        {
            this.model.stop();
        },
        
        onClickEnableCycleDetection: function() 
        {
            this.model.setCycleDetectionEnabled(true);
            this.enableCycleDetectionButton.hide();
            this.disableCycleDetectionButton.show();
        },
        
        onClickDisableCycleDetection: function() 
        {
            this.model.setCycleDetectionEnabled(false);
            this.disableCycleDetectionButton.hide();
            this.enableCycleDetectionButton.show();
        },
        
        updateSpace: function(data)
        {
            this.spaceContainer.find('tbody tr').each(function(r, elt) {
                jQuery(elt).find('td').each(function(c, elt) {
                    jQuery(elt).toggleClass("alive", !!data[r][c]);
                });
            });
        },
        
        onModelInitialized: function() 
        {
            this.updateSpace(this.space.toMatrix());
            this.startButton.show();
            if (this.model.isCycleDetectionEnabled()) {
                this.disableCycleDetectionButton.show();
            } else {
                this.enableCycleDetectionButton.show();
            }
            this.renderStatus("Ready");
            this.renderIteration(0);
            this.renderCount(this.space.getCount());
        },
        
        onModelStarted: function() 
        {
            this.startButton.hide();
            this.stopButton.show();
            this.renderStatus("Running");
        },
        
        onModelStopped: function() 
        {
            this.stopButton.hide();
            this.startButton.show();
            this.renderStatus("Stopped");
        },
        
        onModelIterated: function(event, state) 
        {
            this.updateSpace(state.matrix);
            this.renderIteration(state.iteration);
            this.renderCount(state.count);
        },
        
        onModelStabilized: function(event, data) 
        {
            this.renderStatus("Stopped -- Cycle of length "+data.cycleLength+" detected.");
        },
        
        renderStatus: function(status) 
        {
            this.statusContainer.html(status);
        },
        
        renderCount: function(count) 
        {
            var pct = Math.round(100 * count / this.size);
            this.countContainer.html(count+" ("+pct+"%)");
        },
        
        renderIteration: function(iteration)
        {
            var elapsed = this.model.getElapsedTime();
            var rate = (elapsed ? Math.round(10000 * iteration / elapsed) / 10 : 0);
            this.iterationContainer.html(iteration + " ("+rate+"/sec)");
        }
    });
    
    return LifeView;
})();
