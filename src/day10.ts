import { getInputAs2dIntArray, } from "./utils.js"

type Point = { x: number, y: number }

const directions = [
        { x: -1, y: 0 }, // up
        { x: 1, y: 0 },  // down
        { x: 0, y: -1 }, // left
        { x: 0, y: 1 }   // right
]

const isInBounds = (p: Point, rows: number, cols: number) => p.x >= 0 && p.x < rows && p.y >= 0 && p.y < cols

const part1 = async (test: boolean) => {
        const map = (await getInputAs2dIntArray(10, test))
        const rows = map.length
        const cols = map[0].length

        const bfs = (start: Point): number => {
                const queue: Point[] = [start]
                const visited = new Set<string>()
                let score = 0

                while (queue.length > 0) {
                        const { x, y } = queue.shift()!
                        const key = `${x},${y}`

                        if (visited.has(key)) continue
                        visited.add(key)

                        // Valid trail found
                        if (map[x][y] === 9) {
                                score++
                                continue
                        }

                        for (const dir of directions) {
                                const neighbor = { x: x + dir.x, y: y + dir.y }
                                if (
                                        isInBounds(neighbor, rows, cols) &&
                                        map[neighbor.x][neighbor.y] === map[x][y] + 1 &&
                                        !visited.has(`${neighbor.x},${neighbor.y}`)
                                ) {
                                        queue.push(neighbor)
                                }
                        }
                }

                return score
        }

        let totalScore = 0

        for (let x = 0; x < rows; x++) {
                for (let y = 0; y < cols; y++) {
                        if (map[x][y] === 0) {
                                totalScore += bfs({ x, y })
                        }
                }
        }

        return totalScore
}

const part2 = async (test: boolean) => {
        const map = (await getInputAs2dIntArray(10, test))
        const rows = map.length
        const cols = map[0].length
        const memo = new Map<string, number>()

        const bfs = (start: Point): number => {
                const { x, y } = start
                const key = `${x},${y}`

                if (memo.has(key)) return memo.get(key)!

                // Valid trail found
                if (map[x][y] === 9) return 1

                let totalTrails = 0

                for (const dir of directions) {
                        const neighbor = { x: x + dir.x, y: y + dir.y }
                        if (
                                isInBounds(neighbor, rows, cols) &&
                                map[neighbor.x][neighbor.y] === map[x][y] + 1
                        ) {
                                totalTrails += bfs(neighbor)
                        }
                }

                memo.set(key, totalTrails)
                return totalTrails
        }

        let totalRating = 0

        for (let x = 0; x < rows; x++) {
                for (let y = 0; y < cols; y++) {
                        if (map[x][y] === 0) {
                                totalRating += bfs({ x, y })
                        }
                }
        }

        return totalRating
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
