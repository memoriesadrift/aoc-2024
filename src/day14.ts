import { setTimeout } from "timers/promises"
import { getInput } from "./utils.js"
import { A } from "@mobily/ts-belt"

type Point = { x: number, y: number }

const part1 = async (test: boolean) => {
        let lines = await getInput(14, test)
        const robots = lines.map((line) => line.split(' ').map(((it) => it.slice(2).split(',').map((n) => Number.parseInt(n))))).map(([pos, velocity]) => ({ pos: { x: pos[0], y: pos[1] }, v: { x: velocity[0], y: velocity[1] } }))

        const maxWidth = 101
        const maxHeight = 103

        const endPositions = robots.map(({ pos: start, v }) => {
                let pos = start
                // 100 seconds
                for (let i = 0; i < 100; i++) {
                        pos.x += v.x
                        pos.y += v.y
                        if (pos.x < 0) {
                                pos.x += maxWidth
                        }
                        if (pos.y < 0) {
                                pos.y += maxHeight
                        }
                        if (pos.x >= maxWidth) {
                                pos.x -= maxWidth
                        }
                        if (pos.y >= maxHeight) {
                                pos.y -= maxHeight
                        }
                }
                return pos
        })

        const res = endPositions.reduce((acc, curr) => {
                // tl or bl
                if (curr.x < Math.floor(maxWidth / 2)) {
                        // tl
                        if (curr.y < Math.floor(maxHeight / 2)) {
                                return { ...acc, tl: acc.tl + 1 }
                        } else if (curr.y > Math.floor(maxHeight / 2)) {
                                // bl
                                return { ...acc, bl: acc.bl + 1 }
                        } else {
                                return acc
                        }
                } else if (curr.x > Math.floor(maxWidth / 2)) {
                        // tr
                        if (curr.y < Math.floor(maxHeight / 2)) {
                                return { ...acc, tr: acc.tr + 1 }
                        } else if (curr.y > Math.floor(maxHeight / 2)) {
                                // br
                                return { ...acc, br: acc.br + 1 }
                        } else {
                                return acc
                        }
                } else {
                        return acc
                }

        }, { tl: 0, tr: 0, bl: 0, br: 0 })

        return res.tl * res.tr * res.bl * res.br
}

const part2 = async (test: boolean) => {
        let lines = await getInput(14, test)
        let robots = lines.map((line) => line.split(' ').map(((it) => it.slice(2).split(',').map((n) => Number.parseInt(n))))).map(([pos, velocity]) => ({ pos: { x: pos[0], y: pos[1] }, v: { x: velocity[0], y: velocity[1] } }))

        const maxWidth = 101
        const maxHeight = 103

        let i = 0
        while (true) {
                robots = robots.map(({ pos, v }) => {
                        pos.x += v.x
                        pos.y += v.y
                        if (pos.x < 0) {
                                pos.x += maxWidth
                        }
                        if (pos.y < 0) {
                                pos.y += maxHeight
                        }
                        if (pos.x >= maxWidth) {
                                pos.x -= maxWidth
                        }
                        if (pos.y >= maxHeight) {
                                pos.y -= maxHeight
                        }
                        return { pos, v }

                })

                i++

                // Heuristic, may not work every time!
                if (A.uniqBy(robots, (val) => `${val.pos.x},${val.pos.y}`).length == robots.length) {
                        console.log('Iteration ', i)
                        for (let y = 0; y < maxHeight; y++) {
                                for (let x = 0; x < maxWidth; x++) {
                                        const hasRobot = robots.some(({ pos }) => (pos.x == x && pos.y == y))
                                        if (hasRobot) {
                                                process.stdout.write('█')
                                        } else {
                                                process.stdout.write('.')
                                        }
                                }
                                process.stdout.write('\n')
                        }
                        await setTimeout(500)
                }

        }
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
