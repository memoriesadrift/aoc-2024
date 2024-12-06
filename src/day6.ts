import { F, S } from '@mobily/ts-belt'
import { getInput } from "./utils.js"

type Direction = 'up' | 'down' | 'left' | 'right'

const find2dPositionOf = (element: string, arr: string[][]): [number, number] => {
        for (let i = 0; i < arr.length; i++) {
                const inner = arr[i];
                for (let j = 0; j < inner.length; j++) {
                        const checked = inner[j];
                        if (checked == element) {
                                return [i, j]
                        }
                }
        }
        throw new Error('Element not found in 2d array!')
}

const nextDirection = (direction: Direction): Direction => {
        switch (direction) {
                case 'up':
                        return 'right'
                case 'right':
                        return 'down'
                case 'down':
                        return 'left'
                case 'left':
                        return 'up'
        }
}

const nextPosition = (pos: [number, number], direction: Direction): [number, number] => {
        switch (direction) {
                case 'up':
                        return [pos[0] - 1, pos[1]]
                case 'down':
                        return [pos[0] + 1, pos[1]]
                case 'left':
                        return [pos[0], pos[1] - 1]
                case 'right':
                        return [pos[0], pos[1] + 1]
        }
}

const part1 = async (test: boolean) => {
        const lines = await getInput(6, test)
        const floorPlan = lines.map((line) => F.toMutable(S.split(line, '')))
        const guardStartPosition = find2dPositionOf('^', floorPlan)

        let nextPos = guardStartPosition
        let isExiting = false
        let tilesMarked: Map<string, boolean> = new Map()
        let direction: Direction = 'up'
        while (!isExiting) {
                // mark current tile as seen
                tilesMarked.set(`${nextPos[0]},${nextPos[1]}`, true)

                // update next position
                let potentialNewPos: [number, number] = nextPosition(nextPos, direction)
                // Check if OOB
                if (
                        potentialNewPos[0] < 0 ||
                        potentialNewPos[1] < 0 ||
                        potentialNewPos[0] >= floorPlan.length ||
                        potentialNewPos[1] >= floorPlan[nextPos[0]].length
                ) {
                        isExiting = true
                        continue
                }
                // If it's a #
                if (floorPlan[potentialNewPos[0]][potentialNewPos[1]] == '#') {
                        direction = nextDirection(direction)
                        continue
                }

                // Everything ok, move to the next tile
                nextPos = potentialNewPos
        }

        return { len: Array.from(tilesMarked.keys()).length, visited: tilesMarked }
}

const checkIfLoops = (obstaclePos: [number, number], floorPlan: string[][], guardStartPos: [number, number]): boolean => {
        let nextPos = guardStartPos
        let tilesMarked: Map<string, Direction[]> = new Map()
        let direction: Direction = 'up'

        while (true) {
                if (
                        tilesMarked.get(`${nextPos[0]},${nextPos[1]}`)?.includes(direction)
                ) {
                        return true
                }


                // mark current tile as seen
                const alreadyEnteredFrom = tilesMarked.get(`${nextPos[0]},${nextPos[1]}`)
                tilesMarked.set(`${nextPos[0]},${nextPos[1]}`, alreadyEnteredFrom ? [...alreadyEnteredFrom, direction] : [direction])

                // update next position
                let potentialNewPos: [number, number] = nextPos
                switch (direction) {
                        case 'up':
                                potentialNewPos = [nextPos[0] - 1, nextPos[1]]
                                break;
                        case 'down':
                                potentialNewPos = [nextPos[0] + 1, nextPos[1]]
                                break;
                        case 'left':
                                potentialNewPos = [nextPos[0], nextPos[1] - 1]
                                break;
                        case 'right':
                                potentialNewPos = [nextPos[0], nextPos[1] + 1]
                                break;
                }
                // Check if OOB
                if (
                        potentialNewPos[0] < 0 ||
                        potentialNewPos[1] < 0 ||
                        potentialNewPos[0] >= floorPlan.length ||
                        potentialNewPos[1] >= floorPlan[nextPos[0]].length
                ) {
                        return false
                }
                // If it's a #
                if (floorPlan[potentialNewPos[0]][potentialNewPos[1]] == '#' || (potentialNewPos[0] == obstaclePos[0] && potentialNewPos[1] == obstaclePos[1])) {
                        direction = nextDirection(direction)
                        continue
                }

                // Everything ok, move to the next tile
                nextPos = potentialNewPos
        }
}

const part2 = async (test: boolean) => {
        const lines = await getInput(6, test)
        const floorPlan = lines.map((line) => F.toMutable(S.split(line, '')))
        const guardStartPosition = find2dPositionOf('^', floorPlan)
        const { visited } = await part1(test)

        let nextPos = guardStartPosition
        let isExiting = false
        let tilesMarked: Map<string, Direction[]> = new Map()
        let loopSpots: Set<string> = new Set()
        let direction: Direction = 'up'
        while (!isExiting) {
                // mark current tile as seen
                const alreadyEnteredFrom = tilesMarked.get(`${nextPos[0]},${nextPos[1]}`)
                tilesMarked.set(`${nextPos[0]},${nextPos[1]}`, alreadyEnteredFrom ? [...alreadyEnteredFrom, direction] : [direction])

                // update next position
                let potentialNewPos: [number, number] = nextPos
                switch (direction) {
                        case 'up':
                                potentialNewPos = [nextPos[0] - 1, nextPos[1]]
                                break;
                        case 'down':
                                potentialNewPos = [nextPos[0] + 1, nextPos[1]]
                                break;
                        case 'left':
                                potentialNewPos = [nextPos[0], nextPos[1] - 1]
                                break;
                        case 'right':
                                potentialNewPos = [nextPos[0], nextPos[1] + 1]
                                break;
                }
                // Check if OOB
                if (
                        potentialNewPos[0] < 0 ||
                        potentialNewPos[1] < 0 ||
                        potentialNewPos[0] >= floorPlan.length ||
                        potentialNewPos[1] >= floorPlan[nextPos[0]].length
                ) {
                        isExiting = true
                        continue
                }
                // If it's a #
                if (floorPlan[potentialNewPos[0]][potentialNewPos[1]] == '#') {
                        direction = nextDirection(direction)
                        continue
                }

                const obstaclePos = nextPosition(nextPos, direction)
                if (visited.get(`${obstaclePos[0]},${obstaclePos[1]}`) == true && floorPlan[obstaclePos[0]][obstaclePos[1]] != '^') {
                        const loops = checkIfLoops(obstaclePos, floorPlan, guardStartPosition)
                        if (loops) {
                                loopSpots.add(`${obstaclePos[0]},${obstaclePos[1]}`)
                        }
                }

                // Everything ok, move to the next tile
                nextPos = potentialNewPos
        }

        return loopSpots.size
}

console.log('Part 1: ', (await part1(false)).len)
console.log('Part 2: ', await part2(false))
