import { getInput } from "./utils.js"

const allDecreasing = (list: number[]) => {
        // Assume the list is non-empty, because it is in test data
        let prev = list[0]
        for (let i = 1; i < list.length; i++) {
                const curr = list[i];
                if (prev < curr) {
                        return false
                }
                prev = curr
        }
        return true
}
const allIncreasing = (list: number[]) => {
        // Assume the list is non-empty, because it is in test data
        let prev = list[0]
        for (let i = 1; i < list.length; i++) {
                const curr = list[i];
                if (prev > curr) {
                        return false
                }
                prev = curr
        }
        return true
}
const stepsAreOk = (list: number[]) => {
        // Assume the list is non-empty, because it is in test data
        let prev = list[0]
        for (let i = 1; i < list.length; i++) {
                const curr = list[i];
                const diff = Math.abs(curr - prev)
                if (!(diff >= 1 && diff <= 3)) {
                        return false
                }
                prev = curr
        }
        return true
}

const part1 = async () => {
        const lines = await getInput(2, false)
        const reports = lines.map((line) => line.split(' ').map((it) => Number.parseInt(it)))
        return reports.map((report) => (allDecreasing(report) || allIncreasing(report)) && stepsAreOk(report)).map((it) => it ? 1 : 0).reduce<number>((acc, curr) => acc + curr, 0)
}

const part2 = async () => {
        const lines = await getInput(2, false)
        const reports = lines.map((line) => line.split(' ').map((it) => Number.parseInt(it)))
        // Could be passed in as an argument to avoid recomputing, rereading input etc etc, but I don't care
        const baselineOkReports = await part1()
        const invalidReports = reports.map((report) => ({
                report,
                validity: (allDecreasing(report) || allIncreasing(report)) && stepsAreOk(report)
        })).filter((it) => !it.validity)
        const newValidities = invalidReports.map(({ report }) => {
                let permutations: number[][] = []
                for (let i = 0; i < report.length; i++) {
                        const curr = report[i];
                        permutations.push(
                                [
                                        ...report.slice(0, i),
                                        ...(i + 1 === report.length ? [] : report.slice(i + 1))
                                ]
                        )
                }
                return permutations.map((report) => (allDecreasing(report) || allIncreasing(report)) && stepsAreOk(report)).some((it) => it)
        })

        return baselineOkReports + newValidities.map((it) => it ? 1 : 0).reduce<number>((acc, curr) => acc + curr, 0)
}

console.log('Part 1: ', await part1())
console.log('Part 2: ', await part2())
