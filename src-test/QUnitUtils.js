var QUnitUtils = (function() {
    
    /**
     * Default max time to wait for each test (in millseconds)
     * @var
     */
    var DEFAULT_TEST_TIMEOUT = 15000;
    
    var QUnitUtils = {
        
        /**
         * Set the maximum amount of time to wait for each QUnit test before failing.
         * @param timeout Number The time in milliseconds.
         */
        setTimeout: function(timeout) 
        {
            QUnit.config.testTimeout = timeout;
        },
        
        /**
         * Execute a suite of tests using QUnit.test() (or another test function if desired).
         * 
         * @param String suiteName The name of the module for reporting.
         * @param Object suite The suite object, which may contain the following properties:
         *  - test* (any property beginning with the letters "test") Function Methods to be executed as tests.
         *  - setup Function to be called before calling each test method (Optional).
         *  - teardown Function to be called after calling each test method (Optional).
         *  - method Function that is called to execute each test method (Optional; QUnit.test() is the default).
         * 
         * Each test method is executed in the scope of the suite object (so "this" refers to the suite object).
         * Thus, you can setup certain values in the setup method, and use them in each test method.
         * For example:
         * 
         * QUnitUtils.startModule("My Tests", {
         *     setup: function() {
         *         this.service = new MyService();
         *         this.service.startProcess();
         *     },
         * 
         *     testStepOne: function() {
         *         QUnit.equal(this.service.getLastStepCompleted(), null, "No steps should have been completed.");
         *         this.service.performStep("one");
         *         QUnit.ok(this.service.isStepComplete("one"), "The first step should be complete.");
         *         QUnit.equal(this.service.getLastStepCompleted(), "one", "The last step should be step one.");
         *     },
         * 
         *     testStepTwo: function() {
         *         this.service.performStep("one");
         *         this.service.performStep("two");
         *         QUnit.ok(this.service.isStepComplete("two"), "The second step should be complete.");
         *         QUnit.equal(this.service.getLastStepCompleted(), "two", "The last step should be step two.");
         *     },
         * 
         *     teardown: function() {
         *         this.service.endProcess();
         *         QUnit.ok(this.service.isFinished(), "The process should have ended normally.");
         *     }
         * });
         *  
         */
        startModule: function(suiteName, suite) 
        {
            suite.callback = function(fn) {
                return (typeof(fn) == "string" ? jQuery.proxy(this,fn) : jQuery.proxy(fn,this));
            };
            
            QUnit.module(suiteName, suite);
            
            var meth = (suite.method || QUnit.test);
            for (var key in suite) {
                if (key.substr(0,4) == "test") {
                    meth.call(QUnit, key, suite[key]);
                }
            }
        },

        /**
         * Execute a suite of asynchronous tests using QUnit.asyncTest() (or another test function if desired).
         * Similar to startModule() except that each test method is executed asynchronously. 
         * 
         * NOTE: Each test method must call QUnit.start() when finished executing. If the test method does not call 
         * QUnit.start() within the time allowed by the QUnit timeout, then the test will be aborted as failed.
         * Use QUnit.config.testTimeout to set the timeout value to a number of milliseconds.
         * As one would expect, the "teardown" method will not be executed until the test method calls QUnit.start().
         * 
         * @param String suiteName The name of the module for reporting.
         * @param Object suite The suite object (See startModule() for complete documentation).
         */
        startAsyncModule: function(suiteName, suite) 
        {
            suite.method = QUnit.asyncTest;
            QUnitUtils.startModule(suiteName, suite);
        },
        
        /**
         * Handle an error message.
         * Reusable method to get consistent behavior for all errors.
         * @param String message The message
         */
        handleAsyncTestError: function(message)
        {
            QUnit.ok(false, message);
            QUnit.start();
        }
    };

    // Init QUnit with the default timeout
    QUnitUtils.setTimeout(DEFAULT_TEST_TIMEOUT);
    
    // Configure QUnit to log messages to JS console
    QUnit.log = function(data) {
        if (! window["console"] || ! window.console["log"])
            return;
        var message = (data.result ? "Success" : "Failure");
        if (data.message) {
            message += ": " + (data.message + " " || "");
        }
        if (! data.result) {
            if (data.expected) { 
                message += "Expected: >>>"+data.expected+"<<< ";
            }
            if (data.actual) {
                message += "Actual: >>>"+data.actual+"<<< ";
            }
        }
        window.console.log(message);
    };

    return QUnitUtils;
})();
