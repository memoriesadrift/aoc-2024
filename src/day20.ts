import { getInputAs2dArray } from "./utils.js"

type Point = { x: number, y: number }

const directions = [
        { x: 0, y: -1 }, // up
        { x: 0, y: 1 },  // down
        { x: -1, y: 0 }, // left
        { x: 1, y: 0 }   // right
]

const isInBounds = (p: Point, rows: number, cols: number) => p.x >= 0 && p.x < rows && p.y >= 0 && p.y < cols

const bfs = (start: Point, map: string[][], end: Point, cheatPoint: Point) => {
        const rows = map.length
        const cols = map[0].length

        const queue: { p: Point, d: number }[] = [{ p: start, d: 0 }]
        const visited = new Set<string>()


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
                        const neighbour = { x: x + dir.x, y: y + dir.y }
                        if (
                                isInBounds(neighbour, rows, cols) &&
                                ((cheatPoint.x == neighbour.x && cheatPoint.y == neighbour.y) ||
                                        map[neighbour.x][neighbour.y] != '#') &&
                                !visited.has(`${neighbour.x},${neighbour.y}`)
                        ) {
                                queue.push({ p: neighbour, d: d + 1 })
                        }
                }
        }
}

const part1 = async (test: boolean) => {
        const map = await getInputAs2dArray(20, test)

        let start: Point = { x: 0, y: 0 }
        let end: Point = { x: 0, y: 0 }
        const cheatableTiles: Point[] = []

        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[x].length; y++) {
                        if (map[x][y] === '#') {
                                const neighbours = directions
                                        .map((dir) => isInBounds({ x: x + dir.x, y: y + dir.y }, map.length, map[x].length) ? map[x + dir.x][y + dir.y] : '#')
                                        .filter((it) => it != '#')
                                if (neighbours.length >= 2) {
                                        // Could cheat here
                                        cheatableTiles.push({ x, y })
                                }

                        }
                        if (map[x][y] === "S") start = { x, y }
                        if (map[x][y] === "E") end = { x, y }
                }
        }


        const bestTimeNoCheat = bfs(start, map, end, { x: -1, y: -1 })
        return cheatableTiles
                .map((cheatPoint) => bfs(start, map, end, cheatPoint))
                .filter((it) => bestTimeNoCheat! - it! >= 100)
                .length
}

const findAllCheatPairs = (map: string[][]): [Point, Point, number][] => {
        const rows = map.length
        const cols = map[0].length;
        const maxMoves = 20

        const isFreeSpace = (x: number, y: number) => map[x][y] != '#'

        const freeSpaces: Point[] = []
        for (let x = 0; x < rows; x++) {
                for (let y = 0; y < cols; y++) {
                        if (isFreeSpace(x, y)) {
                                freeSpaces.push({ x, y })
                        }
                }
        }

        const cheats: [Point, Point, number][] = [];
        for (let i = 0; i < freeSpaces.length; i++) {
                for (let j = i + 1; j < freeSpaces.length; j++) {
                        const from = freeSpaces[i]
                        const to = freeSpaces[j]

                        const distance = Math.abs(from.x - to.x) + Math.abs(from.y - to.y)
                        if (distance <= maxMoves) {
                                cheats.push([from, to, distance])
                        }
                }
        }

        return cheats
}

const part2 = async (test: boolean) => {
        const map = await getInputAs2dArray(20, test)

        let start: Point = { x: 0, y: 0 }
        let end: Point = { x: 0, y: 0 }

        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[x].length; y++) {
                        if (map[x][y] === "S") start = { x, y }
                        if (map[x][y] === "E") end = { x, y }
                }
        }

        return findAllCheatPairs(map)
                .map(([cheatStart, cheatEnd, cheatLength]) => {
                        const distWithoutCheat = bfs(cheatStart, map, cheatEnd, { x: -1, y: -1 })
                        return distWithoutCheat! - cheatLength
                })
                .filter(it => it >= 100)
                .length
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
