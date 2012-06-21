var LifeSpace = (function() {
    
    function LifeSpace(settings) 
    {
        this.space = [];
        this.neighborPositions = [];
        this.count = 0;
        
        if (settings.dimensions) {
            try {
                this.initFromDimensions(settings.dimensions, (settings.initValue || 0));
            } catch(e) {
                throw "Invalid value for 'dimensions' setting: "+e;
            }
        } else if (settings.state) {
            try {
                this.initFromState(settings.state);
            } catch(e) {
                throw "Illegal value for 'state' setting: "+e;
            }
        } else {
            throw "You must specify either the 'dimensions' or 'state' setting";
        }
    }
    
    jQuery.extend(LifeSpace.prototype, {
        initFromState: function(state) 
        {
            if (typeof(state) == "string") {
                this.fromString(state);
            } else {
                this.fromMatrix(state);
            }
        },
        
        initFromDimensions: function(dimensions, initValue) 
        {
            if (jQuery.isArray(dimensions)){
                if (dimensions.length != 2) throw "Invalid number of dimensions in array; there should be two (rows, cols).";
                dimensions = {
                    rows: dimensions[0],
                    cols: dimensions[1]
                };
            } else if (jQuery.isPlainObject(dimensions)) {
                if (!dimensions.rows) throw "Invalid dimensions object specified: 'rows' is missing.";
                if (!dimensions.cols) throw "Invalid dimensions object specified: 'cols' is missing.";
                
            } else {
                throw "Invalid type for 'dimensions' setting: "+typeof(dimensions);
            }
            
            for (var dim in dimensions) {
                var num = Number(dimensions[dim]);
                if (isNaN(num)) throw "Invalid value for dimension '"+dim+"': "+dimensions[dim];
            }
            
            this.setDimensions(dimensions);
            this.apply(function() {return initValue;});
        },
        
        getSize: function() {
            return this.dims.rows * this.dims.cols;
        },
        
        getCount: function() {
            return this.count;
        },
        
        getDimensions: function() 
        {
            return jQuery.extend({}, this.dims);
        },
        
        setDimensions: function(dimensions)
        {
            this.dims = dimensions;
            
            // Calculate and cache neighbor positions
            var posnCol, 
                rowOffset, startRowOffset, endRowOffset,
                colOffset, startColOffset, endColOffset,
                rowSize = this.dims.cols,
                len = this.dims.rows * rowSize,
                lastCol = rowSize - 1,
                lastRow = len - rowSize;
            
            for (var posn = 0; posn < len; posn++) {
                posnCol = (posn % rowSize);
                startRowOffset = (posn > lastCol ? -1 : 0); 
                startColOffset = (posnCol > 0 ? -1 : 0); 
                endRowOffset = (posn < lastRow ? 1 : 0);
                endColOffset = (posnCol < lastCol ? 1 : 0);
                    
                this.neighborPositions[posn] = [];
                
                for (rowOffset = startRowOffset; rowOffset <= endRowOffset; rowOffset++) {
                for (colOffset = startColOffset; colOffset <= endColOffset; colOffset++) {
                    if (colOffset == 0 && rowOffset == 0) continue;
                    this.neighborPositions[posn].push(posn + (rowOffset * rowSize) + colOffset);
                }
                }
            }
        },
        
        val: function(posn, value)
        {
            if (posn < 0 || posn > this.size) return null;
            if (typeof(value) != "undefined") {
                if (this.space[posn] != value) {
                    if (value) {
                        this.count++;
                    } else if (typeof(this.space[posn]) != "undefined") {
                        this.count--;
                    }
                }
                this.space[posn] = value;
            }
            return this.space[posn];
        },
        
        cellVal: function(r, c, value)
        {
            return this.val(this._getPosition(r,c), value);
        },
        
        _getPosition: function(r, c)
        {
            return ((r * this.dims.cols) + c);
        },
        
        getCellNeighbors: function(r, c) {
            return this.getNeighbors(this._getPosition(r,c));
        },
        
        getNeighbors: function(posn) {
            var neighborPositions = this.neighborPositions[posn];
            var neighbors = [];
            for (var p = 0; p < neighborPositions.length; p++) {
                neighbors[p] = this.space[neighborPositions[p]];
            }
            return neighbors;
        },
        
        apply: function(fn) 
        {
            var newSpace = [];
            var mod = false;
            var count = 0;
            var len = this.dims.rows * this.dims.cols;
            for (var i = 0; i < len; i++) {
                newSpace[i] = fn(this.space[i], this, i);
                if (typeof(newSpace[i]) != "undefined" && newSpace[i] !== this.space[i]) {
                    mod = true;
                    if (newSpace[i]) {
                        count++;
                    }
                }
            }
            if (mod) {
                this.space = newSpace;
                this.count = count;
            }
        },
        
        hashCode: function() 
        {
            return hashString(this.toString());
        },
        
        toMatrix: function()
        {
            var data = [], p = 0;
            for (var r = 0; r < this.dims.rows; r++) {
                data[r] = [];
                for (var c = 0; c < this.dims.cols; c++) {
                    data[r][c] = this.space[p];
                    p++;
                }
            }
            return data;
        },
        
        fromMatrix: function(data)
        {
            if (! jQuery.isArray(data)) {
                throw "Illegal argument: value must be an array or string.";
            }
            if (data.length == 0) {
                throw "Illegal argument: matrix was empty."
            }
            
            if (! jQuery.isArray(data[0])) {
                throw "Illegal argument: value must be a regular 2D array, or a JSON serialized string.";
            }
            var cols = data[0].length;
            for (var r = 1; r < data.length; r++) {
                if (! jQuery.isArray(data[r]) || data[r].length != cols) {
                    throw "Illegal argument: value must be a regular 2D array.";
                }
            }
            
            this.setDimensions({
                rows: data.length,
                cols: data[0].length
            });
            
            var p = 0;
            for (var r = 0; r < this.dims.rows; r++) {
                for (var c = 0; c < this.dims.cols; c++) {
                    this.val(p, data[r][c]);
                    p++;
                }
            }
        },
        
        toString: function() 
        {
            return JSON.stringify(this.toMatrix());
        },
        
        fromString: function(str) 
        {
            try {
                var data = JSON.parse(str);
            } catch(e) {
                throw "Illegal argument: string does not match serialized format."
            }
            this.fromMatrix(data);
        }
    });
    
    function hashString(str)
    {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash<<5)-hash) + str.charCodeAt(i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    
    return LifeSpace;
})();
