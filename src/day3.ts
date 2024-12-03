import { getInputAsSingleLine } from "./utils.js"

const part1 = async () => {
        const mulRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g
        const line = await getInputAsSingleLine(3, false)
        const matches = Array.from(line.matchAll(mulRegex)).map((it) => it[0])
                .map((ix) => {
                        const numRegex = /[0-9]{1,3}/g
                        return Array.from(ix.matchAll(numRegex))
                                .map(it => Number.parseInt(it[0]))
                                .reduce((acc, curr) => acc * curr, 1)
                })
                .reduce((acc, curr) => acc + curr, 0)

        return matches
}

const part2 = async () => {
        const regex = /(mul\([0-9]{1,3},[0-9]{1,3}\))|(do\(\))|(don't\(\))/g
        const line = await getInputAsSingleLine(3, false)
        const matches = Array.from(line.matchAll(regex)).map((it) => it[0])
        let execute = true
        let total = 0
        for (let i = 0; i < matches.length; i++) {
                const ix = matches[i];
                if (ix == 'do()') {
                        execute = true
                        continue
                }

                if (ix == "don't()") {
                        execute = false
                        continue
                }
                if (ix.slice(0, 3) == "mul" && execute === true) {
                        const numRegex = /[0-9]{1,3}/g
                        const sum = Array.from(ix.matchAll(numRegex))
                                .map(it => Number.parseInt(it[0]))
                                .reduce((acc, curr) => acc * curr, 1)
                        total += sum
                }
        }

        return total
}

console.log('Part 1: ', await part1())
console.log('Part 2: ', await part2())
