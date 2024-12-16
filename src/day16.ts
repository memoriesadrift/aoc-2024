import { getInputAs2dArray } from "./utils.js"

type Point = { x: number, y: number }
type State = { pos: Point, dir: number, score: number }

// Directions in clockwise order for easy turning
const directions: Point[] = [
        { x: -1, y: 0 }, // North
        { x: 0, y: 1 },  // East
        { x: 1, y: 0 },  // South
        { x: 0, y: -1 }, // West
]

const encodeState = (p: Point, dir: number): string => `${p.x},${p.y},${dir}`
const encodeTile = (p: Point): string => `${p.x},${p.y}`
const isInBounds = (p: Point, rows: number, cols: number) => p.x >= 0 && p.x < rows && p.y >= 0 && p.y < cols

function dijkstra(maze: string[][], start: Point, end: Point) {
        const rows = maze.length
        const cols = maze[0].length
        const priorityQueue: State[] = [{ pos: start, dir: 1, score: 0 }]
        const visited = new Set<string>()

        while (priorityQueue.length > 0) {
                priorityQueue.sort((a, b) => a.score - b.score)

                const { pos, dir, score } = priorityQueue.shift()!

                // First hit of end is shortest path by definition
                if (pos.x === end.x && pos.y === end.y) {
                        return score
                }

                const stateKey = encodeState(pos, dir)
                if (visited.has(stateKey))
                        continue
                visited.add(stateKey)

                // Move forward
                const nextPos = {
                        x: pos.x + directions[dir].x,
                        y: pos.y + directions[dir].y,
                }
                if (isInBounds(nextPos, rows, cols) && maze[nextPos.x][nextPos.y] !== "#") {
                        priorityQueue.push({ pos: nextPos, dir, score: score + 1 })
                }

                // Rotate clockwise
                priorityQueue.push({ pos, dir: (dir + 1) % 4, score: score + 1000 })

                // Rotate counterclockwise
                priorityQueue.push({ pos, dir: (dir + 3) % 4, score: score + 1000 })
        }

        // No path found
        return Infinity
}

const part1 = async (test: boolean) => {
        let maze = await getInputAs2dArray(16, test)

        let start: Point = { x: 0, y: 0 }
        let end: Point = { x: 0, y: 0 }

        for (let x = 0; x < maze.length; x++) {
                for (let y = 0; y < maze[x].length; y++) {
                        if (maze[x][y] === "S")
                                start = { x, y }
                        if (maze[x][y] === "E")
                                end = { x, y }
                }
        }
        return dijkstra(maze, start, end)
}

function dijkstraFull(maze: string[][], start: Point, end: Point) {
        const rows = maze.length
        const cols = maze[0].length

        const priorityQueue: State[] = [{ pos: start, dir: 1, score: 0 }]
        const scores = new Map<string, number>()
        const visited = new Set<string>()
        const bestPathTiles = new Set<string>()


        while (priorityQueue.length > 0) {
                priorityQueue.sort((a, b) => a.score - b.score)
                const { pos, dir, score } = priorityQueue.shift()!

                const stateKey = encodeState(pos, dir)
                if (visited.has(stateKey))
                        continue
                visited.add(stateKey)

                if (!scores.has(stateKey) || scores.get(stateKey)! > score) {
                        scores.set(stateKey, score)
                }

                const nextPos = {
                        x: pos.x + directions[dir].x,
                        y: pos.y + directions[dir].y,
                }
                if (isInBounds(nextPos, rows, cols) && maze[nextPos.x][nextPos.y] !== "#") {
                        priorityQueue.push({ pos: nextPos, dir, score: score + 1 })
                }

                // Rotate clockwise
                priorityQueue.push({ pos, dir: (dir + 1) % 4, score: score + 1000 })

                // Rotate counterclockwise
                priorityQueue.push({ pos, dir: (dir + 3) % 4, score: score + 1000 })
        }

        const bestScore = Math.min(
                ...[0, 1, 2, 3].map((dir) => scores.get(encodeState(end, dir)) ?? Infinity)
        )

        // Backtrack from all possible entry points to end tile
        const backtrackQueue: { pos: Point, dir: number, score: number }[] = [0, 1, 2, 3]
                .map((dir) => ({ pos: end, dir, score: scores.get(encodeState(end, dir))! }))
                .filter((state) => state.score === bestScore)

        const backtrackVisited = new Set<string>()

        while (backtrackQueue.length > 0) {
                const { pos, dir, score } = backtrackQueue.shift()!

                const stateKey = encodeState(pos, dir)
                if (backtrackVisited.has(stateKey))
                        continue
                backtrackVisited.add(stateKey)

                // Mark the tile as part of the best path
                bestPathTiles.add(encodeTile(pos))

                // Backtrack to previous states, accounting for possible movement or rotation
                const candidatePoints = [
                        {
                                pos: {
                                        x: pos.x - directions[dir].x,
                                        y: pos.y - directions[dir].y,
                                },
                                dir,
                                cost: 1,
                        },
                        ...[0, 1, 2, 3].map((prevDir) => ({
                                pos,
                                dir: prevDir,
                                cost: 1000,
                        })),
                ]
                        .filter(({ pos: candidatePos, dir: prevDir, cost }) => {
                                const candidateKey = encodeState(candidatePos, prevDir)
                                const candidateScore = scores.get(candidateKey) ?? Infinity
                                return (
                                        isInBounds(candidatePos, rows, cols) &&
                                        maze[candidatePos.x][candidatePos.y] !== "#" &&
                                        candidateScore === score - cost
                                )
                        })

                backtrackQueue.push(
                        ...candidatePoints.map(({ pos, dir }) => ({
                                pos,
                                dir,
                                score: scores.get(encodeState(pos, dir))!,
                        }))
                )
        }

        return bestPathTiles.size
}


const part2 = async (test: boolean) => {
        let maze = await getInputAs2dArray(16, test)

        let start: Point = { x: 0, y: 0 }
        let end: Point = { x: 0, y: 0 }

        for (let x = 0; x < maze.length; x++) {
                for (let y = 0; y < maze[x].length; y++) {
                        if (maze[x][y] === "S") start = { x, y }
                        if (maze[x][y] === "E") end = { x, y }
                }
        }

        return dijkstraFull(maze, start, end)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
