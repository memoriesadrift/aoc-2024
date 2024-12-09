import { getInputAsSingleLine } from "./utils.js"

const part1 = async (test: boolean) => {
        const nums = (await getInputAsSingleLine(9, test))
                .split('')
                // For some weird reason without the arg it randomly outputs NaN
                .map((it) => Number.parseInt(it))
        let disk = []
        let currentFileId = 0
        let isFile = true
        for (let i = 0; i < nums.length; i++) {
                const num = nums[i];
                disk.push(new Array(num).fill(isFile ? currentFileId : NaN))
                if (isFile)
                        currentFileId++
                isFile = !isFile
        }
        disk = disk.flat()

        let lastFileIdx = disk.findLastIndex((it) => !Number.isNaN(it))
        for (let i = 0; i < disk.length; i++) {
                const currPtr = disk[i]
                if (!Number.isNaN(currPtr))
                        continue
                /*
                console.log('Disk: ', disk.join(','))
                console.log('Swapping', i, lastFileIdx)
                */

                // is empty spot
                disk[i] = disk[lastFileIdx]
                disk[lastFileIdx] = NaN
                lastFileIdx = disk.findLastIndex((it) => !Number.isNaN(it))
                // Break if we only have 1 contiguous file chunk
                if (!disk.slice(0, lastFileIdx).some((it) => Number.isNaN(it))) {
                        break
                }
        }

        return disk.reduce<number>((acc, curr, idx) => {
                if (Number.isNaN(curr))
                        return acc
                return acc + curr * idx
        }, 0)
}

const part2 = async (test: boolean) => {
        const nums = (await getInputAsSingleLine(9, test))
                .split('')
                // For some weird reason without the arg it randomly outputs NaN
                .map((it) => Number.parseInt(it))
        let disk = []
        let currentFileId = 0
        let isFile = true
        for (let i = 0; i < nums.length; i++) {
                const num = nums[i];
                disk.push(new Array(num).fill(isFile ? currentFileId : NaN))
                if (isFile)
                        currentFileId++
                isFile = !isFile
        }
        disk = disk.flat()

        let lastFileBlockEnd = disk.findLastIndex((it) => !Number.isNaN(it))
        let firstEmptyBlockStart = disk.findIndex((it) => Number.isNaN(it))
        let fileIdToMove = disk[lastFileBlockEnd]
        let i = lastFileBlockEnd
        while (i >= 0) {
                let fileContent = disk[i]
                if (Number.isNaN(fileContent)) {
                        i--
                        continue
                }
                if (fileContent > fileIdToMove) {
                        i--
                        continue
                }
                fileIdToMove--
                let fileLength = 0
                let seek = i
                while (disk[seek] == fileContent) {
                        fileLength++
                        seek--
                }
                const fileBlockStart = seek + 1
                //console.log('File found between idxs with length, file: ', seek + 1, i, fileLength, disk.slice(seek + 1, i + 1))

                // Swap file with first empty block if possible
                while (firstEmptyBlockStart < fileBlockStart) {
                        let seekEmpty = firstEmptyBlockStart
                        let emptyLength = 0
                        while (Number.isNaN(disk[seekEmpty])) {
                                emptyLength++
                                seekEmpty++
                        }
                        if (emptyLength == 0) {
                                firstEmptyBlockStart++
                                continue
                        }
                        //console.log('Free space found between idxs with length, file: ', firstEmptyBlockStart, seekEmpty, emptyLength, disk.slice(firstEmptyBlockStart, seekEmpty))

                        if (fileLength <= emptyLength) {
                                for (let j = 0; j < fileLength; j++) {
                                        disk[firstEmptyBlockStart + j] = fileContent
                                        disk[fileBlockStart + j] = NaN
                                }
                                firstEmptyBlockStart = disk.findIndex((it) => Number.isNaN(it))
                                //console.log('Updated: ', disk)
                                break
                        }


                        firstEmptyBlockStart += emptyLength
                }

                firstEmptyBlockStart = disk.findIndex((it) => Number.isNaN(it))
                i = seek
        }

        return disk
                .reduce<number>((acc, curr, idx) => {
                        if (Number.isNaN(curr))
                                return acc
                        return acc + curr * idx
                }, 0)
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
