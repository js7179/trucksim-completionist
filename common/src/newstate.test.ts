import { generateDefaultAchievementState, isAchievementObjectivesFulfilled, newStateUpdate, STATE_ACTION, StateUpdate, StateUpdateError } from "./state";
import { AchievementInfo, AchievementState, AchievementStateList, CounterObjectiveInfo, ListObjectiveInfo, PartialObjectiveInfo, SequentialObjectiveInfo } from "./types";

const sampleAch: AchievementInfo = { desc: "", icons: { completed: "", incomplete: "" }, id: "sample", name: "", objectives: [] };

const sampleCounterObj: CounterObjectiveInfo = { objid: "co", type: "counter", display: "SampleCounter", goal: 5 };
const sampleListObj: ListObjectiveInfo = { objid: "li", type: "list", values: [ { subobjid: "foo", display: "Foo" }, { subobjid: "bar", display: "Bar" }]};
const sampleSeqObj: SequentialObjectiveInfo = { objid: "se", type: "sequential", values: [ { subobjid: "foo", display: "Foo" }, { subobjid: "bar", display: "Bar" }, { subobjid: "baz", display: "Baz" } ] };
const samplePartialObj: PartialObjectiveInfo = { objid: "pa", type: "partial", count: 2, values: [ { subobjid: "foo", display: "Foo" }, { subobjid: "bar", display: "Bar" }, { subobjid: "baz", display: "Baz" } ] };

const baseSampleOldState: AchievementStateList = { sample: { completed:false, objectives: {} } };
const baseSampleAchList: AchievementInfo[] = [ sampleAch ];

describe("successful state update", () => {
    it("mark no-obj achievement complete", () => {
        const inputOldState: AchievementStateList = baseSampleOldState;
        const inputAchList: AchievementInfo[] = baseSampleAchList;
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample", shouldMarkOff: true };
        
        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);

        const expectedNewState: AchievementStateList = {
            sample: { completed: true, objectives: {} }
        };

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(1);
        expect(rowsChanged[0]).toBe(`sample.completed`);
    });

    it("mark achievement complete, with objective", () => {
        const inputOldState: AchievementStateList = {
            sample: { completed: false, objectives: {
                co: 0,
                li: [],
                se: 0,
                pa: []
            } }
        };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch,
             objectives: [sampleCounterObj, sampleListObj, sampleSeqObj, samplePartialObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample", shouldMarkOff: true };
        
        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);

        const expectedNewState: AchievementStateList = {
            sample: { completed: true, objectives: {
                co: 5,
                li: ["foo", "bar"],
                se: 3,
                pa: ["foo", "bar", "baz"]
            } }
        };

        const expectedRowsChanged = [`sample.completed`, `sample.objectives.co`, `sample.objectives.li`, `sample.objectives.se`, `sample.objectives.pa`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("mark achievement incomplete, with objective", () => {
        const inputOldState: AchievementStateList = {
            sample: { completed: true, objectives: {
                co: 4,
                li: ["foo"],
                se: 1,
                pa: ["bar", "baz"]
            } }
        };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleCounterObj, sampleListObj, sampleSeqObj, samplePartialObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample", shouldMarkOff: false };
        
        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);

        const expectedNewState: AchievementStateList = {
            sample: { completed: false, objectives: {
                co: 0,
                li: [],
                se: 0,
                pa: []
            } }
        };

        const expectedRowsChanged = [`sample.completed`, `sample.objectives.co`, `sample.objectives.li`, `sample.objectives.se`, `sample.objectives.pa`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("mark already-incompleted achievement incomplete, no change", () => {
        const inputOldState: AchievementStateList = {
            sample: { completed: false, objectives: { li: ["foo"] } }
        };
        const inputAchList: AchievementInfo[] = [ { ...sampleAch, objectives: [sampleListObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample", shouldMarkOff: false };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        expect(newState).toMatchObject(inputOldState);
        expect(rowsChanged).toHaveLength(0);
    });

    it("set counter obj w/o completing achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { co: 3 } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleCounterObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co", n: 4 };

        const expectedNewState: AchievementStateList = { sample: { completed: false, objectives: { co: 4 } } };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(1);
        expect(rowsChanged[0]).toBe(`sample.objectives.co`);
    });

    it("set counter obj w/ completing achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { co: 4 } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleCounterObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co", n: 5 };

        const expectedNewState: AchievementStateList = { sample: { completed: true, objectives: { co: 5 } } };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        const expectedRowsChanged = [`sample.completed`, `sample.objectives.co`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("set counter obj, unmarking achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: true, objectives: { co: 5 } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleCounterObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co", n: 4 };

        const expectedNewState: AchievementStateList = { sample: { completed: false, objectives: { co: 4 } } };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        const expectedRowsChanged = [`sample.completed`, `sample.objectives.co`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("set sequential obj w/o completing achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { se: 0 } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleSeqObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "se", n: 3 };

        const expectedNewState: AchievementStateList = { sample: { completed: true, objectives: { se: 3 } } };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        const expectedRowsChanged = [`sample.completed`, `sample.objectives.se`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("set counter obj, no change", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { co: 3 } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleCounterObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co", n: 3 };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        expect(newState).toMatchObject(inputOldState);
        expect(rowsChanged).toHaveLength(0);
    });

    it("mark list item w/o completing achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { li: [] } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleListObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", subobjID: "foo", shouldMarkOff: true };

        const expectedNewState: AchievementStateList = { sample: { completed: false, objectives: { li: ["foo"] } } };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(1);
        expect(rowsChanged[0]).toBe(`sample.objectives.li`);
    });

    it("mark list item w/ completing achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { li: ["foo"] } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleListObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", subobjID: "bar", shouldMarkOff: true };

        const expectedNewState: AchievementStateList = { sample: { completed: true, objectives: { li: ["foo", "bar"] } } };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        const expectedRowsChanged = [`sample.completed`, `sample.objectives.li`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("unmark list item, unmarking achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: true, objectives: { li: ["foo", "bar"] } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleListObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", subobjID: "bar", shouldMarkOff: false };
        
        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        const expectedNewState: AchievementStateList = { sample: { completed: false, objectives: { li: ["foo"] } } };
        const expectedRowsChanged = [`sample.completed`, `sample.objectives.li`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });

    it("unmark list item, no-change", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { li: ["foo"] } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [sampleListObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", subobjID: "bar", shouldMarkOff: false };
        
        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);
        
        expect(newState).toMatchObject(inputOldState);
        expect(rowsChanged).toHaveLength(0);
    });

    it("mark partial off, complete achievement", () => {
        const inputOldState: AchievementStateList = { sample: { completed: false, objectives: { pa: ["foo"] } } };
        const inputAchList: AchievementInfo[] = [ 
            {...sampleAch, 
             objectives: [samplePartialObj]
            } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "pa", subobjID: "baz", shouldMarkOff: true };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);

        const expectedNewState: AchievementStateList = { sample: { completed: true, objectives: { pa: ["foo", "baz"] } } };
        const expectedRowChanged = [`sample.completed`, `sample.objectives.pa`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowChanged));
    });

    it("tolerate missing ach in statedata", () => {
        const inputOldState: AchievementStateList = {};
        const inputAchList: AchievementInfo[] = [
            {...sampleAch, objectives: [sampleCounterObj, sampleSeqObj] }
        ];
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample", shouldMarkOff: true };

        const { newState, rowsChanged } = newStateUpdate(inputOldState, inputAchList, inputAction);

        const expectedNewState: AchievementStateList = { sample: { completed: true, objectives: { co: 5, se: 3 } } };
        const expectedRowsChanged = [`sample.completed`, `sample.objectives.co`, `sample.objectives.se`];

        expect(newState).toMatchObject(expectedNewState);
        expect(rowsChanged).toHaveLength(expectedRowsChanged.length);
        expect(rowsChanged).toEqual(expect.arrayContaining(expectedRowsChanged));
    });
});

describe("state update errors", () => {
    it("general, missing type in action", () => {
        const inputOldState = baseSampleOldState, inputAchList = baseSampleAchList;
        const inputAction: Partial<StateUpdate> = { achID: "sample" };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction as StateUpdate)).toThrow(StateUpdateError);
    });

    it("general, missing achID in action", () => {
        const inputOldState = baseSampleOldState, inputAchList = baseSampleAchList;
        const inputAction: Partial<StateUpdate> = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction as StateUpdate)).toThrow(StateUpdateError);
    });

    it("general, unknown action type", () => {
        const inputOldState = baseSampleOldState, inputAchList = baseSampleAchList;
        const inputAction: StateUpdate = { type: "blaaaaaaaaaa", achID: "sample" };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("general, missing objid", () => {
        const inputOldState = baseSampleOldState, inputAchList = baseSampleAchList;
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample" };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("general, missing achievement", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList: AchievementInfo[] = [];
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample", shouldMarkOff: true };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("mark no-obj achievement complete, missing shouldMarkOff", () => {
        const inputOldState = baseSampleOldState, inputAchList = baseSampleAchList;
        const inputAction: StateUpdate = { type: STATE_ACTION.ACHIEVEMENT_COMPLETE_MARK, achID: "sample" };
        
        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("set numerical, unknown objid", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleCounterObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "blablafoobar", n: 3 };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("set numerical, invalid action", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleListObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "li", n: 5 };
        
        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("set numerical, missing n", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleCounterObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co" };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("set numerical, negative n", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleCounterObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co", n: -1 };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("set numerical, n exceeds goal", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleCounterObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_SET_NUMERICAL, achID: "sample", objID: "co", n: Infinity };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("mark list, missing subobjID", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleListObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", shouldMarkOff: true };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("mark list, missing shouldMarkOff", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleListObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", subobjID: "foo" };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("mark list, invalid objid", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleListObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "blablablabla", subobjID: "foo", shouldMarkOff: true };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("mark list, wrong action type", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleCounterObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "co", subobjID: "foo", shouldMarkOff: true };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });

    it("mark list, invalid subobjid", () => {
        const inputOldState = baseSampleOldState;
        const inputAchList = [ { ...sampleAch, objectives: [sampleListObj] } ];
        const inputAction: StateUpdate = { type: STATE_ACTION.OBJ_TOGGLE_LIST_ITEM, achID: "sample", objID: "li", subobjID: "blablablabla", shouldMarkOff: true };

        expect(() => newStateUpdate(inputOldState, inputAchList, inputAction)).toThrow(StateUpdateError);
    });
});

describe("generateDefaultAchievementState", () => {
    it("no-obj achievement", () => {
        const ach: AchievementInfo = sampleAch;

        const expectedState: AchievementState = {
            completed: false,
            objectives: {}
        };

        const defaultState = generateDefaultAchievementState(ach);
        expect(defaultState).toMatchObject(expectedState);
    });

    it("all-obj achievement", () => {
        const ach: AchievementInfo = {...sampleAch, objectives: [sampleCounterObj, sampleListObj, sampleSeqObj, samplePartialObj] };

        const expectedState: AchievementState = {
            completed: false,
            objectives: {
                co: 0,
                li: [],
                se: 0,
                pa: []
            }
        };

        const defaultState = generateDefaultAchievementState(ach);
        expect(defaultState).toMatchObject(expectedState);
    });
});

describe("isAchievementObjectivesFulfilled", () => {
    it("no obj", () => {
        const inputState: AchievementStateList = { sample: { completed: false, objectives: {} } };
        const inputAch: AchievementInfo = sampleAch;

        const result = isAchievementObjectivesFulfilled(inputState, inputAch);
        expect(result).toBeTruthy();
    });

    it("one obj, false", () => {
        const inputState: AchievementStateList = { sample: { completed: false, objectives: { co: 2 } } };
        const inputAch: AchievementInfo = { ...sampleAch, objectives: [sampleCounterObj] };

        const result = isAchievementObjectivesFulfilled(inputState, inputAch);
        expect(result).toBeFalsy();
    });

    it("one obj, true", () => {
        const inputState: AchievementStateList = { sample: { completed: false, objectives: { co: sampleCounterObj.goal } } };
        const inputAch: AchievementInfo = { ...sampleAch, objectives: [sampleCounterObj] };

        const result = isAchievementObjectivesFulfilled(inputState, inputAch);
        expect(result).toBeTruthy();
    });

    it("one obj, another missing, false", () => {
        const inputState: AchievementStateList = { sample: { completed: false, objectives: { co: sampleCounterObj.goal } } };
        const inputAch: AchievementInfo = { ...sampleAch, objectives: [sampleCounterObj, sampleListObj] };

        const result = isAchievementObjectivesFulfilled(inputState, inputAch);
        expect(result).toBeFalsy();
    });

    it("one partial obj, false", () => {
        const inputState: AchievementStateList = { sample: { completed: false, objectives: { pa: ["foo"] } } };
        const inputAch: AchievementInfo = { ...sampleAch, objectives: [samplePartialObj] };

        const result = isAchievementObjectivesFulfilled(inputState, inputAch);
        expect(result).toBeFalsy();
    });

    it("fail on unknown objtype", () => {
        const inputState: AchievementStateList = { sample: { completed: false, objectives: { co : 2 } } };
        const inputAch: AchievementInfo = { ...sampleAch, objectives: [ { objid: "co", type: "nonexistent type" } ] };

        expect(() => isAchievementObjectivesFulfilled(inputState, inputAch)).toThrow(StateUpdateError);
    });
});