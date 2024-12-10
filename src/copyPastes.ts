type Point = { x: number, y: number }

const bfs = (start: Point, map: number[][]) => {
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

        while (queue.length > 0) {
                const { x, y } = queue.shift()!
                const key = `${x},${y}`

                if (visited.has(key)) continue
                visited.add(key)

                if (/*end condition*/) {
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
}
