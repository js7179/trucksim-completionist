import { clamp, copyChanges, isNonorderedArrayEqual, isPrimitive } from './index';


describe("is primitive", () => {
    it("number", () => {
        expect(isPrimitive(5)).toBeTruthy();
    });

    it("string array", () => {
        expect(isPrimitive(["abc", "def", "ghi"])).toBeFalsy();
    });

    it("object", () => {
        expect(isPrimitive({})).toBeFalsy();
    });
});

describe("clamp", () => {
    it("out of bound lower", () => {
        expect(clamp(2, 1, 4)).toBe<number>(2);
    });

    it("out of bound higher", () => {
        expect(clamp(2, 5, 4)).toBe<number>(4);
    });

    it("within range", () => {
        expect(clamp(2, 3, 4)).toBe<number>(3);
    });
});

describe("isNonorderedArrayEqual", () => {
    it("empty array", () => {
        const a: string[] = [];
        const b: string[] = [];
        expect(isNonorderedArrayEqual(a, b)).toBeTruthy();
    });

    it("one string element true", () => {
        const a = ["foo"];
        const b = ["foo"];
        expect(isNonorderedArrayEqual(a, b)).toBeTruthy();
    });

    it("one string element false", () => {
        const a = ["foo"];
        const b = ["bar"];
        expect(isNonorderedArrayEqual(a, b)).toBeFalsy();
    });

    it("1,2 array", () => {
        const a = ["foo"];
        const b = ["foo", "bar"];
        expect(isNonorderedArrayEqual(a, b)).toBeFalsy();
    });

    it("2,1 array", () => {
        const a = ["foo", "bar"];
        const b = ["foo"];
        expect(isNonorderedArrayEqual(a, b)).toBeFalsy();
    });

    it("3 array diff order", () => {
        const a = ["bar", "baz", "foo"];
        const b = ["foo", "bar", "baz"];
        expect(isNonorderedArrayEqual(a, b)).toBeTruthy();
    });

    
});

describe("copyChanges", () => {
    
    it("empty object", () => {
        const newCopy = {};
        const oldCopy = {};

        expect(copyChanges(newCopy, oldCopy)).toMatchObject({});
    });

    it("new entry", () => {
        const newCopy = {
            foo: 0,
            bar: 0
        };
        const oldCopy = {
            foo: 2
        };
        
        const output = copyChanges(newCopy, oldCopy);
        
        expect(output).toHaveProperty("foo");
        expect(output).toHaveProperty("bar");
        expect(output["foo"]).toBe<number>(2);
        expect(output["bar"]).toBe<number>(0);
    });

    it("new entry, array", () => {
        const newCopy = {
            foo: [],
            bar: 0
        };
        const oldCopy = {
            foo: ["baz"]
        };

        const output = copyChanges(newCopy, oldCopy);

        expect(output).toHaveProperty("foo");
        expect(output).toHaveProperty("bar");
        expect(output["bar"]).toBe<number>(0);
        expect(output["foo"]).toEqual(expect.arrayContaining(["baz"]));
    });

    it("new entry, object (recurse)", () => {
        const newCopy = {
            foo: {
                bar: 0
            }
        };
        const oldCopy = {
            foo: {
                bar: 2
            }
        };

        const output = copyChanges(newCopy, oldCopy);
        expect(output).toHaveProperty("foo");
        expect(output["foo"]).toHaveProperty("bar");
        expect(output["foo"]["bar"]).toBe<number>(2);
    });
});