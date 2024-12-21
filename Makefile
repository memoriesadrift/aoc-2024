# run with make run day=n
.PHONY: run
run:
	pnpm exec tsx src/day$(day).ts


output_file := src/day$(day).ts
.PHONY: scaffold
scaffold:
	touch res/day$(day).in res/day$(day).in.test
	@echo 'import { getInput } from "./utils.js"' > $(output_file)
	@echo '' >> $(output_file)
	@echo 'const part1 = async (test: boolean) => {' >> $(output_file)
	@echo '        const input = await getInput($(day), test)' >> $(output_file)
	@echo '        return input' >> $(output_file)
	@echo '}' >> $(output_file)
	@echo 'const part2 = async (test: boolean) => {' >> $(output_file)
	@echo '        const input = await getInput($(day), test)' >> $(output_file)
	@echo '        return input' >> $(output_file)
	@echo '}' >> $(output_file)
	@echo '' >> $(output_file)
	@echo 'console.log('\''Part 1: '\'' , await part1(true))' >> $(output_file)
	@echo 'console.log('\''Part 2: '\'' , await part2(true))' >> $(output_file)

# run with make run day=n
.PHONY: crystal
crystal:
	crystal run crystal/day$(day).cr

# run with make run day=n
.PHONY: lua
lua:
	lua lua/day$(day).lua
