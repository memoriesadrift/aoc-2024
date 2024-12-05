import { A, pipe, S } from '@mobily/ts-belt'
import { getInput } from "./utils.js"

const part1 = async () => {
        const lines = await getInput(5, false)
        const [rules, updates] = A.partition(lines, (line) => S.includes(line, '|'))
        const ruleMap = pipe(
                rules,
                A.map((rule) => {
                        const [first, second] = rule.split("|")
                        return [Number.parseInt(first), Number.parseInt(second)]
                }),
                A.reduce(new Map<number, number[]>, (acc, [first, second]) => {
                        const existing = acc.get(second) ?? []
                        acc.set(second, [...existing, first])
                        return acc
                })
        )
        const updateList = updates
                .map((update) => pipe(
                        update,
                        S.split(','),
                        A.map((it) => Number.parseInt(it))
                ))
        return updateList.map((update) => {
                const sorted = update.toSorted((a, b) => {
                        if (ruleMap.get(b)?.includes(a)) {
                                return -1
                        } else if (ruleMap.get(a)?.includes(b)) {
                                return 1
                        } else {
                                return 0
                        }
                })
                return { update: sorted, validity: update.every((e, i) => e == sorted[i]) }
        })
                .filter(({ validity }) => validity)
                .map(({ update }) => update[Math.ceil(update.length / 2 - 1)])
                .reduce((acc, curr) => acc + curr, 0)
}

const part2 = async () => {
        const lines = await getInput(5, false)
        const [rules, updates] = A.partition(lines, (line) => S.includes(line, '|'))
        const ruleMap = pipe(
                rules,
                A.map((rule) => {
                        const [first, second] = rule.split("|")
                        return [Number.parseInt(first), Number.parseInt(second)]
                }),
                A.reduce(new Map<number, number[]>, (acc, [first, second]) => {
                        const existing = acc.get(second) ?? []
                        acc.set(second, [...existing, first])
                        return acc
                })
        )
        const updateList = updates
                .map((update) => pipe(
                        update,
                        S.split(','),
                        A.map((it) => Number.parseInt(it))
                ))
        const incorrectUpdates = updateList.map((update) => {
                const sorted = update.toSorted((a, b) => {
                        if (ruleMap.get(b)?.includes(a)) {
                                return -1
                        } else if (ruleMap.get(a)?.includes(b)) {
                                return 1
                        } else {
                                return 0
                        }
                })
                return { update: sorted, validity: update.every((e, i) => e == sorted[i]) }
        })
                .filter(({ validity }) => !validity)

        return incorrectUpdates.map(({ update }) => {
                return update.toSorted((a, b) => {
                        if (ruleMap.get(b)?.includes(a)) {
                                return -1
                        } else if (ruleMap.get(a)?.includes(b)) {
                                return 1
                        } else {
                                return 0
                        }
                })
        })
                .map((update) => update[Math.ceil(update.length / 2 - 1)])
                .reduce((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1())
console.log('Part 2: ', await part2())
