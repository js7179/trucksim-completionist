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
        let a: string[] = [];
        let b: string[] = [];
        expect(isNonorderedArrayEqual(a, b)).toBeTruthy();
    });

    it("one string element true", () => {
        let a = ["foo"];
        let b = ["foo"];
        expect(isNonorderedArrayEqual(a, b)).toBeTruthy();
    });

    it("one string element false", () => {
        let a = ["foo"];
        let b = ["bar"];
        expect(isNonorderedArrayEqual(a, b)).toBeFalsy();
    });

    it("1,2 array", () => {
        let a = ["foo"];
        let b = ["foo", "bar"];
        expect(isNonorderedArrayEqual(a, b)).toBeFalsy();
    });

    it("2,1 array", () => {
        let a = ["foo", "bar"];
        let b = ["foo"];
        expect(isNonorderedArrayEqual(a, b)).toBeFalsy();
    });

    it("3 array diff order", () => {
        let a = ["bar", "baz", "foo"];
        let b = ["foo", "bar", "baz"];
        expect(isNonorderedArrayEqual(a, b)).toBeTruthy();
    });

    
});

describe("copyChanges", () => {
    
    it("empty object", () => {
        let newCopy = {};
        let oldCopy = {};

        expect(copyChanges(newCopy, oldCopy)).toMatchObject({});
    });

    it("new entry", () => {
        let newCopy = {
            foo: 0,
            bar: 0
        };
        let oldCopy = {
            foo: 2
        };
        
        let output = copyChanges(newCopy, oldCopy);
        
        expect(output).toHaveProperty("foo");
        expect(output).toHaveProperty("bar");
        expect(output["foo"]).toBe<number>(2);
        expect(output["bar"]).toBe<number>(0);
    });

    it("new entry, array", () => {
        let newCopy = {
            foo: [],
            bar: 0
        };
        let oldCopy = {
            foo: ["baz"]
        };

        let output = copyChanges(newCopy, oldCopy);

        expect(output).toHaveProperty("foo");
        expect(output).toHaveProperty("bar");
        expect(output["bar"]).toBe<number>(0);
        expect(output["foo"]).toEqual(expect.arrayContaining(["baz"]));
    });

    it("new entry, object (recurse)", () => {
        let newCopy = {
            foo: {
                bar: 0
            }
        };
        let oldCopy = {
            foo: {
                bar: 2
            }
        };

        let output = copyChanges(newCopy, oldCopy);
        expect(output).toHaveProperty("foo");
        expect(output["foo"]).toHaveProperty("bar");
        expect(output["foo"]["bar"]).toBe<number>(2);
    });
});