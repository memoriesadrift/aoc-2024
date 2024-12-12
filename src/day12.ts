import { getInputAs2dArray } from "./utils.js"

type Point = { x: number, y: number }

const bfs = (start: Point, map: string[][]) => {
        const rows = map.length
        const cols = map[0].length

        const directions = [
                { x: -1, y: 0 }, // up
                { x: 1, y: 0 },  // down
                { x: 0, y: -1 }, // left
                { x: 0, y: 1 }   // right
        ]

        const queue: Point[] = [start]
        const visited = new Set<string>()

        const isInBounds = (p: Point, rows: number, cols: number) => p.x >= 0 && p.x < rows && p.y >= 0 && p.y < cols

        let necessaryFences = 0
        while (queue.length > 0) {
                const { x, y } = queue.shift()!
                const key = `${x},${y}`

                if (visited.has(key)) continue

                if (map[x][y] != map[start.x][start.y]) {
                        continue
                }

                visited.add(key)

                for (const dir of directions) {
                        const neighbour = { x: x + dir.x, y: y + dir.y }
                        if (
                                isInBounds(neighbour, rows, cols) &&
                                map[neighbour.x][neighbour.y] === map[x][y] &&
                                !visited.has(`${neighbour.x},${neighbour.y}`)
                        ) {
                                queue.push(neighbour)
                        }
                        // Calculate fences
                        if (
                                !isInBounds(neighbour, rows, cols)
                                || map[neighbour.x][neighbour.y] != map[x][y]
                        ) {
                                necessaryFences++
                        }
                }
        }
        return { visited, necessaryFences }
}

const part1 = async (test: boolean) => {
        let map = (await getInputAs2dArray(12, test))
        const visitedPoints = new Set<string>()
        const plots: { visited: Set<string>, necessaryFences: number }[] = []
        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[x].length; y++) {
                        const key = `${x},${y}`
                        if (visitedPoints.has(key))
                                continue
                        const plot = bfs({ x, y }, map)
                        plots.push(plot)
                        for (const visitedPoint of plot.visited) {
                                visitedPoints.add(visitedPoint)
                        }
                }
        }
        return plots.reduce<number>((acc, curr) => {
                return acc + curr.visited.size * curr.necessaryFences
        }, 0)
}

const bfsP2 = (start: Point, map: string[][]) => {
        const rows = map.length
        const cols = map[0].length

        const directions = [
                { x: -1, y: 0 }, // up
                { x: 1, y: 0 },  // down
                { x: 0, y: -1 }, // left
                { x: 0, y: 1 }   // right
        ]

        const queue: Point[] = [start]
        const visited = new Set<string>()

        const isInBounds = (p: Point, rows: number, cols: number) => p.x >= 0 && p.x < rows && p.y >= 0 && p.y < cols

        let necessaryFences = 0
        let edges = new Set<string>()
        while (queue.length > 0) {
                const { x, y } = queue.shift()!
                const key = `${x},${y}`

                if (visited.has(key)) continue

                if (map[x][y] != map[start.x][start.y]) {
                        continue
                }

                visited.add(key)

                for (let i = 0; i < directions.length; i++) {
                        const dir = directions[i]
                        const neighbour = { x: x + dir.x, y: y + dir.y }
                        if (!isInBounds(neighbour, rows, cols) || map[neighbour.x][neighbour.y] !== map[start.x][start.y]) {
                                necessaryFences += 1;

                                edges.add(`${i},${neighbour.x},${neighbour.y}`);
                                // Check if neighbour's neighbour is on the same side
                                for (const dir2 of directions) {
                                        const neighbour2 = { x: neighbour.x + dir2.x, y: neighbour.y + dir2.y }
                                        if (edges.has(`${i},${neighbour2.x},${neighbour2.y}`))
                                                necessaryFences -= 1
                                }
                        } else {
                                queue.push(neighbour);
                        }
                }
        }
        return { visited, necessaryFences }

}

const part2 = async (test: boolean) => {
        let map = (await getInputAs2dArray(12, test))
        const visitedPoints = new Set<string>()
        const plots: { visited: Set<string>, necessaryFences: number }[] = []
        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[x].length; y++) {
                        const key = `${x},${y}`
                        if (visitedPoints.has(key))
                                continue
                        const plot = bfsP2({ x, y }, map)
                        plots.push(plot)
                        for (const visitedPoint of plot.visited) {
                                visitedPoints.add(visitedPoint)
                        }
                }
        }
        return plots
                .reduce<number>((acc, curr) => {
                        return acc + curr.visited.size * curr.necessaryFences
                }, 0)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
