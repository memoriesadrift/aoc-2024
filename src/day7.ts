import { A, F, pipe, S } from '@mobily/ts-belt'
import { getInput } from "./utils.js"

const resultsMap: Map<string, boolean> = new Map()

const concatenate = (a: number, b: number) => {
        return Number.parseInt(`${a}${b}`)
}

// NOTE: uses global memo map
const evaluate = (
        curr: number,
        rest: number[],
        target: number,
        part2: boolean
): boolean => {
        const key = `${curr}|${rest.join(',')}|${part2}}`

        const next = A.head(rest)
        if (next == undefined) {
                // Nothing left in array, return total
                if (curr == target) {
                        return true
                }
                return false
        }

        const newRest = F.toMutable(A.tailOrEmpty(rest))
        const cachedResult = resultsMap.get(key)
        if (cachedResult != undefined)
                return cachedResult

        const ifPlus = curr + next

        const ifMul = curr * next

        const a = evaluate(ifPlus, newRest, target, part2)
        const b = evaluate(ifMul, newRest, target, part2)

        // Concatenation operator handling
        let c = false
        if (part2 && !(a || b)) {
                const ifConcat = concatenate(curr, next)
                c = evaluate(ifConcat, newRest, target, part2)
        }

        resultsMap.set(key, a || b || c)
        return a || b || c
}

const part1 = async () => {
        const lines = await getInput(7, false)
        // @ts-ignore
        const equations: [number, number[]] = pipe(
                lines,
                A.map(S.split(':')),
                A.map(([op, ixs]) => [
                        Number.parseInt(op), pipe(ixs, S.split(' '), A.map(Number.parseInt), A.filter((it) => !isNaN(it)), F.toMutable)
                ]),
                F.toMutable
        )
        return equations.map((eq) => {
                // @ts-ignore
                const res: number = eq[0]
                // @ts-ignore
                const nums: number[] = eq[1]
                if (nums.length == 1)
                        return { target: res, success: res == nums[0] }

                return { target: res, success: evaluate(nums[0], F.toMutable(A.tailOrEmpty(nums)), res, false) }
        })
                .map(({ target, success }) => success ? target : 0)
                .reduce((acc, curr) => acc + curr, 0)
}

const part2 = async () => {
        const lines = await getInput(7, false)
        // @ts-ignore
        const equations: [number, number[]] = pipe(
                lines,
                A.map(S.split(':')),
                A.map(([op, ixs]) => [
                        Number.parseInt(op), pipe(ixs, S.split(' '), A.map(Number.parseInt), A.filter((it) => !isNaN(it)), F.toMutable)
                ]),
                F.toMutable
        )
        return equations.map((eq) => {
                // @ts-ignore
                const res: number = eq[0]
                // @ts-ignore
                const nums: number[] = eq[1]
                if (nums.length == 1)
                        return { target: res, success: res == nums[0] }

                return {
                        target: res, success: evaluate(
                                nums[0],
                                F.toMutable(A.tailOrEmpty(nums)),
                                res,
                                true
                        )
                }
        })
                .map(({ target, success }) => success ? target : 0)
                .reduce((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1())
console.log('Part 2: ', await part2())
