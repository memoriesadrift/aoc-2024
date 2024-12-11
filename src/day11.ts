import { getInputAsSingleLine } from "./utils.js"

const blink = (num: number): number[] => {
        if (num == 0) {
                return [1]
        }

        const str = `${num}`
        if (str.length % 2 == 0) {
                return [
                        Number.parseInt(str.slice(0, str.length / 2)),
                        Number.parseInt(str.slice(str.length / 2))
                ]
        }
        return [num * 2024]
}

const blinkNTimes = (nums: number[], n: number) => {
        let counts: Map<number, number> = new Map()

        for (let num of nums) {
                counts.set(num, 1)
        }

        for (let b = 0; b < n; b++) {
                const newCounts = new Map()
                for (const [num, count] of counts.entries()) {
                        const newNums = blink(num)
                        for (const newNum of newNums) {
                                newCounts.set(newNum, (newCounts.get(newNum) || 0) + count)
                        }
                }
                counts = newCounts
        }
        return Array.from(counts.values()).reduce((acc, curr) => acc + curr, 0)
}

const part1 = async (test: boolean) => {
        let nums = (await getInputAsSingleLine(11, test))
                .split(' ')
                .map((it) => Number.parseInt(it))

        return blinkNTimes(nums, 25)
}

const part2 = async (test: boolean) => {
        let nums = (await getInputAsSingleLine(11, test))
                .split(' ')
                .map((it) => Number.parseInt(it))

        return blinkNTimes(nums, 75)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
