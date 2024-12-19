import { S } from "@mobily/ts-belt"
import { getInput } from "./utils.js"

const parseInput = (lines: string[]) => {
        const availableTowels = lines[0].split(', ')
        const patterns = lines.slice(1)
        return { availableTowels, patterns }
}

const possiblePatterns = new Set<string>()
const impossiblePatterns = new Set<string>()

const match = (towels: string[], pattern: string): boolean => {
        if (impossiblePatterns.has(pattern))
                return false

        if (possiblePatterns.has(pattern))
                return true

        if (pattern.length == 0)
                return true

        const possibleNextTowels = towels
                .filter((towel) => S.startsWith(pattern, towel))

        if (possibleNextTowels.length == 0)
                return false

        const isPossible = possibleNextTowels
                .map((towel) => match(towels, pattern.slice(towel.length)))
                .some((it) => it == true)

        if (isPossible) {
                possiblePatterns.add(pattern)
        } else {
                impossiblePatterns.add(pattern)
        }

        return isPossible
}

const part1 = async (test: boolean) => {
        const { availableTowels, patterns } = parseInput(await getInput(19, test))
        return patterns
                .map((pattern) => match(availableTowels, pattern))
                .filter((it) => it == true)
                .length
}

const patternCombos = new Map<string, number>()

const match2 = (towels: string[], pattern: string): number => {
        if (impossiblePatterns.has(pattern))
                return 0

        if (patternCombos.has(pattern))
                return patternCombos.get(pattern)!

        if (pattern.length == 0)
                return 1

        const possibleNextTowels = towels
                .filter((towel) => S.startsWith(pattern, towel))

        if (possibleNextTowels.length == 0) {
                impossiblePatterns.add(pattern)
                return 0
        }

        const combos = possibleNextTowels
                .map((towel) => match2(towels, pattern.slice(towel.length)))
                .reduce((acc, curr) => acc + curr, 0)

        if (combos > 0) {
                patternCombos.set(pattern, combos)
        }

        return combos
}

const part2 = async (test: boolean) => {
        const { availableTowels, patterns } = parseInput(await getInput(19, test))
        return patterns
                .map((pattern) => match2(availableTowels, pattern))
                .reduce((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
