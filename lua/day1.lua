local aoc = require("./lua/helpers")

local function split(str)
	local result = {}
	for match in str:gmatch("%S+") do
		table.insert(result, match)
	end
	return result
end

local function part1(opts)
	local lines = aoc.readFile(opts)
	local lefts = {}
	local rights = {}
	for _, value in ipairs(lines) do
		local left, right = table.unpack(split(value))
		table.insert(lefts, left)
		table.insert(rights, right)
	end
	table.sort(lefts, function(a, b)
		return a < b
	end)

	table.sort(rights, function(a, b)
		return a < b
	end)

	local sum = 0
	for i = 1, #lefts do
		sum = sum + math.abs(lefts[i] - rights[i])
	end

	return sum
end

local function part2(opts)
	local lines = aoc.readFile(opts)
	local lefts = {}
	local rights = {}
	for _, value in ipairs(lines) do
		local left, right = table.unpack(split(value))
		table.insert(lefts, left)
		table.insert(rights, right)
	end

	local sum = 0
	for i = 1, #lefts do
		local count = 0
		for j = 1, #rights do
			if rights[j] == lefts[i] then
				count = count + 1
			end
		end
		sum = sum + lefts[i] * count
	end

	return sum
end

print(part1({ day = 1, test = false }))
print(part2({ day = 1, test = false }))
