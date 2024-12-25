import { A, pipe } from "@mobily/ts-belt"
import { getInputKeepEmptyLines } from "./utils.js"

const transpose = (matrix: string[][]) => {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
}

const part1 = async (test: boolean) => {
        const input = await getInputKeepEmptyLines(25, test)
        const processed: string[][] = []
        let acc: string[] = []
        for (const line of input) {
                if (line == '') {
                        processed.push(acc)
                        acc = []
                        continue
                }
                acc.push(line)
        }
        const [lockPatterns, keyPatterns] = A.partition(processed, (arr) => arr[0].split('').every((c) => c == '#'))

        const locks = pipe(
                lockPatterns,
                A.map((pattern) => pattern.map((line) => line.split(''))),
                A.map(transpose)
        )

        const keys = pipe(
                keyPatterns,
                A.map((pattern) => pattern.map((line) => line.split(''))),
                A.map(transpose)
        )

        const lockHeights = pipe(
                locks,
                A.map((lock) => lock.map((row) => row.filter((c) => c == '#').length - 1))
        )

        const keyHeights = pipe(
                keys,
                A.map((lock) => lock.map((row) => row.filter((c) => c == '#').length - 1))
        )
        let validKeys = 0
        for (const lock of lockHeights) {
                for (const key of keyHeights) {
                        let overlaps = false
                        for (let i = 0; i < lock.length; i++) {
                                const lockPin = lock[i]
                                const keyPin = key[i]
                                // Overlap
                                if (lockPin + keyPin > 5) {
                                        overlaps = true
                                        break
                                }
                        }
                        if (!overlaps) {
                                validKeys++
                        }
                }
        }
        return validKeys
}

const part2 = async (_test: boolean) => {
        return 'Merry Christmas, God Bless us Everybody'
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(true))
