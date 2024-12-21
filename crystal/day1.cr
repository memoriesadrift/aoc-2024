file = File.read("res/day1.in").split
left = [] of Int64
right = [] of Int64

file.each_with_index do |e, i|
  if i % 2 == 0
    left.push(e.to_i)
  else
    right.push(e.to_i)
  end
end
left = left.sort
right = right.sort

# Part 1
deltas = [] of Int64
(0...left.size).each do |i|
  deltas.push((left[i] - right[i]).abs)
end

# Part 2
occurences = [] of Int64
(0...left.size).each do |i|
  count = 0
  (0...right.size).each do |j|
    if left[i] == right[j]
      count += 1
    end
  end
  occurences.push(left[i] * count)
end

puts "Part 1: #{deltas.sum}"
puts "Part 2: #{occurences.sum}"
