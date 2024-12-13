import { A } from "@mobily/ts-belt"
import { getInput } from "./utils.js"

type Point = { x: number, y: number }

type ClawMachine = {
        a: Point
        b: Point
        prize: Point
}

const parseInput = (lines: string[], addToResult: number): ClawMachine[] => {
        const inputs = []
        while (lines.length > 0) {
                inputs.push(A.take(lines, 3))
                lines = lines.slice(3)
        }
        return inputs
                .map(([a, b, res]) => {
                        const as = a.slice(10).split(', ').map((it) => Number.parseInt(it.slice(2)))
                        const bs = b.slice(10).split(', ').map((it) => Number.parseInt(it.slice(2)))
                        const ress = res.slice(7).split(', ').map((it) => Number.parseInt(it.slice(2)))
                        return { a: { x: as[0], y: as[1] }, b: { x: bs[0], y: bs[1] }, prize: { x: ress[0] + addToResult, y: ress[1] + addToResult } }
                })

}

const findMinTokens = (machine: ClawMachine): number | undefined => {
        let { a: buttonA, b: buttonB, prize } = machine
        let xEq = { a: buttonA.x, b: buttonB.x, r: prize.x }
        let yEq = { a: buttonA.y, b: buttonB.y, r: prize.y }

        // Multiply equation 1 with equation 2 
        let xEq2 = { a: buttonA.x * buttonA.y, b: buttonB.x * buttonA.y, r: prize.x * buttonA.y }

        // Multiply equation 2 with equation 1 
        let yEq2 = { a: buttonA.y * buttonA.x, b: buttonB.y * buttonA.x, r: prize.y * buttonA.x }

        // Subtract equation 1 from equation 2
        let yEq3 = { a: yEq2.a - xEq2.a, b: yEq2.b - xEq2.b, r: yEq2.r - xEq2.r }

        let b = yEq3.r / yEq3.b
        let a = (xEq.r - xEq.b * b) / xEq.a

        // Must be a whole number of button presses
        if (Math.floor(b) != b || Math.floor(a) != a) {
                return undefined
        }

        // Verify
        const verifyX = xEq.a * a + xEq.b * b == xEq.r
        const verifyY = yEq.a * a + yEq.b * b == yEq.r

        if (!verifyX || !verifyY) {
                return undefined
        }

        return a * 3 + b
}

const part1 = async (test: boolean) => {
        let lines = await getInput(13, test)
        return parseInput(lines, 0)
                .map((machine) => findMinTokens(machine))
                .filter((it) => it != undefined)
                .reduce((acc, curr) => acc + curr, 0)
}

const part2 = async (test: boolean) => {
        let lines = await getInput(13, test)
        return parseInput(lines, 10000000000000)
                .map((machine) => findMinTokens(machine))
                .filter((it) => it != undefined)
                .reduce((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
