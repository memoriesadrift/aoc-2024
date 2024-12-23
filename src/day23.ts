import { A } from "@mobily/ts-belt"
import { getInput } from "./utils.js"

const part1 = async (test: boolean) => {
        const input = await getInput(23, test)
        const map = new Map<string, Set<string>>()
        const pairs = input.map((line) => line.split('-'))
        for (const [f, s] of pairs) {
                const fMap = map.get(f)
                const sMap = map.get(s)

                if (!fMap) {
                        const set = new Set<string>()
                        set.add(s)
                        map.set(f, set)
                } else {
                        fMap.add(s)
                }

                if (!sMap) {
                        const set = new Set<string>()
                        set.add(f)
                        map.set(s, set)
                } else {
                        sMap.add(f)
                }
        }

        const triplets = []
        for (const [key, neighbours] of map.entries()) {
                for (const neighbour of neighbours.values()) {
                        const neighboursNeighbours = map.get(neighbour)
                        // No triplet possible
                        if (!neighbour || neighbours.size == 0)
                                return

                        for (const n2 of neighboursNeighbours!.values()) {
                                // if first point neighbours this point, we found a triplet
                                if (neighbours.has(n2)) {
                                        triplets.push([key, neighbour, n2])
                                }

                        }
                }
        }
        return A.uniq(triplets.map((triplet) => triplet.sort())).filter((arr) => arr.some((pc) => pc.startsWith('t'))).length
}

const part2 = async (test: boolean) => {
        const input = await getInput(23, test)
        const pairs = input.map((line) => line.split('-'))
        const graph: Record<string, string[]> = {}
        for (const [f, s] of pairs) {
                if (!graph[f])
                        graph[f] = []
                if (!graph[s])
                        graph[s] = []

                graph[f].push(s)
                graph[s].push(f)
        }

        const cliques: Set<string>[] = []
        const bronKerbosch = (R: Set<string>, P: Set<string>, X: Set<string>, graph: Record<string, string[]>): void => {
                // If P and X are empty, R is a maximal clique
                if (P.size === 0 && X.size === 0) {
                        cliques.push(new Set(R))
                        return
                }

                // For each potential candidate
                for (const candidate of Array.from(P)) {
                        // Get neighbours of candidate
                        const neighbours = graph[candidate] || new Set()

                        const hasNeighbour = (arr: string[], neighbour: string) => arr.some((item) => item == neighbour)

                        // Run recursively: 
                        // R becomes R + candidate
                        // filter P to contain only neighbours of the candidate
                        // filter X to contain only neighbours of the candidate
                        bronKerbosch(
                                new Set([...R, candidate]),
                                new Set([...P].filter(node => hasNeighbour(neighbours, node))),
                                new Set([...X].filter(node => hasNeighbour(neighbours, node))),
                                graph
                        )
                        P.delete(candidate)
                        X.add(candidate)
                }
        }

        bronKerbosch(new Set(), new Set(Object.keys(graph)), new Set(), graph)

        return Array.from(cliques.sort((a, b) => b.size - a.size)[0]).sort().join(',')
}

console.log('Part 1: ', await part1(false))
console.log('Part 2: ', await part2(false))
