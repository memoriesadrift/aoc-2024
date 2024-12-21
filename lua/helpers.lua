local M = {}

local function readFile(opts)
	local lines = {}
	local test = opts.test or false
	local ext = ".in"
	if test then
		ext = ext .. ".test"
	end
	local day = opts.day
	if not day then
		return {}
	end
	local path = "day" .. day

	for line in io.lines("res/" .. path .. ext) do
		lines[#lines + 1] = line
	end
	return lines
end

M.readFile = readFile

return M
