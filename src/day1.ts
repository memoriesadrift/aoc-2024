import { A } from '@mobily/ts-belt'
import { getInput } from "./utils.js"

const part1 = async () => {
        const lines = await getInput(1, false)
        const pairs = lines.map((line) =>
                line.split(' ')
                        .map(it => it.trim())
                        .filter(it => it != '')
                        .map(it => Number.parseInt(it))
        )
        const lists: [number[], number[]] = pairs.reduce<[number[], number[]]>((acc, curr) => {
                return [[...acc[0], curr[0]], [...acc[1], curr[1]]]
        }, [[], []])

        lists[0] = lists[0].sort()
        lists[1] = lists[1].sort()

        let count = 0
        for (let i = 0; i < lists[0].length; i++) {
                count += Math.abs(lists[0][i] - lists[1][i])
        }
        return count
}

const part2 = async () => {
        const lines = await getInput(1, false)
        const pairs = lines.map((line) =>
                line.split(' ')
                        .map(it => it.trim())
                        .filter(it => it != '')
                        .map(it => Number.parseInt(it))
        )
        const lists: [number[], number[]] = pairs.reduce<[number[], number[]]>((acc, curr) => {
                return [[...acc[0], curr[0]], [...acc[1], curr[1]]]
        }, [[], []])

        lists[0] = lists[0].sort()
        lists[1] = lists[1].sort()

        // I still can't believe js doesn't have Array.uniq
        const counts = A.uniq(lists[0])
                .map((it) => ({ [it]: 0 }))
                .reduce((acc, curr) => ({ ...acc, ...curr }))
        const tests = lists[1]
        tests.forEach((n) => {
                if (typeof counts[n] === 'number') {
                        counts[n] += 1
                }
        })
        return lists[0].map((n) => n * (counts[n] ? counts[n] : 0))
                .reduce((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1())
console.log('Part 2: ', await part2())
