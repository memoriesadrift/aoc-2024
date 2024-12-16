import { A, S } from "@mobily/ts-belt"
import { getInput } from "./utils.js"

type Point = { x: number, y: number }
type Instruction = '<' | '>' | '^' | 'v'

const directions = {
        up: { x: -1, y: 0 }, // up
        down: { x: 1, y: 0 },  // down
        left: { x: 0, y: -1 }, // left
        right: { x: 0, y: 1 }   // right
}

const handleMove = (ix: Instruction, pos: Point, map: string[][], movedObject: '@' | 'O'): { newPos: Point, newMap: string[][] } => {
        let dir: Point;
        switch (ix) {
                case '<':
                        dir = directions.left
                        break;
                case '>':
                        dir = directions.right
                        break;
                case '^':
                        dir = directions.up
                        break;
                case 'v':
                        dir = directions.down
                        break;
        }

        const nextPositionCandidate = { x: pos.x + dir.x, y: pos.y + dir.y }
        // @ts-ignore
        const nextPositionTile: '.' | '#' | 'O' = map[nextPositionCandidate.x][nextPositionCandidate.y]

        switch (nextPositionTile) {
                case '.': {
                        const newMap = map
                        newMap[pos.x][pos.y] = '.'
                        newMap[nextPositionCandidate.x][nextPositionCandidate.y] = movedObject
                        return { newPos: nextPositionCandidate, newMap }
                }
                case "#":
                        // No movement if next tile is a wall
                        return { newPos: pos, newMap: map }
                case "O": {
                        const { newMap } = handleMove(ix, nextPositionCandidate, map, 'O')
                        if (newMap[nextPositionCandidate.x][nextPositionCandidate.y] == '.') {
                                const newerMap = newMap
                                newerMap[nextPositionCandidate.x][nextPositionCandidate.y] = movedObject
                                newerMap[pos.x][pos.y] = '.'
                                return { newPos: nextPositionCandidate, newMap: newerMap }
                        }

                        return { newPos: pos, newMap: map }
                }
        }
}



const part1 = async (test: boolean) => {
        const rawInput = await getInput(15, test)
        let [rawMap, rawMoveList] = A.partition(rawInput, (line) => S.startsWith(line, '#'))
        let map = rawMap.map((line) => line.split(''))
        let pos: Point = { x: -1, y: -1 }

        // Get start pos :) 
        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[0].length; y++) {
                        if (map[x][y] == '@') {
                                pos = { x, y }
                                break
                        }
                }
        }

        // Move
        // @ts-ignore
        const moveList: Instruction[] = rawMoveList.join('')

        for (let i = 0; i < moveList.length; i++) {
                const ix = moveList[i];
                const { newPos, newMap } = handleMove(ix, pos, map, '@')
                map = newMap
                pos = newPos
        }

        let sum = 0
        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[0].length; y++) {
                        if (map[x][y] == 'O') {
                                sum += y + 100 * x

                        }
                        //process.stdout.write(map[x][y])
                }
                //process.stdout.write('\n')
        }
        return sum
}

const deserialiseBox = (s: string): Point => ({ x: Number.parseInt(s.split(',')[0]), y: Number.parseInt(s.split(',')[1]) })

const handleMove2 = (ix: Instruction, pos: Point, map: string[][], boxes: Set<string>) => {
        let dir: Point;
        switch (ix) {
                case '<':
                        dir = directions.left
                        break;
                case '>':
                        dir = directions.right
                        break;
                case '^':
                        dir = directions.up
                        break;
                case 'v':
                        dir = directions.down
                        break;
        }

        const nextPosition = { x: pos.x + dir.x, y: pos.y + dir.y }
        // @ts-ignore
        const isWall = (p: Point) => map[p.x][p.y] === '#';
        const isBox = (p: Point) => {
                return boxes.has(`${p.x},${p.y}`) || boxes.has(`${p.x},${p.y - 1}`)
        }


        if (isWall(nextPosition)) {
                return { pos, boxes }
        }

        if (isBox(nextPosition)) {
                const touchedBox = Array.from(boxes).find((box) =>
                        box == `${nextPosition.x},${nextPosition.y}`
                        || box == `${nextPosition.x},${nextPosition.y - 1}`
                )
                if (!touchedBox) {
                        throw new Error('Fake touching box wtf')
                }

                const boxPos = deserialiseBox(touchedBox)

                if (ix == 'v') {
                        let posBoxWouldMoveTo = { x: boxPos.x + 1, y: boxPos.y }
                        let posBoxWouldMoveTo2 = { x: boxPos.x + 1, y: boxPos.y + 1 }
                        // Cannot move box!
                        if (isWall(posBoxWouldMoveTo) || isWall(posBoxWouldMoveTo2)) {
                                return { pos, boxes }
                        }
                        if (isBox(posBoxWouldMoveTo) || isBox(posBoxWouldMoveTo2)) {
                                const affectedBoxes = new Set<string>()
                                affectedBoxes.add(touchedBox)
                                const positionsToCheck = [boxPos]
                                while (positionsToCheck.length > 0) {
                                        const posToCheck = positionsToCheck.shift()!

                                        if (
                                                isWall({ x: posToCheck.x + 1, y: posToCheck.y })
                                                || isWall({ x: posToCheck.x + 1, y: posToCheck.y + 1 })) {
                                                return { pos, boxes }
                                        }

                                        const nextTouchedBoxes = Array.from(boxes).filter((box) =>
                                                // right below
                                                box == `${posToCheck.x + 1},${posToCheck.y}`
                                                // down left
                                                || box == `${posToCheck.x + 1},${posToCheck.y - 1}`
                                                // down right
                                                || box == `${posToCheck.x + 1},${posToCheck.y + 1}`
                                        )
                                        if (!nextTouchedBoxes) {
                                                throw new Error('Fake touching box wtf')
                                        }

                                        for (const nextBox of nextTouchedBoxes) {
                                                affectedBoxes.add(nextBox)
                                                positionsToCheck.push(deserialiseBox(nextBox))
                                        }
                                }
                                for (const box of affectedBoxes) {
                                        boxes.delete(box)
                                }
                                for (const box of affectedBoxes) {
                                        const coords = deserialiseBox(box)
                                        boxes.add(`${coords.x + 1},${coords.y}`)
                                }

                                return { pos: nextPosition, boxes }
                        } else {
                                boxes.delete(touchedBox)
                                boxes.add(`${boxPos.x + 1},${boxPos.y}`)
                                return { pos: nextPosition, boxes }
                        }

                }
                if (ix == '^') {
                        let posBoxWouldMoveTo = { x: boxPos.x - 1, y: boxPos.y }
                        let posBoxWouldMoveTo2 = { x: boxPos.x - 1, y: boxPos.y + 1 }
                        // Cannot move box!
                        if (isWall(posBoxWouldMoveTo) || isWall(posBoxWouldMoveTo2)) {
                                return { pos, boxes }
                        }

                        if (isBox(posBoxWouldMoveTo) || isBox(posBoxWouldMoveTo2)) {
                                const affectedBoxes = new Set<string>()
                                affectedBoxes.add(touchedBox)
                                const positionsToCheck = [boxPos]
                                while (positionsToCheck.length > 0) {
                                        const posToCheck = positionsToCheck.shift()!

                                        if (isWall({ x: posToCheck.x - 1, y: posToCheck.y }) || isWall({ x: posToCheck.x - 1, y: posToCheck.y + 1 })) {
                                                return { pos, boxes }
                                        }

                                        const nextTouchedBoxes = Array.from(boxes).filter((box) =>
                                                // left of box right above
                                                box == `${posToCheck.x - 1},${posToCheck.y}`
                                                // right of box to the left
                                                || box == `${posToCheck.x - 1},${posToCheck.y - 1}`
                                                // left of box to the right
                                                || box == `${posToCheck.x - 1},${posToCheck.y + 1}`
                                        )
                                        if (!nextTouchedBoxes) {
                                                throw new Error('Fake touching box wtf')
                                        }

                                        for (const nextBox of nextTouchedBoxes) {
                                                affectedBoxes.add(nextBox)
                                                positionsToCheck.push(deserialiseBox(nextBox))
                                        }
                                }
                                for (const box of affectedBoxes) {
                                        boxes.delete(box)
                                }
                                for (const box of affectedBoxes) {
                                        const coords = deserialiseBox(box)
                                        boxes.add(`${coords.x - 1},${coords.y}`)
                                }

                                return { pos: nextPosition, boxes }
                        } else {
                                boxes.delete(touchedBox)
                                boxes.add(`${posBoxWouldMoveTo.x},${posBoxWouldMoveTo.y}`)
                                return { pos: nextPosition, boxes }
                        }

                }

                if (ix == '<') {
                        let posBoxWouldMoveTo = { x: boxPos.x, y: boxPos.y - 1 }
                        // Cannot move box!
                        if (isWall(posBoxWouldMoveTo)) {
                                return { pos, boxes }
                        }
                        if (isBox(posBoxWouldMoveTo)) {
                                const affectedBoxes = new Set<string>()
                                affectedBoxes.add(touchedBox)
                                const positionsToCheck = [boxPos]
                                while (positionsToCheck.length > 0) {
                                        const posToCheck = positionsToCheck.shift()!

                                        if (isWall({ x: posToCheck.x, y: posToCheck.y - 1 })) {
                                                return { pos, boxes }
                                        }

                                        const nextTouchedBoxes = Array.from(boxes).filter((box) =>
                                                box == `${posToCheck.x},${posToCheck.y - 2}`
                                        )
                                        if (!nextTouchedBoxes) {
                                                throw new Error('Fake touching box wtf')
                                        }

                                        for (const nextBox of nextTouchedBoxes) {
                                                affectedBoxes.add(nextBox)
                                                positionsToCheck.push(deserialiseBox(nextBox))
                                        }
                                }
                                // All boxes moved to valid positions
                                for (const box of affectedBoxes) {
                                        boxes.delete(box)
                                }
                                for (const box of affectedBoxes) {
                                        const coords = deserialiseBox(box)
                                        boxes.add(`${coords.x},${coords.y - 1}`)
                                }

                                return { pos: nextPosition, boxes }
                        } else {
                                boxes.delete(touchedBox)
                                boxes.add(`${boxPos.x},${boxPos.y - 1}`)
                                return { pos: nextPosition, boxes }
                        }
                }
                if (ix == '>') {
                        let posBoxWouldMoveTo = { x: boxPos.x, y: boxPos.y + 1 }
                        // Cannot move box!               
                        if (isWall(posBoxWouldMoveTo) || isWall({ x: boxPos.x, y: boxPos.y + 2 })) {
                                return { pos, boxes }
                        }
                        if (isBox(posBoxWouldMoveTo)) {
                                const affectedBoxes = new Set<string>()
                                affectedBoxes.add(touchedBox)
                                const positionsToCheck = [boxPos]
                                while (positionsToCheck.length > 0) {
                                        const posToCheck = positionsToCheck.shift()!

                                        if (isWall({ x: posToCheck.x, y: posToCheck.y + 2 })) {
                                                return { pos, boxes }
                                        }

                                        const nextTouchedBoxes = Array.from(boxes).filter((box) =>
                                                box == `${posToCheck.x},${posToCheck.y + 2}`
                                        )
                                        if (!nextTouchedBoxes) {
                                                throw new Error('Fake touching box wtf')
                                        }

                                        for (const nextBox of nextTouchedBoxes) {
                                                affectedBoxes.add(nextBox)
                                                positionsToCheck.push(deserialiseBox(nextBox))
                                        }
                                }
                                for (const box of affectedBoxes) {
                                        boxes.delete(box)
                                }
                                for (const box of affectedBoxes) {
                                        const coords = deserialiseBox(box)
                                        boxes.add(`${coords.x},${coords.y + 1}`)
                                }

                                return { pos: nextPosition, boxes }
                        } else {
                                boxes.delete(touchedBox)
                                boxes.add(`${boxPos.x},${boxPos.y + 1}`)
                                return { pos: nextPosition, boxes }
                        }
                }

        }

        return { pos: nextPosition, boxes }
}

const part2 = async (test: boolean) => {
        const rawInput = await getInput(15, test)
        let [rawMap, rawMoveList] = A.partition(rawInput, (line) => S.startsWith(line, '#'))
        let initialMap = rawMap.map((line) => line.split(''))
        let map: string[][] = []
        let pos: Point = { x: -1, y: -1 }
        let boxes = new Set<string>()

        // Get scaledMap
        for (let x = 0; x < initialMap.length; x++) {
                map[x] = []
                for (let y = 0; y < initialMap[0].length; y++) {
                        let firstObject = initialMap[x][y]
                        let secondObject = initialMap[x][y]

                        if (initialMap[x][y] == '@') {
                                secondObject = '.'
                        }

                        if (initialMap[x][y] == 'O') {
                                firstObject = '['
                                secondObject = ']'
                        }

                        map[x].push(firstObject)
                        map[x].push(secondObject)
                }
        }

        // Get start pos :) 
        for (let x = 0; x < map.length; x++) {
                for (let y = 0; y < map[0].length; y++) {
                        if (map[x][y] == '@') {
                                pos = { x, y }
                        }
                        if (map[x][y] == '[') {
                                boxes.add(`${x},${y}`)
                        }
                }
        }

        // Move
        // @ts-ignore
        const moveList: Instruction[] = rawMoveList.join('')

        for (let i = 0; i < moveList.length; i++) {
                const ix = moveList[i];
                const res = handleMove2(ix, pos, map, boxes)
                boxes = res.boxes
                pos = res.pos
        }

        let sum = 0
        for (const box of boxes) {
                const { x, y } = deserialiseBox(box)
                sum += x * 100 + y
        }
        return sum
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
