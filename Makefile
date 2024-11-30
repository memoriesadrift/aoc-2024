# run with make run day=n
.PHONY: run
run:
	pnpm exec tsx src/day$(day).ts
