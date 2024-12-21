import { getInput } from "./utils.js"

type Direction = '^' | '>' | '<' | 'v'

type Point = { x: number, y: number }

type NumpadState = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'E'

type DpadState = Direction | 'A' | 'E'

const numpad: Record<NumpadState, Point> = {
        7: { x: 0, y: 0 },
        8: { x: 0, y: 1 },
        9: { x: 0, y: 2 },
        4: { x: 1, y: 0 },
        5: { x: 1, y: 1 },
        6: { x: 1, y: 2 },
        1: { x: 2, y: 0 },
        2: { x: 2, y: 1 },
        3: { x: 2, y: 2 },
        E: { x: 3, y: 0 },
        0: { x: 3, y: 1 },
        A: { x: 3, y: 2 }
}

const dpad: Record<DpadState, Point> = {
        E: { x: 0, y: 0 },
        '^': { x: 0, y: 1 },
        A: { x: 0, y: 2 },
        '<': { x: 1, y: 0 },
        'v': { x: 1, y: 1 },
        '>': { x: 1, y: 2 },
}

const directionsWithSymbols: Record<Direction, Point> = {
        '^': { x: -1, y: 0 },
        '>': { x: 0, y: 1 },
        '<': { x: 0, y: -1 },
        'v': { x: 1, y: 0 },
}


const bfs = (start: Point, end: Point, positions: typeof numpad | typeof dpad) => {
        // If we're already there, just press the button
        if (start.x == end.x && start.y == end.y)
                return ['A']

        type State = { point: Point, path: string }

        const isInBounds = (p: Point) => Object.values(positions).some(({ x, y }) => p.x == x && p.y == y)
        let paths: string[] = []

        const queue: State[] = [{ point: start, path: '' }]
        const distances = new Map<string, number>()

        while (queue.length > 0) {
                const curr = queue.shift()
                if (curr == null)
                        break

                const { point, path } = curr
                const { x, y } = point
                const forbiddenPosition = positions.E
                const key = `${x},${y}`

                if (x === end.x && y === end.y)
                        paths.push(path + 'A')

                if (distances.has(key) && distances.get(key)! < path.length)
                        continue

                for (const [symbol, dir] of Object.entries(directionsWithSymbols)) {
                        const neighbour = { x: x + dir.x, y: y + dir.y }
                        const neighbourKey = `${neighbour.x},${neighbour.y}`
                        if (
                                isInBounds(neighbour) &&
                                !(forbiddenPosition.x === neighbour.x && forbiddenPosition.y === neighbour.y) &&
                                (!distances.has(neighbourKey) || distances.get(neighbourKey)! >= path.length + 1)
                        ) {
                                queue.push({ point: neighbour, path: `${path}${symbol}` })
                                distances.set(neighbourKey, path.length + 1)
                        }
                }
        }

        return paths.sort((a, b) => a.length - b.length)
}

const simulate = (positions: typeof numpad | typeof dpad, ixs: string, iter: number, memo: Map<string, number>): number => {
        const key = `${ixs},${iter}`

        // hack
        type T = NumpadState & DpadState

        if (memo.has(key))
                return memo.get(key)!

        let start = positions.A
        let len = 0
        for (let i = 0; i < ixs.length; i++) {
                const paths = bfs(start, positions[ixs[i] as T], positions)!
                if (iter === 0) {
                        len += paths[0].length
                } else {
                        len += Math.min(
                                ...paths.map(
                                        // Subsequent iterations always run on dpad
                                        (ixs) => simulate(dpad, ixs, iter - 1, memo)
                                )
                        )
                }

                start = positions[ixs[i] as T]
        }

        memo.set(key, len)
        return len
}


const part1 = async (test: boolean) => {
        const ixSets = await getInput(21, test)

        const memo = new Map<string, number>()
        let sum = 0
        for (const ixSet of ixSets) {
                const movements = simulate(numpad, ixSet, 2, memo)
                sum += Number.parseInt(ixSet.slice(0, -1)) * movements
        }
        return sum
}

const part2 = async (test: boolean) => {
        const ixSets = await getInput(21, test)

        const memo = new Map<string, number>()
        let sum = 0
        for (const ixSet of ixSets) {
                const movements = simulate(numpad, ixSet, 25, memo)
                sum += Number.parseInt(ixSet.slice(0, -1)) * movements
        }
        return sum
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
