/*
Copyright 2011-2014, 2018 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt

 */

/* global fluid, jqUnit */

(function ($) {
    "use strict";

    /* Mixin grade for UIO test component */
    fluid.defaults("fluid.tests.uiOptions.testPrefsEditorBase", {
        gradeNames: ["fluid.uiOptions.prefsEditor"],
        terms: {
            templatePrefix: "../../../../src/framework/preferences/html",
            messagePrefix: "../../../../src/framework/preferences/messages"
        }
    });

    /* Mixin grade for UIO test environment */
    fluid.defaults("fluid.tests.uiOptions.prefsEditorBaseTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            prefsEditor: {
                createOnEvent: "{prefsEditorTester}.events.onTestCaseStart"
            },
            prefsEditorTester: {}
        }
    });

    fluid.tests.uiOptions.customizedTocTemplate = "../../../../src/components/tableOfContents/html/TableOfContents.html";

    fluid.defaults("fluid.tests.uiOptions.testPrefsEditorCustomToc", {
        gradeNames: ["fluid.tests.uiOptions.testPrefsEditorBase"],
        tocTemplate: fluid.tests.uiOptions.customizedTocTemplate
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorCustomTocTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "UI Options Tests",
            tests: [{
                name: "Pass in customized toc template",
                expect: 2,
                sequence: [{
                    "event": "{prefsEditorCustomTocTest testPrefsEditorCustomToc}.events.onReady",
                    "listener": "fluid.tests.uiOptions.prefsEditorCustomTocTester.verifyCustomizedTocTemplates",
                    "args": ["{testPrefsEditorCustomToc}", fluid.tests.uiOptions.customizedTocTemplate]
                }]
            }]
        }]
    });

    fluid.tests.uiOptions.prefsEditorCustomTocTester.verifyCustomizedTocTemplates = function (prefsEditorComponent, expectedTocTemplate) {
        jqUnit.assertEquals("The toc template is applied properly to the pageEnhancer", expectedTocTemplate, prefsEditorComponent.enhancer.uiEnhancer.fluid_prefs_enactor_tableOfContents.options.tocTemplate);
        jqUnit.assertEquals("FLUID-5474: The toc template is applied properly to iframeEnhancer", expectedTocTemplate, prefsEditorComponent.prefsEditorLoader.iframeRenderer.iframeEnhancer.fluid_prefs_enactor_tableOfContents.options.tocTemplate);
    };

    fluid.defaults("fluid.tests.uiOptions.prefsEditorCustomTocTest", {
        gradeNames: ["fluid.tests.uiOptions.prefsEditorBaseTest"],
        components: {
            prefsEditor: {
                type: "fluid.tests.uiOptions.testPrefsEditorCustomToc",
                container: ".flc-prefsEditor-separatedPanel"
            },
            prefsEditorTester: {
                type: "fluid.tests.uiOptions.prefsEditorCustomTocTester"
            }
        }
    });

    fluid.defaults("fluid.tests.uiOptions.testPrefsEditorLocalized", {
        gradeNames: ["fluid.tests.uiOptions.testPrefsEditorBase", "fluid.uiOptions.prefsEditor.localized"],
        defaultLocale: "fr"
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedTest.verifyLocalization", {
        gradeNames: ["fluid.test.sequenceElement"],
        sequence: [{
            event: "{prefsEditorBaseTest prefsEditorLoader prefsEditor}.events.onReady",
            listener: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyDefaultLocale",
            args: ["{prefsEditor}", "fr"]
        },
        {
            funcName: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyPanelMessages",
            args: ["{prefsEditor}", "fr"]
        },
        {
            func: "{prefsEditor}.events.onInterfaceLocaleChangeRequested.fire",
            args: [{data:"es"}]
        },
        {
            event: "{prefsEditor}.events.onAllPanelsUpdated",
            listener: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyPanelMessages",
            args: ["{prefsEditor}", "es"]
        },
        {
            func: "{prefsEditor}.events.onInterfaceLocaleChangeRequested.fire",
            args: [{data:"en_US"}]
        },
        {
            event: "{prefsEditor}.events.onAllPanelsUpdated",
            listener: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyPanelMessages",
            args: ["{prefsEditor}", "en_US"]
        }]
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedTest.verifyFunctions", {
        gradeNames: ["fluid.test.sequenceElement"],
        sequence: [{
            funcName: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyUpdateLocalizedComponent"
        },
        {
            funcName: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyUpdateSlidingPanel"
        },
        {
            funcName: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyUpdateUioPanelLocales"
        }]
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedTestSequence", {
        gradeNames: ["fluid.test.sequence"],
        sequenceElements: {
            verifyLocalization: {
                gradeNames: "fluid.tests.uiOptions.prefsEditorLocalizedTest.verifyLocalization",
                priority: "after:sequence"
            },
            verifyFunctions: {
                gradeNames: "fluid.tests.uiOptions.prefsEditorLocalizedTest.verifyFunctions",
                priority: "after:verifyLocalization"
            }
        }
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "UI Options Locale Tests",
            tests: [{
                name: "UIO localization tests",
                expect: 57,
                sequenceGrade: "fluid.tests.uiOptions.prefsEditorLocalizedTestSequence",
                sequence: [{
                    funcName: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyReloadUioMessages",
                    args: ["{prefsEditor}.prefsEditorLoader.messageLoader"]
                },
                {
                    event: "{prefsEditor}.prefsEditorLoader.messageLoader.events.onResourcesLoaded",
                    listener: "jqUnit.assert",
                    args: ["Messages were reloaded"]
                }]
            }]
        }]
    });

    fluid.tests.uiOptions.prefsEditorLocalizedTester.panelValuesToVerify = {
        fluid_prefs_panel_contrast: {
            path: "label",
            expected: {
                en_US: "Contrast",
                es: "Color y contraste",
                fr: "Couleur et contraste"
            }
        },
        fluid_prefs_panel_enhanceInputs: {
            path: "label",
            expected: {
                en_US: "Enhance Inputs",
                es: "Mejorar las entradas",
                fr: "Accentuer les contrôles"
            }
        },
        fluid_prefs_panel_layoutControls: {
            path: "label",
            expected: {
                en_US: "Table of Contents",
                es: "Tabla de contenido",
                fr: "Table des matières"
            }
        },
        fluid_prefs_panel_lineSpace: {
            path: "label",
            expected: {
                en_US: "Line Spacing",
                es: "Espaciado entre líneas",
                fr: "Interligne"
            }
        },
        fluid_prefs_panel_textFont: {
            path: "textFontLabel",
            expected: {
                en_US: "Text style",
                es: "Estilo de texto",
                fr: "Style du texte"
            }
        },
        fluid_prefs_panel_textSize: {
            path: "label",
            expected: {
                en_US: "Text Size",
                es: "Tamano del texto",
                fr: "Taille du texte"
            }
        }
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.slidingPanelExpectedValues = {
        toggleButton: {
            en_US: "+ Show Preferences",
            es: "+ Mostrar preferencias",
            fr: "+ Montrer les préférences"
        },
        panel: {
            en_US: "User Preferences",
            es: "Preferencias de usuario",
            fr: "Préférences de l'utilisateur"
        }
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyDefaultLocale = function (prefsEditor, expectedLocale) {
        jqUnit.assertEquals("defaultLocale is properly propagated to messageLoader", expectedLocale, prefsEditor.prefsEditorLoader.messageLoader.options.defaultLocale);
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyPanelMessages = function (prefsEditor, expectedLocale) {
        fluid.each(prefsEditor.prefsEditorLoader.messageLoader.resources, function (panel, key) {
            if (fluid.tests.uiOptions.prefsEditorLocalizedTester.panelValuesToVerify[key]) {
                var localizedPanelValues = fluid.tests.uiOptions.prefsEditorLocalizedTester.panelValuesToVerify[key];
                var actualPanelMessageValue = panel.resourceText[localizedPanelValues.path];

                jqUnit.assertEquals("Panel " + key + " localized message loaded correctly for " + expectedLocale, localizedPanelValues.expected[expectedLocale], actualPanelMessageValue);

                var actualPanelRenderedValue = prefsEditor.prefsEditorLoader.prefsEditor[key].locate("label").text();
                jqUnit.assertEquals("Panel " + key + " localized message rendered correctly for " + expectedLocale, localizedPanelValues.expected[expectedLocale], actualPanelRenderedValue);
            }
        });

        var localizedSlidingPanelValues = fluid.tests.uiOptions.prefsEditorLocalizedTester.slidingPanelExpectedValues;

        var actualSlidingPanelMessageValue = prefsEditor.prefsEditorLoader.messageLoader.resources.prefsEditor.resourceText.slidingPanelPanelLabel;
        var actualSlidingPanelRenderedValue = prefsEditor.prefsEditorLoader.slidingPanel.locate("panel").attr("aria-label");
        jqUnit.assertEquals("Sliding panel localized panel message loaded correctly for " + expectedLocale, localizedSlidingPanelValues.panel[expectedLocale], actualSlidingPanelMessageValue);
        jqUnit.assertEquals("Sliding panel localized panel message rendered correctly for " + expectedLocale, localizedSlidingPanelValues.panel[expectedLocale], actualSlidingPanelRenderedValue);

        var actualToggleButtonMessageValue = prefsEditor.prefsEditorLoader.messageLoader.resources.prefsEditor.resourceText.slidingPanelShowText;
        var actualToggleButtonRenderedValue = prefsEditor.prefsEditorLoader.slidingPanel.locate("toggleButton").text();
        jqUnit.assertEquals("Sliding panel localized toggleButton message loaded correctly for " + expectedLocale, localizedSlidingPanelValues.toggleButton[expectedLocale], actualToggleButtonMessageValue);
        jqUnit.assertEquals("Sliding panel localized toggleButton message rendered correctly for " + expectedLocale, localizedSlidingPanelValues.toggleButton[expectedLocale], actualToggleButtonRenderedValue);
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyReloadUioMessages = function (messageLoader, lazyLoadEvent) {
        if (messageLoader) {
            jqUnit.assertEquals("Initial locale is as expected", null, messageLoader.options.locale);

            if (lazyLoadEvent) {
                fluid.uiOptions.prefsEditor.localized.reloadUioMessages("fr", messageLoader, "options.locale", lazyLoadEvent);
            } else {
                fluid.uiOptions.prefsEditor.localized.reloadUioMessages("fr", messageLoader, "options.locale");
            }

            jqUnit.assertEquals("Updated locale is as expected", "fr", messageLoader.options.locale);
        } else {
            jqUnit.fail("The messageLoader component is not available");
        }
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyUpdateLocalizedComponent = function () {
        var testLocalizedComponentWithoutMsgResolver = {};
        var testLocalizedComponentWithMsgResolver = {
            msgResolver: {}
        };

        var testResources = {
            shyguy: {
                resourceText: "Shyguy is a cat"
            }
        };

        var expectedLocalizedComponent = {
            msgResolver: {
                messageLocale: "en",
                messageBase: "Shyguy is a cat"
            }
        };

        fluid.uiOptions.prefsEditor.localized.updateLocalizedComponent(testLocalizedComponentWithoutMsgResolver, "shyguy", testResources, "en");
        jqUnit.assertDeepEq("Localized component was not updated when msgResolver was not truthy", {}, testLocalizedComponentWithoutMsgResolver);

        fluid.uiOptions.prefsEditor.localized.updateLocalizedComponent(testLocalizedComponentWithMsgResolver, "shyguy", testResources, "en");
        jqUnit.assertDeepEq("Localized component was updated with new values", expectedLocalizedComponent, testLocalizedComponentWithMsgResolver);
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyUpdateSlidingPanel = function () {
        var testResources = {
            prefsEditor: {
                resourceText: {
                    shyguy: "Shyguy likes gentle pats",
                    rootbeer: "Rootbeer likes all sorts of pats"
                }
            }
        };

        var testSlidingPanel = {
            msgResolver: {},
            options: {
                strings: {
                    shyguyMessage: "",
                    rootbeerMessage: ""
                }
            },
            refreshView: function () {
                jqUnit.assert("slidingPanel refresh function was called");
            }
        };

        var testStringMap = {
            shyguyMessage: "shyguy",
            rootbeerMessage: "rootbeer"
        };

        var expectedResult = {
            msgResolver: {
                messageLocale: "catspeak",
                messageBase: {
                    shyguy: "Shyguy likes gentle pats",
                    rootbeer: "Rootbeer likes all sorts of pats"
                }
            },
            options: {
                strings: {
                    shyguyMessage: "Shyguy likes gentle pats",
                    rootbeerMessage: "Rootbeer likes all sorts of pats"
                }
            },
            refreshView: function () {
                jqUnit.assert("slidingPanel refresh function was called");
            }
        };

        fluid.uiOptions.prefsEditor.localized.updateSlidingPanel(testResources, "catspeak", testSlidingPanel, testStringMap);

        jqUnit.assertDeepEq("slidingPanel was updated with new values", expectedResult, testSlidingPanel);
    };

    fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyUpdateUioPanelLocales = function () {
        var testResources = {
            panelTheFirst: {
                resourceText: {
                    shyguy: "Shyguy is a little skittish",
                    rootbeer: "Rootbeer is a little clumsy"
                }
            },
            panelTheSecond: {
                resourceText: {
                    shyguy: "Shyguy still likes attention",
                    rootbeer: "Rootbeer has separation anxiety"
                }
            }
        };

        var testPrefsEditor = {
            panelTheFirst: {
                msgResolver: {},
                options: {
                    gradeNames: ["fluid.prefs.panel"]
                }
            },
            panelTheSecond: {
                msgResolver: {},
                options: {
                    gradeNames: ["fluid.prefs.panel"]
                }
            },
            notActuallyAPanel: "No cats here"
        };

        var expectedResult = {
            panelTheFirst: {
                msgResolver: {
                    messageLocale: "meowish",
                    messageBase: {
                        shyguy: "Shyguy is a little skittish",
                        rootbeer: "Rootbeer is a little clumsy"
                    }
                },
                options: {
                    gradeNames: ["fluid.prefs.panel"]
                }
            },
            panelTheSecond: {
                msgResolver: {
                    messageLocale: "meowish",
                    messageBase: {
                        shyguy: "Shyguy still likes attention",
                        rootbeer: "Rootbeer has separation anxiety"
                    }
                },
                options: {
                    gradeNames: ["fluid.prefs.panel"]
                }
            },
            notActuallyAPanel: "No cats here"
        };

        fluid.uiOptions.prefsEditor.localized.updateUioPanelLocales(testResources, "meowish", testPrefsEditor);

        jqUnit.assertDeepEq("All panels were updated with new values", expectedResult, testPrefsEditor);
    };

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedTest", {
        gradeNames: ["fluid.tests.uiOptions.prefsEditorBaseTest"],
        components: {
            prefsEditor: {
                type: "fluid.tests.uiOptions.testPrefsEditorLocalized",
                container: ".flc-prefsEditor-separatedPanel-localized"
            },
            prefsEditorTester: {
                type: "fluid.tests.uiOptions.prefsEditorLocalizedTester"
            }
        }
    });

    fluid.defaults("fluid.tests.uiOptions.testPrefsEditorLocalizedLazy", {
        gradeNames: ["fluid.tests.uiOptions.testPrefsEditorLocalized"],
        lazyLoad: true
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedLazyTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "UI Options Locale Tests with Lazy Load",
            tests: [{
                name: "UIO localization tests",
                expect: 57,
                sequenceGrade: "fluid.tests.uiOptions.prefsEditorLocalizedTestSequence",
                sequence: [{
                    func: "{prefsEditor}.prefsEditorLoader.events.onLazyLoad.fire"
                },
                {
                    funcName: "fluid.tests.uiOptions.prefsEditorLocalizedTester.verifyReloadUioMessages",
                    args: ["{prefsEditor}.prefsEditorLoader.messageLoader", "{prefsEditor}.prefsEditorLoader.events.onLazyLoad"]
                },
                {
                    event: "{prefsEditor}.prefsEditorLoader.events.onLazyLoad",
                    listener: "jqUnit.assert",
                    args: ["Lazy load was triggered"]
                }]
            }]
        }]
    });

    fluid.defaults("fluid.tests.uiOptions.prefsEditorLocalizedLazyTest", {
        gradeNames: ["fluid.tests.uiOptions.prefsEditorBaseTest"],
        components: {
            prefsEditor: {
                type: "fluid.tests.uiOptions.testPrefsEditorLocalizedLazy",
                container: ".flc-prefsEditor-separatedPanel-localized-lazy"
            },
            prefsEditorTester: {
                type: "fluid.tests.uiOptions.prefsEditorLocalizedLazyTester"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.uiOptions.prefsEditorCustomTocTest",
            "fluid.tests.uiOptions.prefsEditorLocalizedTest",
            "fluid.tests.uiOptions.prefsEditorLocalizedLazyTest"
        ]);
    });
})(jQuery);
