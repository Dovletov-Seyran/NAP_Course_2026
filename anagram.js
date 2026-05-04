function anagram(words) {
  const groups = {};

  for (const word of words) {
    const key = word.split("").sort().join("");
    if (!groups[key]) groups[key] = [];
    groups[key].push(word);
  }

  return Object.values(groups)
    .filter((g) => g.length >= 2)
    .map((g) => g.sort())
    .sort((a, b) => a[0].localeCompare(b[0]));
}

console.log(anagram(["eat", "tea", "tan", "ate", "nat", "bat"]));
