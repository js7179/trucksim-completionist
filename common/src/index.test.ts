import { generateStateTemplate } from "./index";
import { AchievementInfo, AchievementStateList } from "./types";

describe('generateStateTemplate', () => {
    it('empty achievement list', () => {
        const input: AchievementInfo[] = [];
        const output: AchievementStateList = {};

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it('one achievement, no objectives', () => {
        const input: AchievementInfo[] = [
            {
                desc: "",
                icons: { completed: "", incomplete: "" },
                id: "foo",
                name: "",
                objectives: []
            }
        ];

        const output: AchievementStateList = {
            foo: { "completed": false, "objectives": {} }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });

    it('two achievement, no objectives', () => {
        const input: AchievementInfo[] = [
            {
                desc: "",
                icons: { completed: "", incomplete: "" },
                id: "foo",
                name: "",
                objectives: []
            },
            {
                desc: "",
                icons: { completed: "", incomplete: "" },
                id: "bar",
                name: "",
                objectives: []
            }
        ];

        const output: AchievementStateList = {
            foo: { "completed": false, "objectives": {} },
            bar: { "completed": false, "objectives": {} }
        };

        expect(generateStateTemplate(input, true)).toStrictEqual(output);
    });
});