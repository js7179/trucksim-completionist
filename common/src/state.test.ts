import { STATE_ACTION, StateUpdate, compareObjectiveObjects, doStateUpdate, generateStateTemplate, resetObjective } from "./state";
import { AchievementInfo, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, ObjectiveState, SequentialObjectiveInfo } from "./types";

describe("generateStateTemplate", () => {
    it("empty achievement list", () => {
        const input: AchievementInfo[] = [];
        const output: AchievementStateList = {};

        expect(generateStateTemplate(input)).toStrictEqual(output);
    });

    it("empty slate, one achievement, no objectives", () => {
        const input: AchievementInfo[] = [
            { id: "foo", name: "", desc: "", objectives: [], icons: { incomplete: "", completed: "" } }
        ];

        const output: AchievementStateList = {
            foo: { completed: false, objectives: {} }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it("empty slate, two achievements, no objectives", () => {
        const input: AchievementInfo[] = [
            { id: "foo", name: "", desc: "", objectives: [], icons: { incomplete: "", completed: "" } },
            { id: "bar", name: "", desc: "", objectives: [], icons: { incomplete: "", completed: "" } }
        ];
        const output: AchievementStateList = {
            foo: { completed: false, objectives: {} },
            bar: { completed: false, objectives: {} }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it("empty slate, one achievement, all objectives", () => {
        const input: AchievementInfo[] = [
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

        const output: AchievementStateList = {
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
        const input: AchievementInfo[] = [
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
        const input: AchievementInfo[] = [
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

        const output: AchievementStateList = {
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
        const oldObjective: ObjectiveState = {};
        expect(resetObjective(oldObjective)).toMatchObject({});
    });
    
    it("number and array", () => {
        const oldObjective: ObjectiveState = {
            foo: ["abc", "def", "ghi", "jkl"],
            bar: 5
        };
        const newObjective: ObjectiveState = {
            foo: [],
            bar: 0
        };
        expect(resetObjective(oldObjective)).toMatchObject(newObjective);
    });
});

describe("compareObjectiveObjects", () => {
    it("empty case", () => {
        const newState: ObjectiveState = {};
        const goalState: ObjectiveState = {};

        expect(compareObjectiveObjects(goalState, newState)).toBeTruthy();
    });

    it("all objectives, false", () => {
        const newState: ObjectiveState = { foo: 4, bar: ["abc"] };
        const goalState: ObjectiveState = { foo: 5, bar: ["abc"] };

        expect(compareObjectiveObjects(goalState, newState)).toBeFalsy();
    });

    it("all objectives, true", () => {
        const newState: ObjectiveState = { foo: 5, bar: ["abc", "def"] };
        const goalState: ObjectiveState = { foo: 5, bar: ["def", "abc"] };

        expect(compareObjectiveObjects(goalState, newState)).toBeTruthy();
    });

    it("list objective, false", () => {
        const newState: ObjectiveState = { foo: ["abc"] };
        const goalState: ObjectiveState = { foo: ["def", "abc"] };

        expect(compareObjectiveObjects(goalState, newState)).toBeFalsy();
    });
});

describe("doStateUpdate", () => {
    it("mark achievement complete", () => {
        const oldState: AchievementStateList = { 
            foo: { completed: false, objectives: {} }
        };
        const goalState: AchievementStateList = {
            foo: { completed: true, objectives: {} }
        };
        const action: StateUpdate = {
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: "foo",
            shouldMarkOff: true
        };

        const output: AchievementStateList = {
            foo: { completed: true, objectives: {} }
        };

        expect(doStateUpdate(oldState, goalState, action)).toMatchObject(output);
    });

    it("set numerical, non-cascade", () => {
        const oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: 3
                }
            }
        };
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 4
        };

        const newState: AchievementStateList = doStateUpdate(oldState, goalState, action);

        expect(newState["foo"].objectives["bar"]).toBe<number>(4);
        expect(newState["foo"].completed).toBeFalsy();
    });

    it("toggle ON list item, non-cascade", () => {
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "xyz"]
                }
            }
        };
        const oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: ["xyz"]
                }
            }
        };
        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            subobjID: "def",
            shouldMarkOff: true
        };

        const outputState = doStateUpdate(oldState, goalState, action);
        const outputArr = outputState["foo"].objectives["bar"] as string[];

        expect(outputArr.includes("def")).toBeTruthy();
        expect(outputState["foo"].completed).toBeFalsy();
    });

    it("toggle OFF list item, non-cascade", () => {
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "xyz"]
                }
            }
        };
        const oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: ["xyz", "def"]
                }
            }
        };
        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM,
            achID: "foo",
            objID: "bar",
            subobjID: "def",
            shouldMarkOff: false
        };

        const outputState = doStateUpdate(oldState, goalState, action);
        const outputArr = outputState["foo"].objectives["bar"] as string[];
        
        expect(outputArr.includes("def")).toBeFalsy();
        expect(outputState["foo"].completed).toBeFalsy();
    });

    it("set numeric, objectives satisfied", () => {
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        const oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: 4
                }
            }
        };

        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 5
        };

        const outputState = doStateUpdate(oldState, goalState, action);
        expect(outputState["foo"].completed).toBeTruthy();
        expect(outputState["foo"].objectives["bar"]).toBe<number>(5);
    });

    it("set numeric, objectives no longer satisfied", () => {
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        const oldState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };

        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar",
            n: 4
        };

        const outputState = doStateUpdate(oldState, goalState, action);
        expect(outputState["foo"].completed).toBeFalsy();
        expect(outputState["foo"].objectives["bar"]).toBe<number>(4);
    });

    it("unmark achievement complete, cascade objective reset", () => {
        const oldState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "ghi"],
                    baz: 5
                }
            }
        };
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["abc", "def", "ghi"],
                    baz: 5
                }
            }
        }
        const action: StateUpdate = {
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: "foo",
            shouldMarkOff: false
        };
        
        const endState: AchievementStateList = {
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

    const emptyState: AchievementStateList = {};

    // error states
    it("missing objID", () => {
        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);

        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "objID" in doStateUpdate`);
    });

    it("unknown action type", () => {
        const action: StateUpdate = {
            type: "foo",
            achID: "bar"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);

        expect(t).toThrow(Error);
        expect(t).toThrow(`Unknown action "foo"`);
    });

    it("mark achievement, missing shouldMarkOff", () => {
        const action: StateUpdate = {
            type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK,
            achID: "foo",
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "shouldMarkOff" in doStateUpdate`);
    });

    it("set numerical, missing n", () => {
        const action: StateUpdate = {
            type: STATE_ACTION.OBJ_SET_NUMERICAL,
            achID: "foo",
            objID: "bar"
        };

        const t = () => doStateUpdate(emptyState, emptyState, action);
        expect(t).toThrow(Error);
        expect(t).toThrow(`Missing "n" in doStateUpdate`);
    });

    it("set numerical, negative n", () => {
        const action: StateUpdate = {
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
        const oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: 4
                }
            }
        };
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: 5
                }
            }
        };
        const action: StateUpdate = {
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
        const action: StateUpdate = {
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
        const action: StateUpdate = {
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
        const goalState: AchievementStateList = {
            foo: {
                completed: true,
                objectives: {
                    bar: ["a", "b", "c"]
                }
            }
        };
        const oldState: AchievementStateList = {
            foo: {
                completed: false,
                objectives: {
                    bar: []
                }
            }
        };
        const action: StateUpdate = {
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