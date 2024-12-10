import { readFile } from 'fs/promises';

export const getInputFromFile = async (day: number, test: boolean): Promise<string> => {
        const content = await readFile(`./res/day${day}.in${test ? '.test' : ''}`, 'utf-8')

        return content
}

export const getInput = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n').filter((line) => line.length > 0)

export const getInputAsSingleLine = async (day: number, test = false) => (await getInputFromFile(day, test)).trimEnd()

export const getInputKeepEmptyLines = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n')

export const getInputSplitBy = async (day: number, split: string, test = false) => (await getInputFromFile(day, test)).split(split)

export const getInputAsIntList = async (day: number, test = false) => (await getInput(day, test)).map((e) => Number.parseInt(e))

export const getInputAsCommaSeparatedIntList = async (day: number, test = false) => (await getInputFromFile(day, test)).split(',').map((e) => Number.parseInt(e))

export const getInputAsListOfCharacters = async (day: number, test = false) => (await getInputAsSingleLine(day, test)).split('')

export const getInputAsListOfDigits = async (day: number, test = false) => (await getInputAsSingleLine(day, test)).split('').map((it) => Number.parseInt(it))

export const getInputAs2dArray = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n').filter((line) => line.length > 0).map((line) => line.split(''))

export const getInputAs2dIntArray = async (day: number, test = false) => (await getInputFromFile(day, test)).split('\n').filter((line) => line.length > 0).map((line) => line.split('').map((it) => Number.parseInt(it)))

