import { A, F } from '@mobily/ts-belt'
import { getInput } from "./utils.js"

const transpose = (matrix: string[][]) => {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]))
}

const countOccurences = (line: string[]) => {
        const xmasRegex = /XMAS/g
        const s = line.join('')
        const matches = Array.from(s.matchAll(xmasRegex))

        return matches.length
}

const getDiagonals = (matrix: string[][]) => {
        const rows = matrix.length
        const cols = matrix[0].length
        const diagonals: { primary: string[][], secondary: string[][] } = {
                primary: [],
                secondary: []
        }

        // Get primary diagonals (top-left to bottom-right)
        for (let d = 0; d < rows + cols - 1; d++) {
                const primaryDiagonal = []
                for (let i = 0; i < rows; i++) {
                        const j = d - i
                        if (j >= 0 && j < cols) {
                                primaryDiagonal.push(matrix[i][j])
                        }
                }
                if (primaryDiagonal.length) diagonals.primary.push(primaryDiagonal)
        }

        // Get secondary diagonals (top-right to bottom-left)
        for (let d = 0; d < rows + cols - 1; d++) {
                const secondaryDiagonal = []
                for (let i = 0; i < rows; i++) {
                        const j = d - (rows - 1 - i)
                        if (j >= 0 && j < cols) {
                                secondaryDiagonal.push(matrix[i][j])
                        }
                }
                if (secondaryDiagonal.length) diagonals.secondary.push(secondaryDiagonal)
        }

        return diagonals
}

const isXmasTile = (tile: string[][]) => {
        // A must be in middle
        if (tile[1][1] != 'A') return false

        const arm1 = [tile[0][0], tile[1][1], tile[2][2]]
        const arm2 = [tile[0][2], tile[1][1], tile[2][0]]
        if (arm1.join('') !== 'MAS' && arm1.toReversed().join('') !== 'MAS') return false
        if (arm2.join('') !== 'MAS' && arm2.toReversed().join('') !== 'MAS') return false
        return true
}


const part1 = async () => {
        const lines = await getInput(4, false)
        const rows = lines.map((line) => line.split(''))
        const rowsRev = rows.map((row) => F.toMutable(A.reverse(row)))
        const cols = transpose(rows)
        const colsRev = cols.map((col) => F.toMutable(A.reverse(col)))

        const rowCount = rows.map((line) => countOccurences(line)).reduce((acc, curr) => acc + curr, 0)
        const rowRevCount = rowsRev.map((line) => countOccurences(line)).reduce((acc, curr) => acc + curr, 0)
        const colCount = cols.map((line) => countOccurences(line)).reduce((acc, curr) => acc + curr, 0)
        const colRevCount = colsRev.map((line) => countOccurences(line)).reduce((acc, curr) => acc + curr, 0)
        const { primary, secondary } = getDiagonals(rows)
        const diagonalsCount = primary.map((line) => countOccurences(line) + countOccurences(F.toMutable(A.reverse(line)))).reduce((acc, curr) => acc + curr, 0)
        const diagonalsCount2 = secondary.map((line) => countOccurences(line) + countOccurences(F.toMutable(A.reverse(line)))).reduce((acc, curr) => acc + curr, 0)

        return rowCount + rowRevCount + colCount + colRevCount + diagonalsCount + diagonalsCount2
}

const part2 = async () => {
        const lines = await getInput(4, false)
        const matrix = lines.map((line) => line.split(''))

        const validTiles = []
        for (let startRow = 0; startRow < matrix.length; startRow += 1) {
                for (let startCol = 0; startCol < matrix[0].length; startCol += 1) {
                        let tile: string[][] = []
                        for (let row = startRow; row < startRow + 3 && row < matrix.length; row++) {
                                let tileRow: string[] = []
                                for (let col = startCol; col < startCol + 3 && col < matrix[0].length; col++) {
                                        tileRow.push((matrix[row][col]))
                                }
                                tile.push(tileRow)
                        }
                        if (tile.length === 3 && tile.every((row) => row.length === 3)) {
                                validTiles.push(tile)
                        }
                }
        }
        const validities = validTiles.map(isXmasTile)
        return validities.map((it) => it ? 1 : 0).reduce<number>((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1())
console.log('Part 2: ', await part2())
