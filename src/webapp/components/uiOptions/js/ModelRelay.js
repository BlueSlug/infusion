/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    /***************************************************************************************
     * modelRelay
     *
     * The "model relay" system - a framework sketch for a junction between an applier
     * bound to one model and another. It accepts (currently) one type of handler:
     * a simple string representing a direct relay between changes to one path and another
     ***************************************************************************************/

    fluid.defaults("fluid.uiOptions.modelRelay", {
        gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"],
        sourceModel: null,  // must be supplied by implementors
        sourceApplier: null,  // must be supplied by implementors
        rules: {},  // must be supplied by implementors, in format: "sourceModelKey": "targetModelKey"
        
        // The two options below keep track of the latest values on two models since the actual model 
        // value doesn't get updated until all the registered listeners are executed. This is to prevent  
        // the recursive calls in btw the listeners registered for each other.
        latestSourceModelValues: {},
        latestSelfModelValues: {},
        
        postInitFunction: "fluid.uiOptions.modelRelay.postInit",
    });
    
    fluid.uiOptions.modelRelay.createListener = function (targetApplier, newModel, sourceModelTracker, targetModelTracker, from, to) {
        var newValue = fluid.get(newModel, from);
        var lastTargetValue = fluid.get(targetModelTracker, to);
        
        if (newValue !== lastTargetValue) {
            fluid.set(sourceModelTracker, from, newValue);
            targetApplier.requestChange(to, newValue);
        }
    };
    
    fluid.uiOptions.modelRelay.postInit = function (that) {
        fluid.transform(that.options.rules, function (value, key) {
            var listenerForSourceModel = function (newModel, oldModel) {
                fluid.uiOptions.modelRelay.createListener(that.applier, newModel, that.options.latestSourceModelValues, that.options.latestSelfModelValues, key, value);
            };
            var listenerForInternalModel = function (newModel, oldModel) {
                fluid.uiOptions.modelRelay.createListener(that.options.sourceApplier, newModel, that.options.latestSelfModelValues, that.options.latestSourceModelValues, value, key);
            };
            that.options.sourceApplier.modelChanged.addListener(key, listenerForSourceModel);
            that.applier.modelChanged.addListener(value, listenerForInternalModel);
        });
    };

})(jQuery, fluid_1_5);
