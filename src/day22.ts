import { getInput } from "./utils.js"

const memo = new Map<bigint, bigint>()

const mix = (a: bigint, b: bigint) => a ^ b
const prune = (n: bigint) => n % 16777216n

const nextSecretNumber = (n: bigint): bigint => {
        if (memo.has(n))
                return memo.get(n)!
        // ix 1
        const s1 = n * 64n
        const s2 = mix(n, s1)
        const s3 = prune(s2)
        // ix 2
        const s4 = s3 / 32n
        const s5 = mix(s3, s4)
        const s6 = prune(s5)
        // ix 3
        const s7 = s6 * 2048n
        const s8 = mix(s6, s7)
        const res = prune(s8)

        memo.set(n, res)
        return res
}

const part1 = async (test: boolean) => {
        let nums = (await getInput(22, test)).map((line) => BigInt(line))
        for (let i = 0; i < 2000; i++) {
                nums = nums.map((n) => nextSecretNumber(n))
        }
        return nums.reduce((acc, curr) => acc + curr, 0n)
}
const part2 = async (test: boolean) => {
        let nums = (await getInput(22, test)).map((line) => BigInt(line))
        let prices: number[][] = [nums.map((n) => Number.parseInt((n % 10n).toString()))]
        let deltas: number[][] = []
        for (let i = 0; i < 2000; i++) {
                nums = nums.map((n) => nextSecretNumber(n))
                const lastDigits = nums.map((n) => Number.parseInt((n % 10n).toString()))
                prices.push(lastDigits)
        }

        // Compute deltas
        for (let i = 1; i < prices.length; i++) {
                const d = prices[i].map((_, j) => prices[i][j] - prices[i - 1][j])
                deltas.push(d)
        }

        const upperMap = new Map<number, Map<string, number>>()
        for (let j = 0; j < prices[0].length; j++) {
                const map = new Map<string, number>()
                for (let i = 4; i < prices.length; i++) {
                        const seq = [deltas[i - 4][j], deltas[i - 3][j], deltas[i - 2][j], deltas[i - 1][j]]
                        const price = prices[i][j]
                        const key = seq.join(',')
                        if (map.has(key))
                                continue
                        map.set(key, price)
                }
                upperMap.set(j, map)
        }
        const sumMap = new Map<string, number>()
        for (const map of upperMap.values()) {
                for (const [key, value] of map.entries()) {
                        const prev = sumMap.get(key) || 0
                        sumMap.set(key, prev + value)
                }
        }

        return Math.max(...sumMap.values())
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
