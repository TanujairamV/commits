import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";

const gradientLevels = {
  0: 0,    // No commit
  1: 1,    // Lightest
  2: 3,    // Light
  3: 5,    // Medium
  4: 8     // Strongest
};

// Load the pattern from data.json
const pattern = jsonfile.readFileSync(path);

const makeCommit = (date) => {
  const data = { date };
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(path, data, (err) => {
      if (err) return reject(err);
      simpleGit()
        .add([path])
        .commit(date, { "--date": date })
        .then(() => resolve())
        .catch(reject);
    });
  });
};

const runCommits = async () => {
  const startDate = moment().subtract(1, "year").add(1, "day"); // Start one year ago + 1 day
  const weeks = pattern[0].length;
  const rows = pattern.length;

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < rows; d++) {
      const level = pattern[d][w];
      if (level === 0) continue;

      const commitsCount = gradientLevels[level];
      const date = startDate.clone().add(w, "weeks").add(d, "days").format();

      for (let c = 0; c < commitsCount; c++) {
        await makeCommit(date);
        console.log(`Committed on ${date} with intensity ${level}`);
      }
    }
  }

  // Final push
  await simpleGit().push();
  console.log("All commits pushed!");
};

runCommits().catch(console.error);
