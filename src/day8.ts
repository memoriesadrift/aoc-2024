import { getInput } from "./utils.js"

type Point = { x: number, y: number }

const project = (a: Point, b: Point, dimensions: Point, part2: boolean) => {
        const dx = b.x - a.x
        const dy = b.y - a.y

        if (!part2) {
                return [
                        {
                                x: b.x + dx,
                                y: b.y + dy,
                        },

                        {
                                x: a.x - dx,
                                y: a.y - dy,
                        }
                ]
        }

        let nextPointFw =
        {
                x: b.x,
                y: b.y,
        }
        let nextPointBk =
        {
                x: a.x,
                y: a.y,
        }

        let res: Point[] = []
        while (liesInGrid(nextPointFw, dimensions) || liesInGrid(nextPointBk, dimensions)) {
                if (liesInGrid(nextPointFw, dimensions)) {
                        res.push(nextPointFw)
                        nextPointFw = {
                                x: nextPointFw.x + dx,
                                y: nextPointFw.y + dy,
                        }
                }
                if (liesInGrid(nextPointBk, dimensions)) {
                        res.push(nextPointBk)
                        nextPointBk = {
                                x: nextPointBk.x - dx,
                                y: nextPointBk.y - dy,
                        }
                }
        }

        return res
}

const isValidCharacter = (c: string) => {
        return c != '.' && c != '#'
}

const liesInGrid = (p: Point, dimensions: Point) => {
        if (p.x < 0 || p.y < 0) return false
        if (p.x >= dimensions.x || p.y >= dimensions.y) return false
        return true
}

const part1 = async (test: boolean) => {
        const lines = await getInput(8, test)
        const dimensions = { x: lines[0].length, y: lines.length }
        const antennas: Map<string, Set<string>> = new Map()
        for (let y = 0; y < lines.length; y++) {
                const line = lines[y].split('')
                for (let x = 0; x < lines[y].length; x++) {
                        if (isValidCharacter(line[x])) {
                                const set = antennas.get(line[x]) || new Set()
                                set.add(`${y},${x}`)
                                antennas.set(line[x], set)
                        }
                }
        }
        const frequencies = new Set<string>()

        Array.from(antennas.values()).forEach((pointSet) => {
                const points = Array.from(pointSet.values()).map((point): Point => {
                        const [y, x] = point.split(',')
                        return {
                                x: Number.parseInt(x),
                                y: Number.parseInt(y)
                        }
                })

                for (let i = 0; i < points.length; i++) {
                        const curr = points[i]
                        const rest = points.slice(i + 1)
                        for (const next of rest) {
                                const [fw, bk] = project(curr, next, dimensions, false)
                                if (liesInGrid(fw, dimensions)) {
                                        frequencies.add(`${fw.y},${fw.x}`)
                                }
                                if (liesInGrid(bk, dimensions)) {
                                        frequencies.add(`${bk.y},${bk.x}`)
                                }

                        }
                }
        })
        return frequencies.size
}

const part2 = async (test: boolean) => {
        const lines = await getInput(8, test)
        const dimensions = { x: lines[0].length, y: lines.length }
        const antennas: Map<string, Set<string>> = new Map()
        for (let y = 0; y < lines.length; y++) {
                const line = lines[y].split('')
                for (let x = 0; x < lines[y].length; x++) {
                        if (isValidCharacter(line[x])) {
                                const set = antennas.get(line[x]) || new Set()
                                set.add(`${y},${x}`)
                                antennas.set(line[x], set)
                        }
                }
        }
        const frequencies = new Set<string>()

        Array.from(antennas.values()).forEach((pointSet) => {
                const points = Array.from(pointSet.values()).map((point): Point => {
                        const [y, x] = point.split(',')
                        return {
                                x: Number.parseInt(x),
                                y: Number.parseInt(y)
                        }
                })

                for (let i = 0; i < points.length; i++) {
                        const curr = points[i]
                        const rest = points.slice(i + 1)
                        for (const next of rest) {

                                const projected = project(curr, next, dimensions, true)
                                for (const point of projected) {
                                        if (liesInGrid(point, dimensions)) {
                                                frequencies.add(`${point.y},${point.x}`)
                                        }
                                }

                        }
                }
        })
        return frequencies.size
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
