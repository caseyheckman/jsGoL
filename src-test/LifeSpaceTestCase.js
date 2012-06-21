(function() {
    
    var EXAMPLE_STATE_MATRIX = [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
    ];
    
    QUnitUtils.startModule("LifeSpace tests", {
        
        testInitFromDimensions: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({dimensions: [rows, cols], initValue: "A"});
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                equal(space.cellVal(r,c), "A", "The initial value of each cell should be correct.");
            }
            }
        },
        
        testInitFromState: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({state: EXAMPLE_STATE_MATRIX});
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                equal(space.cellVal(r,c), (r == c ? 1 : 0), "Each cell should have the correct value.");
            }
            }
            equal(space.getCount(), 5, "The number of active cells should be correct.");
        },
        
        testSetUsingVal: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({dimensions: [rows, cols]});
            
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                space.cellVal(r,c,1);
                equal(space.cellVal(r,c), 1, "Setting each cell should set it to the correct value.");
            }
            }
            equal(space.getCount(), 25, "The number of active cells should be correct.");
        },
        
        testApply: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({dimensions: [rows, cols]});
            space.apply(function(value, space, posn) {
                return (space.getNeighbors(posn).length);
            });
            
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var exp = ((1 + (r > 0 ? 1 : 0) + (r < rows-1 ? 1 : 0)) * (1 + (c > 0 ? 1 : 0) + (c < cols-1 ? 1 : 0)) - 1);
                equal(space.cellVal(r,c), exp, "Using apply should set each cell to the correct value.");
            }
            }
            equal(space.getCount(), 25, "The number of active cells should be correct.");
        },
        
        testGetNeighbors: function() {
            var expected = [
                "001",
                "10010",
                "00100",
                "00000",
                "000",
                "10100",
                "10000001",
                "00010010",
                "00000100",
                "00000",
                "01000",
                "01001000",
                "10000001",
                "00010010",
                "00010",
                "00000",
                "00100000",
                "01001000",
                "10000001",
                "00101",
                "000",
                "00000",
                "00100",
                "01001",
                "100"
            ];
            var rows = 5, cols = 5;
            var space = new LifeSpace({state: EXAMPLE_STATE_MATRIX});
            var i = 0;
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                equal(space.getCellNeighbors(r,c).join(""), expected[i], "Neighbors should be as expected.");
                i++;
            }
            }
        },
        
        testFromMatrix: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({dimensions: [rows, cols]});
            space.fromMatrix(EXAMPLE_STATE_MATRIX);
            
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                equal(space.cellVal(r,c), EXAMPLE_STATE_MATRIX[r][c], "Using fromMatrix should set each cell to the correct value.");
            }
            }
        },
        
        testToMatrix: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({state: EXAMPLE_STATE_MATRIX});
            var act = space.toMatrix();
            
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                equal(act[r][c], EXAMPLE_STATE_MATRIX[r][c], "Using fromMatrix should set each cell to the correct value.");
            }
            }
        },
        
        testToString: function() {
            var space = new LifeSpace({state: EXAMPLE_STATE_MATRIX});
            var str = space.toString();
            ok(str.length, "The method should generate a non-zero length string.");
            var space2 = new LifeSpace({state: str});
            equal(space2.toString(), str, "The strings should be equal.");
        },
        
        testFromString: function() {
            var rows = 5, cols = 5;
            var space1 = new LifeSpace({state: EXAMPLE_STATE_MATRIX});
            var space2 = new LifeSpace({dimensions: [rows, cols]});
            
            space2.fromString(space1.toString());
            
            for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                equal(space2.cellVal(r,c), EXAMPLE_STATE_MATRIX[r][c], "Using fromString should set each cell to the correct value.");
            }
            }
        },
        
        testHashCode: function() {
            var rows = 5, cols = 5;
            var space = new LifeSpace({dimensions: [rows, cols]});
            var size = rows * cols;
            var hashCodes = {};
            for (var p = 0; p < size; p++) {
                for (var m = p; m < size; m++) {
                    space.val(m, 1);
                    var hashCode = space.hashCode();
                    ok(!hashCodes[hashCode], "The hash code should be unique.");
                    hashCodes[hashCode] = true;
                    space.val(m, 0);
                }
                space.val(p, 1);
            }
        }
    });
    
})();
