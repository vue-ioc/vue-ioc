import {expect} from "chai";
import izi from "../es6";
import BeansContext from "../es6/ioc/BeansContext";

describe("Beans Context", function () {

    it("Should create beans context", function () {
        // given
        var context = izi.bakeBeans({});


        // when/then
        expect(context).to.be.instanceof(BeansContext);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should load bean by id", function () {
        // given
        var context = izi.bakeBeans({
            someId: {
                name: "value"
            }
        });

        // when/then
        expect(context.getBean("someId").name).toEqual("value");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should load bean by type", function () {
        var context,
            MockObject = function (value) {
                this.value = value;
            };

        // given
        context = izi.bakeBeans({
            someId: new MockObject("value")
        });

        // when/then
        expect(context.getBean(MockObject).value).toEqual("value");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should instantiate singleton by type and arguments", function () {
        var SomeClass,
            context,
            bean;

        // given
        SomeClass = function (arg1, arg2) {
            this.arg1 = arg1;
            this.arg2 = arg2;
        };

        context = izi.bakeBeans({
            someId: izi.instantiate(SomeClass).withArgs("value1", "value2")
        });

        // when
        bean = context.getBean("someId");

        // when/then
        expect(bean.arg1).toEqual("value1");
        expect(bean.arg2).toEqual("value2");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should instantiate singleton", function () {
        var SingletonClass,
            context,
            instantiated = 0;

        // given
        SingletonClass = function () {
            instantiated = instantiated + 1;
        };

        // when
        context = izi.bakeBeans({
            someId: izi.instantiate(SingletonClass)
        });

        // then
        expect(instantiated).toEqual(1);
        context.getBean("someId");
        context.getBean("someId");
        expect(instantiated).toEqual(1);

    }); // -------------------------------------------------------------------------------------------------------------

    it("Should not instantiate lazy singleton after context creation", function () {
        var LazySingletonClass,
            context,
            instantiated = 0;

        // given
        LazySingletonClass = function () {
            instantiated = instantiated + 1;
        };

        // when
        context = izi.bakeBeans({
            someId: izi.lazy(LazySingletonClass)
        });

        // then
        expect(instantiated).toEqual(0);
        context.getBean(LazySingletonClass);
        context.getBean(LazySingletonClass);
        expect(instantiated).toEqual(1);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should not instantiate prototype after context creation", function () {
        var PrototypeClass,
            context,
            instantiated = 0;

        // given
        PrototypeClass = function () {
            instantiated = instantiated + 1;
        };

        // when
        context = izi.bakeBeans({
            someId: izi.protoOf(PrototypeClass)
        });

        // then
        expect(instantiated).toEqual(0);
        context.getBean(PrototypeClass);
        context.getBean("someId");
        expect(instantiated).toEqual(2);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should call iziInit and iziContext methods for singleton", function () {
        var SomeClass, context,
            iziContextCalled = null,
            iziInitCalled = null,
            iziInitCounter = 0,
            iziContextCounter = 0;

        // given
        SomeClass = function () {
            this.dependency = izi.inject("dependency");

            this.iziInit = function () {
                iziInitCalled = this.dependency;
                iziInitCounter++;
            };

            this.iziContext = function (context) {
                iziContextCalled = context;
                iziContextCounter++;
            };
        };

        // when
        context = izi.bakeBeans({
            someId: izi.instantiate(SomeClass),
            dependency: "dependency"
        });
        context.getBean('someId');
        context.getBean('someId');

        // then
        expect(iziContextCalled).toBe(context);
        expect(iziInitCalled).toEqual("dependency");
        expect(iziInitCounter).toBe(1);
        expect(iziContextCounter).toBe(1);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should not call iziInit and iziContext methods for lazy singleton", function () {
        var SomeClass, context,
            iziContextCalled = null,
            iziInitCalled = null,
            iziInitCounter = 0,
            iziContextCounter = 0;

        // given
        SomeClass = function () {
            this.dependency = izi.inject("dependency");

            this.iziInit = function () {
                iziInitCalled = this.dependency;
                iziInitCounter++;
            };

            this.iziContext = function (context) {
                iziContextCalled = context;
                iziContextCounter++;
            };
        };

        // when
        context = izi.bakeBeans({
            someId: izi.lazy(SomeClass),
            dependency: "dependency"
        });

        // then
        expect(iziContextCalled).toBeNull();
        expect(iziInitCalled).toBeNull();

        context.getBean("someId");
        expect(iziContextCalled).toBe(context);
        expect(iziInitCalled).toBe("dependency");

        context.getBean("someId");
        context.getBean("someId");
        expect(iziInitCounter).toBe(1);
        expect(iziContextCounter).toBe(1);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should not call iziInit and iziContext methods for prototypes", function () {
        var SomeClass, context,
            iziContextCalled = null,
            iziInitCalled = null,
            iziInitCounter = 0,
            iziContextCounter = 0;

        // given
        SomeClass = function () {
            this.dependency = izi.inject("dependency");

            this.iziInit = function () {
                iziInitCalled = this.dependency;
                iziInitCounter++;
            };

            this.iziContext = function (context) {
                iziContextCalled = context;
                iziContextCounter++;
            };
        };

        // when
        context = izi.bakeBeans({
            someId: izi.protoOf(SomeClass),
            dependency: "dependency"
        });

        // then
        expect(iziContextCalled).toBeNull();
        expect(iziInitCalled).toBeNull();

        context.getBean("someId");
        expect(iziContextCalled).toBe(context);
        expect(iziInitCalled).toEqual("dependency");

        context.getBean("someId");
        expect(iziInitCounter).toBe(2);
        expect(iziContextCounter).toBe(2);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should call iziInit and iziContext methods for instantiated beans", function () {
        var SomeClass, context,
            iziContextCalled = null,
            iziInitCalled = null,
            iziInitCounter = 0,
            iziContextCounter = 0;

        // given
        SomeClass = function () {
            this.dependency = izi.inject("dependency");

            this.iziInit = function () {
                iziInitCalled = this.dependency;
                iziInitCounter++;
            };

            this.iziContext = function (context) {
                iziContextCalled = context;
                iziContextCounter++;
            };
        };

        // when
        context = izi.bakeBeans({
            someId: new SomeClass(),
            dependency: "dependency"
        });
        context.getBean('someId');
        context.getBean('someId');

        // then
        expect(iziContextCalled).toBe(context);
        expect(iziInitCalled).toEqual("dependency");
        expect(iziInitCounter).toBe(1);
        expect(iziContextCounter).toBe(1);
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should merge multiple contexts", function () {
        var config1 = {
            bean1: "Bean 1 value"
        };
        var config2 = {
            bean2: "Bean 2 value"
        };

        var context = izi.bakeBeans([config1, config2]);
        expect(context.getBean("bean1")).toBe("Bean 1 value");
        expect(context.getBean("bean2")).toBe("Bean 2 value");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should merge multiple contexts and create with parent context", function () {
        var parentContext = izi.bakeBeans({
            parentBean: "Parent value"
        });
        var config1 = {
            bean1: "Bean 1 value"
        };
        var config2 = {
            bean2: "Bean 2 value"
        };

        var context = izi.bakeBeans([config1, config2], parentContext);
        expect(context.getBean("bean1")).toBe("Bean 1 value");
        expect(context.getBean("bean2")).toBe("Bean 2 value");
        expect(context.getBean("parentBean")).toBe("Parent value");
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should throw an error when beans are duplicated", function () {
        var config1 = {
            bean1: "Bean 1 value"
        };
        var config2 = {
            bean1: "Bean 1 value"
        };

        expect(function () {
            izi.bakeBeans([config1, config2]);
        }).toThrowError('Found duplicated bean ID: "bean1" in multiple configurations');
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should wire dependencies in already instantiated object outside the context", function () {

        // given
        var wasDestroyed = false;
        var context = izi.bakeBeans({
            bean: "Bean value"
        });
        var externalObject = {
            dependency: izi.inject("bean"),
            iziDestroy: function () {
                wasDestroyed = true;
            }
        };

        // when
        context.wire(externalObject);

        // then
        expect(externalObject.dependency).toBe("Bean value");
        context.destroy();
        expect(wasDestroyed).toBeTruthy();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should destroy context and call iziDestroy() on each created bean", function () {

        // given
        var destroyedCounter = 0;
        var context = izi.bakeBeans({
            bean1: {
                iziDestroy: function () {
                    destroyedCounter++;
                    throw new Error("There might be thrown an error");
                }
            },
            bean2: {
                iziDestroy: function () {
                    destroyedCounter++;
                }
            },
            bean3: {}
        });

        // when
        var result = context.destroy();

        // then
        expect(destroyedCounter).toBe(2);
        expect(result).toBeTruthy();
        try {
            context.getBean("bean1")
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("No bean matched: bean1");
        }
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should stop destroying context when exception thrown in iziPreDestroy()", function () {

        // given
        var destroyedCounter = 0;
        var context = izi.bakeBeans({
            bean: {
                iziPreDestroy: function () {
                    throw new Error("Please don't kill me!");
                },
                iziDestroy: function () {
                    destroyedCounter++;
                }
            }
        });

        // when
        var result = context.destroy();

        // then
        expect(destroyedCounter).toBe(0);
        expect(result).toBeFalsy();
        expect(context.getBean("bean")).toBeDefined();
    }); // -------------------------------------------------------------------------------------------------------------


    it("Should destroy also all descendant contexts", function () {

        // given
        var destroyedBeansChain = "";
        var parentContext = izi.bakeBeans({
            parentBean: {
                iziDestroy: function () {
                    destroyedBeansChain += "1";
                }
            }
        });
        var childContext1 = izi.bakeBeans({
            childBean1: {
                iziDestroy: function () {
                    destroyedBeansChain += "2";
                }
            }
        }, parentContext);
        var childContext2 = izi.bakeBeans({
            childBean2: {
                iziDestroy: function () {
                    destroyedBeansChain += "3";
                }
            }
        }, childContext1);

        // when
        var result = parentContext.destroy();

        // then
        expect(destroyedBeansChain).toBe("321");
        expect(result).toBeTruthy();

        try {
            parentContext.getBean("parentBean");
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("No bean matched: parentBean");
        }

        try {
            childContext1.getBean("childBean1");
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("No bean matched: childBean1");
        }

        try {
            childContext2.getBean("childBean2");
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("No bean matched: childBean2");
        }
    }); // -------------------------------------------------------------------------------------------------------------

    it("Should stop destroying when any child context throws exception in iziPreDestroy", function () {

        // given
        var destroyedBeansChain = "";
        var parentContext = izi.bakeBeans({
            parentBean: {
                iziDestroy: function () {
                    destroyedBeansChain += "1";
                }
            }
        });
        var childContext1 = izi.bakeBeans({
            childBean1: {
                iziDestroy: function () {
                    destroyedBeansChain += "2";
                }
            }
        }, parentContext);
        var childContext2 = izi.bakeBeans({
            childBean2: {
                iziDestroy: function () {
                    destroyedBeansChain += "3";
                },
                iziPreDestroy: function () {
                    throw new Error("Please don't kill me!");
                }
            }
        }, childContext1);

        // when
        var result = parentContext.destroy();

        // then
        expect(destroyedBeansChain).toBe("");
        expect(result).toBeFalsy();

        expect(parentContext.getBean("parentBean")).toBeDefined();
        expect(childContext1.getBean("childBean1")).toBeDefined();
        expect(childContext2.getBean("childBean2")).toBeDefined();
    }); // -------------------------------------------------------------------------------------------------------------

    it("Shouldn't use not own properties when creates context", function () {

        // given
        var ContextClass = function () {
            this.ownBean = {};
        };
        ContextClass.prototype.beanOnPrototype = {};

        // when
        var context = izi.bakeBeans(new ContextClass());

        // then
        expect(context.getBean("ownBean")).toBeDefined();

        try {
            context.getBean("beanOnPrototype");
            fail("Exception not thrown");
        } catch (e) {
            expect(e.message).toBe("No bean matched: beanOnPrototype");
        }
    }); // -------------------------------------------------------------------------------------------------------------

});