import { STATE_ACTION, StateUpdate, compareObjectiveObjects, doStateUpdate, generateStateTemplate, resetObjective } from "./state";
import { AchievementInfo, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, ObjectiveState, SequentialObjectiveInfo } from "./types";

describe("generateStateTemplate", () => {
    it("empty achievement list", () => {
        let input: AchievementInfo[] = [];
        let output: AchievementStateList = {};

        expect(generateStateTemplate(input)).toStrictEqual(output);
    });

    it("empty slate, one achievement, no objectives", () => {
        let input: AchievementInfo[] = [
            { id: "foo", name: "", desc: "", objectives: [], icons: { incomplete: "", completed: "" } }
        ];

        let output: AchievementStateList = {
            foo: { completed: false, objectives: {} }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it("empty slate, two achievements, no objectives", () => {
        let input: AchievementInfo[] = [
            { id: "foo", name: "", desc: "", objectives: [], icons: { incomplete: "", completed: "" } },
            { id: "bar", name: "", desc: "", objectives: [], icons: { incomplete: "", completed: "" } }
        ];
        let output: AchievementStateList = {
            foo: { completed: false, objectives: {} },
            bar: { completed: false, objectives: {} }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it("empty slate, one achievement, all objectives", () => {
        let input: AchievementInfo[] = [
            {
                id: "foo",
                name: "",
                desc: "",
                icons: { incomplete: "", completed: "" }, 
                objectives: [
                    {
                        objid: "a",
                        type: "list",
                        values: [{ subobjid: "foo", display: "foo" }]
                    } as ListObjectiveInfo,
                    {
                        objid: "b",
                        type: "counter",
                        display: "",
                        goal: 5
                    } as CounterObjectiveInfo,
                    {
                        objid: "c",
                        type: "sequential",
                        values: [{ subobjid: "foo", display: "foo" }, { subobjid: "bar", display: "bar" }]
                    } as SequentialObjectiveInfo
                ]
            }
        ];

        let output: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    a: [],
                    b: 0,
                    c: 0
                }
            }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it("unknown objective type error", () => {
        let input: AchievementInfo[] = [
            {
                id: "foo",
                name: "",
                desc: "",
                icons: { incomplete: "", completed: "" }, 
                objectives: [
                    {
                        objid: "a",
                        type: "error",
                    },
                ]
            }
        ];
        const t = () => {
            generateStateTemplate(input, true);
        }

        expect(t).toThrow(Error);
        expect(t).toThrow('Unknown objective type "error"');        
    });

    it("goal state, one achievement, all objectives", () => {
        let input: AchievementInfo[] = [
            {
                id: "foo",
                name: "",
                desc: "",
                icons: { incomplete: "", completed: "" }, 
                objectives: [
                    {
                        objid: "a",
                        type: "list",
                        values: [{ subobjid: "foo", display: "foo" }, { subobjid: "bar", display: "bar" }]
                    } as ListObjectiveInfo,
                    {
                        objid: "b",
                        type: "counter",
                        display: "",
                        goal: 5
                    } as CounterObjectiveInfo,
                    {
                        objid: "c",
                        type: "sequential",
                        values: [{ subobjid: "foo", display: "foo" }, { subobjid: "bar", display: "bar" }]
                    } as SequentialObjectiveInfo
                ]
            }
        ];

        let output: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    a: ["foo", "bar"],
                    b: 5,
                    c: 2
                }
            }
        };

        expect(generateStateTemplate(input, false)).toStrictEqual(output);
    });
});

describe("resetObjective", () => {
    it("empty case", () => {
        let oldObjective: ObjectiveState = {};
        expect(resetObjective(oldObjective)).toMatchObject({});
    });
    
    it("number and array", () => {
        let oldObjective: ObjectiveState = {
            foo: ["abc", "def", "ghi", "jkl"],
            bar: 5
        };
        let newObjective: ObjectiveState = {
            foo: [],
            bar: 0
        };
        expect(resetObjective(oldObjective)).toMatchObject(newObjective);
    });
});

describe("compareObjectiveObjects", () => {
    it("empty case", () => {
        let newState: ObjectiveState = {};
        let goalState: ObjectiveState = {};

        expect(compareObjectiveObjects(goalState, newState)).toBeTruthy();
    });

    it("all objectives, false", () => {
        let newState: ObjectiveState = { foo: 4, bar: ["abc"] };
        let goalState: ObjectiveState = { foo: 5, bar: ["abc"] };

        expect(compareObjectiveObjects(goalState, newState)).toBeFalsy();
    });

    it("all objectives, true", () => {
        let newState: ObjectiveState = { foo: 5, bar: ["abc", "def"] };
        let goalState: ObjectiveState = { foo: 5, bar: ["def", "abc"] };

        expect(compareObjectiveObjects(goalState, newState)).toBeTruthy();
    });

    it("list objective, false", () => {
        let newState: ObjectiveState = { foo: ["abc"] };
        let goalState: ObjectiveState = { foo: ["def", "abc"] };

        expect(compareObjectiveObjects(goalState, newState)).toBeFalsy();
    });
});

describe("doStateUpdate", () => {
    it("mark achievement complete", () => {
        let oldState: AchievementStateList = { 
            foo: { completed: false, objectives: {} }
        };
        let goalState: AchievementStateList = {
            foo: { completed: true, objectives: {} }
        };
        let action: StateUpdate = {
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: "foo",
            shouldMarkOff: true
        };

        let output: AchievementStateList = {
            foo: { completed: true, objectives: {} }
        };

        expect(doStateUpdate(oldState, goalState, action)).toMatchObject(output);
    });

    it("set numerical, non-cascade", () => {
        let oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: 3
                }
            }
        };
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 4
        };

        let newState: AchievementStateList = doStateUpdate(oldState, goalState, action);

        expect(newState["foo"].objectives["bar"]).toBe<number>(4);
        expect(newState["foo"].completed).toBeFalsy();
    });

    it("toggle ON list item, non-cascade", () => {
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "xyz"]
                }
            }
        };
        let oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: ["xyz"]
                }
            }
        };
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            subobjID: "def",
            shouldMarkOff: true
        };

        let outputState = doStateUpdate(oldState, goalState, action);
        let outputArr = outputState["foo"].objectives["bar"] as string[];

        expect(outputArr.includes("def")).toBeTruthy();
        expect(outputState["foo"].completed).toBeFalsy();
    });

    it("toggle OFF list item, non-cascade", () => {
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "xyz"]
                }
            }
        };
        let oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: ["xyz", "def"]
                }
            }
        };
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            subobjID: "def",
            shouldMarkOff: false
        };

        let outputState = doStateUpdate(oldState, goalState, action);
        let outputArr = outputState["foo"].objectives["bar"] as string[];
        
        expect(outputArr.includes("def")).toBeFalsy();
        expect(outputState["foo"].completed).toBeFalsy();
    });

    it("set numeric, objectives satisfied", () => {
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        let oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: 4
                }
            }
        };

        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 5
        };

        let outputState = doStateUpdate(oldState, goalState, action);
        expect(outputState["foo"].completed).toBeTruthy();
        expect(outputState["foo"].objectives["bar"]).toBe<number>(5);
    });

    it("set numeric, objectives no longer satisfied", () => {
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        let oldState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };

        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 4
        };

        let outputState = doStateUpdate(oldState, goalState, action);
        expect(outputState["foo"].completed).toBeFalsy();
        expect(outputState["foo"].objectives["bar"]).toBe<number>(4);
    });

    it("unmark achievement complete, cascade objective reset", () => {
        let oldState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "ghi"],
                    baz: 5
                }
            }
        };
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "ghi"],
                    baz: 5
                }
            }
        }
        let action: StateUpdate = {
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: "foo",
            shouldMarkOff: false
        };
        
        let endState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: [],
                    baz: 0
                }
            }
        }
        expect(doStateUpdate(oldState, goalState, action)).toMatchObject(endState);
    });

    let emptyState: AchievementStateList = {};

    // error states
    it("missing objID", () => {
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);

        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "objID" in doStateUpdate`);
    });

    it("unknown action type", () => {
        let action: StateUpdate = {
            type: "foo",
            achID: "bar"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);

        expect(t).toThrow(Error);
        expect(t).toThrow(`Unknown action "foo"`);
    });

    it("mark achievement, missing shouldMarkOff", () => {
        let action: StateUpdate = {
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: "foo",
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "shouldMarkOff" in doStateUpdate`);
    });

    it("set numerical, missing n", () => {
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "n" in doStateUpdate`);
    });

    it("set numerical, negative n", () => {
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: -1
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`"n" cannot be negative`);
    });

    it("set numerical, n greater than goal", () => {
        let oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: 4
                }
            }
        };
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 6
        };

        const t = () => doStateUpdate(oldState, goalState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`"n" cannot be greater than goal state n`);
    });

    it("toggle list item, missing subobjid", () => {
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            shouldMarkOff: false
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "subobjID" in doStateUpdate`);
    });

    it("toggle list item, missing shouldMarkOff", () => {
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            subobjID: "baz"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "shouldMarkOff" in doStateUpdate`);
    });

    it("toggle list item, subobjID does not exist", () => {
        let goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["a", "b", "c"]
                }
            }
        };
        let oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: []
                }
            }
        };
        let action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            subobjID: "x",
            shouldMarkOff: true
        };

        const t = () => doStateUpdate(oldState, goalState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`subobjID given does not exist`);
    });
});