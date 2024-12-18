import { getInput } from "./utils.js"

type Point = { x: number, y: number }

const bfs = (start: Point, corruptedLocations: Set<string>, end: Point) => {
        const rows = end.y + 1
        const cols = end.x + 1

        const directions = [
                { x: 0, y: -1 }, // up
                { x: 0, y: 1 },  // down
                { x: -1, y: 0 }, // left
                { x: 1, y: 0 }   // right
        ]

        const queue: { p: Point, d: number }[] = [{ p: start, d: 0 }]
        const visited = new Set<string>()

        const isInBounds = (p: Point, rows: number, cols: number) => p.x >= 0 && p.x < rows && p.y >= 0 && p.y < cols

        while (queue.length > 0) {
                const { p: { x, y }, d } = queue.shift()!
                const key = `${x},${y}`

                if (visited.has(key)) continue
                visited.add(key)

                // Reached end, return shortest path
                if (x == end.x && y == end.y) {
                        return d
                }

                for (const dir of directions) {
                        const neighbor = { x: x + dir.x, y: y + dir.y }
                        if (
                                isInBounds(neighbor, rows, cols) &&
                                !corruptedLocations.has(`${neighbor.x},${neighbor.y}`) &&
                                !visited.has(`${neighbor.x},${neighbor.y}`)
                        ) {
                                queue.push({ p: neighbor, d: d + 1 })
                        }
                }
        }
}

const parseInput = (lines: string[]) => {
        return lines.map((line) => line.split(',').map(Number)).map(([x, y]) => ({ x, y }))
}

const part1 = async (test: boolean) => {
        const input = parseInput(await getInput(18, test))
        const maxRange = test ? 6 : 70

        const corruptedLocations = new Set<string>()
        for (let index = 0; index < 1024; index++) {
                if (index >= input.length)
                        break
                const byte = input[index];
                corruptedLocations.add(`${byte.x},${byte.y}`)
        }
        const end = { x: maxRange, y: maxRange }
        return bfs({ x: 0, y: 0 }, corruptedLocations, end)
}
const part2 = async (test: boolean) => {
        const input = parseInput(await getInput(18, test))
        const maxRange = test ? 6 : 70

        const end = { x: maxRange, y: maxRange }
        const corruptedLocations = new Set<string>()
        // Brute force -- since the problem space is small we don't really need to optimise
        for (const byte of input) {
                corruptedLocations.add(`${byte.x},${byte.y}`)
                const bfsResult = bfs({ x: 0, y: 0 }, corruptedLocations, end)
                if (bfsResult == undefined)
                        return byte
        }
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
