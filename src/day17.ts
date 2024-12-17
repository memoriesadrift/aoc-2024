import { getInput } from "./utils.js"

type u3 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

type CPU = {
        A: number
        B: number
        C: number
        sp: number
        program: u3[]
        outBuf: number[]
}

type RegName = 'A' | 'B' | 'C'

const getRegFromComboOperand = (operand: u3): RegName => {
        switch (operand) {
                case 4:
                        return 'A'
                case 5:
                        return 'B'
                case 6:
                        return 'C'
                default:
                        throw new Error('Invalid combo operand')
        }
}

const getComboOperandValue = (cpu: CPU, operand: u3): number => {
        if (operand < 4) {
                return operand
        }
        if (operand == 7) {
                throw new Error('Operand 7 is invalid.')
        }
        return cpu[getRegFromComboOperand(operand)]
}

// opcode 0
const adv = (cpu: CPU, operand: u3) => {
        const num = cpu.A
        const denom = 2 ** getComboOperandValue(cpu, operand)

        const res = Math.floor(num / denom)
        cpu.A = res
        cpu.sp += 2
}

// opcode 1
const bxl = (cpu: CPU, operand: u3) => {
        const res = cpu.B ^ operand
        cpu.B = res
        cpu.sp += 2
}

// opcode 2
const bst = (cpu: CPU, operand: u3) => {
        const res = getComboOperandValue(cpu, operand) & 7
        cpu.B = res
        cpu.sp += 2
}

// opcode 3
const jnz = (cpu: CPU, operand: u3) => {
        if (cpu.A == 0) {
                cpu.sp += 2
                return
        }

        cpu.sp = operand
}

// opcode 4
const bxc = (cpu: CPU, _operand: u3) => {
        const res = cpu.B ^ cpu.C
        cpu.B = res
        cpu.sp += 2
}

// opcode 5
const out = (cpu: CPU, operand: u3) => {
        const res = getComboOperandValue(cpu, operand) & 7
        cpu.outBuf.push(res)
        cpu.sp += 2
}

// opcode 6
const bdv = (cpu: CPU, operand: u3) => {
        const num = cpu.A
        const denom = 2 ** getComboOperandValue(cpu, operand)

        const res = Math.floor(num / denom)
        cpu.B = res
        cpu.sp += 2
}

// opcode 7
const cdv = (cpu: CPU, operand: u3) => {
        const num = cpu.A
        const denom = 2 ** getComboOperandValue(cpu, operand)

        const res = Math.floor(num / denom)
        cpu.C = res
        cpu.sp += 2
}

const execute = (cpu: CPU) => {
        while (cpu.sp >= 0 && cpu.sp < cpu.program.length || cpu.outBuf.length > cpu.program.length) {
                const ix = cpu.program[cpu.sp]
                const op = cpu.program[cpu.sp + 1]
                switch (ix) {
                        case 0:
                                adv(cpu, op)
                                break
                        case 1:
                                bxl(cpu, op)
                                break
                        case 2:
                                bst(cpu, op)
                                break
                        case 3:
                                jnz(cpu, op)
                                break
                        case 4:
                                bxc(cpu, op)
                                break
                        case 5:
                                out(cpu, op)
                                break
                        case 6:
                                bdv(cpu, op)
                                break
                        case 7:
                                cdv(cpu, op)
                                break
                }
        }
        return cpu
}

const parseInput = (lines: string[]): CPU => {
        const regA = Number.parseInt(lines[0].slice(12))
        const regB = Number.parseInt(lines[1].slice(12))
        const regC = Number.parseInt(lines[2].slice(12))
        const program = lines[3]
                .slice(9)
                .split(',')
                .map((it) => Number.parseInt(it))
                .filter((it): it is u3 => it < 8)

        return {
                A: regA,
                B: regB,
                C: regC,
                sp: 0,
                outBuf: [],
                program,
        }
}

const part1 = async (test: boolean) => {
        const input = await getInput(17, test)
        const cpu = parseInput(input)
        execute(cpu)
        return cpu.outBuf.join(',')
}

const findInitialA = (targetA: number, returnValueIndex: number, program: u3[]): number => {
        if (returnValueIndex < 0)
                return targetA

        for (let initialA = targetA * 8; initialA < targetA * 8 + 8; initialA++) {
                const cpu = {
                        A: initialA,
                        B: 0,
                        C: 0,
                        program,
                        sp: 0,
                        outBuf: []
                }
                execute(cpu)
                if (cpu.outBuf[0] === program[returnValueIndex]) {
                        const finalVal = findInitialA(initialA, returnValueIndex - 1, program)
                        if (finalVal >= 0)
                                return finalVal
                }
        }
        return -1
}

const part2 = async (test: boolean) => {
        const input = await getInput(17, test)
        const cpu = parseInput(input)

        return findInitialA(0, cpu.program.length - 1, cpu.program)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
