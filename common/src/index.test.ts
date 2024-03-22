import { generateDefaultState } from "./index";
import { AchievementInfo, AchievementStateList } from "./types";

describe('generateDefaultState', () => {
    it('empty achievement list', () => {
        const input: AchievementInfo[] = [];
        const output: AchievementStateList = {};

        expect(generateDefaultState(input)).toStrictEqual(output);
    });

    it('one achievement', () => {
        const input: AchievementInfo[] = [
            {
                desc: "",
                icons: { completed: "", incomplete: "" },
                id: "foo",
                name: ""
            }
        ];

        const output: AchievementStateList = {
            foo: { "completed": false }
        };

        expect(generateDefaultState(input)).toStrictEqual(output);
    });

    it('two achievement', () => {
        const input: AchievementInfo[] = [
            {
                desc: "",
                icons: { completed: "", incomplete: "" },
                id: "foo",
                name: ""
            },
            {
                desc: "",
                icons: { completed: "", incomplete: "" },
                id: "bar",
                name: ""
            }
        ];

        const output: AchievementStateList = {
            foo: { "completed": false },
            bar: { "completed": false }
        };

        expect(generateDefaultState(input)).toStrictEqual(output);
    });
});