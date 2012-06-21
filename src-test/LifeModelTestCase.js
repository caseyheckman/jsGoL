(function() {
    
    QUnitUtils.startAsyncModule("LifeModel basic event tests", {
        
        setup: function() 
        {
            this.space = new LifeSpace({ dimensions: { rows: 5, cols: 5 } });
            this.model = new LifeModel({
                enableCycleDetection: false,
                space: this.space
            });
        },
        
        teardown: function()
        {
            jQuery(this.model).unbind();
            this.model.stop();
        },
        
        testInit: function() 
        {
            jQuery(this.model).bind('initialized', this.callback(function() {
                this.model.getElapsedTime();
                ok(true, "The model should fire the 'initialized' event.");
                resumeTests();
            }));
        },
        
        testStartEventFired: function() 
        {
            jQuery(this.model).bind('started', this.callback(function() {
                ok(true, "The model should fire the 'started' event.");
                resumeTests();
            }));
            this.model.start();
        },
        
        testStopEventFired: function() 
        {
            jQuery(this.model).bind({
                'stopped': this.callback(function() {
                    ok(true, "The model should fire the 'stopped' event.")
                    resumeTests();
                }),
                'started': this.callback(function() {
                    this.model.stop();
                })
            });
            this.model.start();
        },
        
        testIterationsStarted: function() 
        {
            var nextIteration = 1;
            jQuery(this.model).bind('iterated', this.callback(function(event, state) {
                ok(state, "The state should be passed to the 'iterated' event handler.");
                equal(state.iteration, nextIteration, "The iteration number should be correct.");
                nextIteration++;
                if (state.iteration == 5) {
                    resumeTests();
                    return;
                }
            }));
            this.model.start();
        },
        
        testIterationsStopped: function() 
        {
            jQuery(this.model).bind({
                'iterated': this.callback(function(event, state) {
                    ok(this.model.isRunning(), "The model should be running.");
                    if (state.iteration == 5) {
                        this.model.stop();
                    }
                }),
                'stopped': this.callback(function() {
                    // Wait one second before resuming to see if 'iterated' event fires again.
                    setTimeout(resumeTests, 1000);
                })
            });
            this.model.start();
        }
    });
    
    var PATTERNS = {
        
        "STATICS": {
            
            "BLOCK": [
                [
                    [0,0,0,0],
                    [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0]
                ],
                [
                    [0,0,0,0],
                    [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0]
                ],
                [
                    [0,0,0,0],
                    [0,1,1,0],
                    [0,1,1,0],
                    [0,0,0,0]
                ]
            ],
            "BEEHIVE": [
                [
                    [0,0,0,0,0,0],
                    [0,0,1,1,0,0],
                    [0,1,0,0,1,0],
                    [0,0,1,1,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,1,1,0,0],
                    [0,1,0,0,1,0],
                    [0,0,1,1,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,1,1,0,0],
                    [0,1,0,0,1,0],
                    [0,0,1,1,0,0],
                    [0,0,0,0,0,0]
                ]
            ],
            "LOAF": [
                [
                    [0,0,0,0,0,0],
                    [0,0,1,1,0,0],
                    [0,1,0,0,1,0],
                    [0,0,1,0,1,0],
                    [0,0,0,1,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,1,1,0,0],
                    [0,1,0,0,1,0],
                    [0,0,1,0,1,0],
                    [0,0,0,1,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,1,1,0,0],
                    [0,1,0,0,1,0],
                    [0,0,1,0,1,0],
                    [0,0,0,1,0,0],
                    [0,0,0,0,0,0]
                ]
            ]
        },
        
        "OSCILLATORS": {
            
            "BLINKER": [
                [
                    [0,0,0,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,1,1,1,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,1,1,1,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,1,0,0],
                    [0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,1,1,1,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0]
                ]
            ],
            "TOAD": [
                [
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [0,0,1,1,1,0],
                    [0,1,1,1,0,0],
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,0,1,0,0],
                    [0,1,0,0,1,0],
                    [0,1,0,0,1,0],
                    [0,0,1,0,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [0,0,1,1,1,0],
                    [0,1,1,1,0,0],
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,0,1,0,0],
                    [0,1,0,0,1,0],
                    [0,1,0,0,1,0],
                    [0,0,1,0,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0],
                    [0,0,1,1,1,0],
                    [0,1,1,1,0,0],
                    [0,0,0,0,0,0],
                    [0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0],
                    [0,0,0,1,0,0],
                    [0,1,0,0,1,0],
                    [0,1,0,0,1,0],
                    [0,0,1,0,0,0],
                    [0,0,0,0,0,0]
                ]
            ],
            "OCTAGON": [
                [
                    [0,0,0,1,1,0,0,0],
                    [0,0,1,0,0,1,0,0],
                    [0,1,0,0,0,0,1,0],
                    [1,0,0,0,0,0,0,1],
                    [1,0,0,0,0,0,0,1],
                    [0,1,0,0,0,0,1,0],
                    [0,0,1,0,0,1,0,0],
                    [0,0,0,1,1,0,0,0]
                ],
                [
                    [0,0,0,1,1,0,0,0],
                    [0,0,1,1,1,1,0,0],
                    [0,1,0,0,0,0,1,0],
                    [1,1,0,0,0,0,1,1],
                    [1,1,0,0,0,0,1,1],
                    [0,1,0,0,0,0,1,0],
                    [0,0,1,1,1,1,0,0],
                    [0,0,0,1,1,0,0,0]
                ],
                [
                    [0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0],
                    [1,1,0,1,1,0,1,1],
                    [0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0],
                    [1,1,0,1,1,0,1,1],
                    [0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0]
                ],
                [
                    [0,0,0,0,0,0,0,0],
                    [0,0,1,0,0,1,0,0],
                    [0,1,0,1,1,0,1,0],
                    [0,0,1,0,0,1,0,0],
                    [0,0,1,0,0,1,0,0],
                    [0,1,0,1,1,0,1,0],
                    [0,0,1,0,0,1,0,0],
                    [0,0,0,0,0,0,0,0]
                ],
                [
                    [0,0,0,0,0,0,0,0],
                    [0,0,1,1,1,1,0,0],
                    [0,1,0,1,1,0,1,0],
                    [0,1,1,0,0,1,1,0],
                    [0,1,1,0,0,1,1,0],
                    [0,1,0,1,1,0,1,0],
                    [0,0,1,1,1,1,0,0],
                    [0,0,0,0,0,0,0,0]
                ],
            ]
        }
    };
        
    QUnitUtils.startAsyncModule("LifeModel algorithm tests", {
        
        modelStatesTest: function(states)
        {
            var space = new LifeSpace({
                state: states[0]
            });
            
            var model = new LifeModel({
                enableCycleDetection: false,
                space: space
            });
    
            jQuery(model).bind('iterated', function(event, state) {
                if (states.length > state.iteration) {
                    var expect = stringifyState(states[state.iteration]);
                    var actual = stringifyState(space.toMatrix());
                    equal(actual, expect, "Space state should be as expected for iteration "+state.iteration+".");
                } else {
                    jQuery(model).unbind();
                    resumeTests();
                }
            });
            
            model.start();
        },
        
        testBlock: function() 
        {
            this.modelStatesTest(PATTERNS.STATICS.BLOCK);
        },
        
        testBeehive: function() 
        {
            this.modelStatesTest(PATTERNS.STATICS.BEEHIVE);
        },
        
        testLoaf: function() 
        {
            this.modelStatesTest(PATTERNS.STATICS.LOAF);
        },
        
        testBlinker: function() 
        {
            this.modelStatesTest(PATTERNS.OSCILLATORS.BLINKER);
        },
        
        testToad: function() 
        {
            this.modelStatesTest(PATTERNS.OSCILLATORS.TOAD);
        },
        
        testOctagon: function() 
        {
            this.modelStatesTest(PATTERNS.OSCILLATORS.OCTAGON);
        }
        
    });
    
    
    function stringifyState(state)
    {
        var str = "\n";
        for (var r = 0; r < state.length; r++) {
            str += state[r].join(",") + "\n";
        }
        return str;
    }
    
    QUnitUtils.startAsyncModule("LifeModel cycle detection", {
        
        testStopOnCycleDetection: function() {

            var states = PATTERNS.OSCILLATORS.OCTAGON;
            var expectedCycleLength = states.length;
            var lastExpectedIteration = expectedCycleLength+1;
            var space = new LifeSpace({ state: states[0] });
            var model = new LifeModel({
                enableCycleDetection: true,
                space: space
            });
            
            var stopFired = false;
            jQuery(model).bind({
                'iterated': function(event, state) {
                    ok(state.iteration <= lastExpectedIteration, "We should iterate the correct number of times.");
                },
                
                'stopped': function() {
                    stopFired = true;
                },
                
                'stabilized': function(event, data) {
                    equal(data.cycleLength, expectedCycleLength, "The cycle length should be correct.");
                    equal(data.iteration, lastExpectedIteration, "The iteration number should be correct.");
                    // Wait one second before resuming to see if 'iterated' event fires again.
                    setTimeout(function() {
                        ok(stopFired, "The 'stopped' event should have been fired.");
                        resumeTests();
                    }, 1000);
                }
            });
            model.start();
        },
        
        testResumeAfterStopOnCycleDetection: function() {
            
            var states = PATTERNS.OSCILLATORS.OCTAGON;
            var expectedCycleLength = states.length;
            var space = new LifeSpace({ state: states[0] });
            var model = new LifeModel({
                enableCycleDetection: true,
                space: space
            });
            
            var stops = 0;
            var stopLimit = 3;
            jQuery(model).bind({
                'stabilized': function(event, data) {
                    equal(data.cycleLength, expectedCycleLength, "The cycle length should be correct.");
                    stops++;
                    if (stops < stopLimit) {
                        model.start();
                    } else {
                        resumeTests();
                    }
                }
            });
            model.start();
        },
        
        testStopOnCycleDetectionAfterReenable: function() {
            
            var expectedCycleLength = PATTERNS.OSCILLATORS.OCTAGON.length;
            var space = new LifeSpace({ state: PATTERNS.OSCILLATORS.OCTAGON[0] });
            var model = new LifeModel({
                enableCycleDetection: true,
                space: space
            });
            
            var stops = 0;
            var stopLimit = 2 + expectedCycleLength;
            var reenableAtIteration = 0;
            jQuery(model).bind({
                'iterated': function(event, state) {
                    if (reenableAtIteration && state.iteration == reenableAtIteration) {
                        model.setCycleDetectionEnabled(true);
                    }
                },
                
                'stabilized': function(event, data) {
                    equal(data.cycleLength, expectedCycleLength, "The cycle length should be correct.");
                    stops++;
                    
                    if (stops < stopLimit) {
                        
                        reenableAtIteration = (stops + data.iteration);
                        model.setCycleDetectionEnabled(false);
                        model.start();
                    } else {
                        resumeTests();
                    }
                }
            });
            model.start();
        }
    });
    
    function resumeTests() { 
        QUnit.start();
    }
    
})();
