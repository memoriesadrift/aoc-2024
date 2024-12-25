import { getInputKeepEmptyLines } from "./utils.js"

type Gate = {
        in1: string,
        in2: string,
        op: string,
        out: string,
}

const part1 = async (test: boolean) => {
        const input = await getInputKeepEmptyLines(24, test)
        let parseRegs = true
        const regs: Record<string, number> = {}
        const ixs: Gate[] = []

        for (let i = 0; i < input.length; i++) {
                if (input[i] == '') {
                        parseRegs = false;
                        continue
                }
                if (parseRegs) {
                        const [reg, value] = input[i].split(': ')
                        regs[reg] = Number.parseInt(value)
                } else {
                        const [tmpIxs, out] = input[i].split(' -> ')
                        const [in1, op, in2] = tmpIxs.split(' ')
                        ixs.push({
                                in1,
                                in2,
                                op,
                                out,
                        })
                }
        }

        // Process instructions until we have all values
        const queue = [...ixs]
        while (queue.length > 0) {
                const gate = queue.shift()!
                const { in1, in2, op, out } = gate
                const v1 = regs[in1]
                const v2 = regs[in2]
                // Wait for values
                if (v1 == null || v2 == null) {
                        queue.push(gate)
                        continue
                }

                switch (op) {
                        case 'AND':
                                regs[out] = v1 && v2
                                break
                        case 'OR':
                                regs[out] = v1 || v2
                                break
                        case 'XOR':
                                regs[out] = v1 ^ v2
                                break
                        default:
                                throw new Error(`Unknown op: ${op}`)
                }
        }

        return Number.parseInt(Object.entries(regs)
                .filter(([k, _]) => k.startsWith('z'))
                .sort((a, b) => Number.parseInt(b[0].slice(1)) - Number.parseInt(a[0].slice(1)))
                .map(([_, v]) => v)
                .join(''), 2)
}

const processIxs = (ixs: Gate[], regs: Record<string, number>) => {
        // Process instructions until we have all values
        const queue = [...ixs]
        while (queue.length > 0) {
                const gate = queue.shift()!
                const { in1, in2, op, out } = gate
                const v1 = regs[in1]
                const v2 = regs[in2]
                // Wait for values
                if (v1 == null || v2 == null) {
                        queue.push(gate)
                        continue
                }

                switch (op) {
                        case 'AND':
                                regs[out] = v1 && v2
                                break
                        case 'OR':
                                regs[out] = v1 || v2
                                break
                        case 'XOR':
                                regs[out] = v1 ^ v2
                                break
                        default:
                                throw new Error(`Unknown op: ${op}`)
                }
        }
        return regs
}


const part2 = async (test: boolean) => {
        const input = await getInputKeepEmptyLines(24, test)
}

console.log('Part 1: ', await part1(false))
//console.log('Part 2: ', await part2(false))
